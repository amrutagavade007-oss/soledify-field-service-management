const upload = require("../middleware/upload");
const path = require("path");
const fs = require("fs");
const express = require("express");
const { body, validationResult } = require("express-validator");
const pool = require("../config/db");

const router = express.Router();

// GET all visits
router.get("/", async (req, res) => {
    try {
        const [visits] = await pool.query(`
            SELECT
                v.visit_id,
                v.visit_type,
                v.scheduled_date,
                v.status,
                s.site_id,
                s.project_name,
                s.site_address,
                c.full_name AS customer_name,
                u.full_name AS technician_name
            FROM visits v
            JOIN sites s ON v.site_id = s.site_id
            JOIN customers c ON s.customer_id = c.customer_id
            JOIN users u ON v.technician_id = u.user_id
            ORDER BY v.created_at DESC
        `);

        res.json({
            success: true,
            count: visits.length,
            data: visits
        });
    } catch (error) {
        console.error("Fetch visits error:", error.message);
        res.status(500).json({
            success: false,
            message: "Unable to retrieve visits"
        });
    }
});

/* GET site visit records with optional filters */
router.get("/records", async (req, res) => {
    try {
        const { site_id, from_date, to_date, visit_type, status } = req.query;

        let sql = `
            SELECT
                v.visit_id,
                v.site_id,
                v.technician_id,
                v.visit_type,
                v.scheduled_date,
                v.started_at,
                v.submitted_at,
                v.reviewed_at,
                v.status,
                v.reviewer_comments,
                s.project_name,
                s.site_address,
                s.city,
                s.state,
                c.full_name AS customer_name
            FROM visits v
            JOIN sites s ON v.site_id = s.site_id
            LEFT JOIN customers c ON s.customer_id = c.customer_id
            WHERE 1 = 1
        `;

        const params = [];

        if (site_id) {
            const siteId = Number(site_id);

            if (!Number.isSafeInteger(siteId) || siteId <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid site_id"
                });
            }

            sql += " AND v.site_id = ?";
            params.push(siteId);
        }

        if (from_date) {
            if (!/^\d{4}-\d{2}-\d{2}$/.test(from_date)) {
                return res.status(400).json({
                    success: false,
                    message: "from_date must use YYYY-MM-DD format"
                });
            }

            sql += " AND v.scheduled_date >= ?";
            params.push(from_date);
        }

        if (to_date) {
            if (!/^\d{4}-\d{2}-\d{2}$/.test(to_date)) {
                return res.status(400).json({
                    success: false,
                    message: "to_date must use YYYY-MM-DD format"
                });
            }

            sql += " AND v.scheduled_date < DATE_ADD(?, INTERVAL 1 DAY)";
            params.push(to_date);
        }

        if (visit_type) {
            const allowedTypes = [
                "pre_installation",
                "post_installation",
                "maintenance"
            ];

            if (!allowedTypes.includes(visit_type)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid visit_type"
                });
            }

            sql += " AND v.visit_type = ?";
            params.push(visit_type);
        }

        if (status) {
            const allowedStatuses = [
                "Scheduled",
                "In Progress",
                "Submitted",
                "Approved",
                "Returned",
                "Closed"
            ];

            if (!allowedStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid status"
                });
            }

            sql += " AND v.status = ?";
            params.push(status);
        }

        sql += " ORDER BY v.scheduled_date DESC, v.visit_id DESC";

        const [rows] = await pool.execute(sql, params);

        return res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        console.error("Get site visit records error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve site visit records"
        });
    }
});

// GET one visit by ID
router.get("/:id", async (req, res) => {
    try {
        const visitId = Number(req.params.id);

        if (!Number.isSafeInteger(visitId) || visitId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid visit ID"
            });
        }

        const [visits] = await pool.execute(`
            SELECT
                v.*,
                s.project_name,
                s.site_address,
                c.full_name AS customer_name,
                u.full_name AS technician_name
            FROM visits v
            JOIN sites s ON v.site_id = s.site_id
            JOIN customers c ON s.customer_id = c.customer_id
            JOIN users u ON v.technician_id = u.user_id
            WHERE v.visit_id = ?
        `, [visitId]);

        if (visits.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Visit not found"
            });
        }

        res.json({
            success: true,
            data: visits[0]
        });
    } catch (error) {
        console.error("Fetch visit error:", error.message);
        res.status(500).json({
            success: false,
            message: "Unable to retrieve visit"
        });
    }
});

// CREATE a new visit
router.post(
    "/",
    [
        body("site_id").isInt({ min: 1 }),
        body("technician_id").isInt({ min: 1 }),
        body("visit_type").isIn([
            "pre_installation",
            "post_installation",
            "maintenance"
        ]),
        body("scheduled_date")
            .optional({ values: "null" })
            .isISO8601()
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const {
            site_id,
            technician_id,
            assigned_by,
            visit_type,
            scheduled_date
        } = req.body;

        try {
            const [result] = await pool.execute(`
                INSERT INTO visits
                    (site_id, technician_id, assigned_by,
                     visit_type, scheduled_date, status)
                VALUES (?, ?, ?, ?, ?, 'Scheduled')
            `, [
                site_id,
                technician_id,
                assigned_by ?? null,
                visit_type,
                scheduled_date ?? null
            ]);

            res.status(201).json({
                success: true,
                message: "Visit created successfully",
                visit_id: result.insertId
            });
        } catch (error) {
            console.error("Create visit error:", error.message);

            if (error.code === "ER_NO_REFERENCED_ROW_2") {
                return res.status(400).json({
                    success: false,
                    message: "The specified site or user does not exist"
                });
            }

            res.status(500).json({
                success: false,
                message: "Unable to create visit"
            });
        }
    }
);

// UPDATE visit status
router.patch(
    "/:id/status",
    [
        body("status").isIn([
            "Scheduled",
            "In Progress",
            "Submitted",
            "Approved",
            "Returned",
            "Closed"
        ])
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const visitId = Number(req.params.id);
        const { status } = req.body;

        if (!Number.isSafeInteger(visitId) || visitId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid visit ID"
            });
        }

        try {
            const [result] = await pool.execute(
               ` UPDATE visits
               SET status = ?,
               submitted_at = CASE
             WHEN ? = 'Submitted' THEN COALESCE(submitted_at, NOW())
             ELSE submitted_at
              END
             WHERE visit_id = ?`,
               [status, status, visitId]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Visit not found"
                });
            }

            res.json({
                success: true,
                message: "Visit status updated successfully",
                visit_id: visitId,
                status
            });
        } catch (error) {
            console.error("Update visit status error:", error.message);

            res.status(500).json({
                success: false,
                message: "Unable to update visit status"
            });
        }
    }
);

// SAVE survey answers for a visit
router.post(
    "/:id/answers",
    async (req, res) => {
        const visitId = Number(req.params.id);
        const { answers } = req.body;

        if (!Number.isSafeInteger(visitId) || visitId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid visit ID"
            });
        }

        if (!Array.isArray(answers) || answers.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Answers must be a non-empty array"
            });
        }

        for (const answer of answers) {
            if (
                !answer.question_key ||
                typeof answer.question_key !== "string" ||
                answer.question_key.length > 100
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Every answer must have a question_key of at most 100 characters"
                });
            }
        }

        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            const [visits] = await connection.execute(
                "SELECT visit_id FROM visits WHERE visit_id = ?",
                [visitId]
            );

            if (visits.length === 0) {
                await connection.rollback();

                return res.status(404).json({
                    success: false,
                    message: "Visit not found"
                });
            }

            for (const answer of answers) {
                const answerValue =
                    answer.answer_value === null ||
                    answer.answer_value === undefined
                        ? null
                        : typeof answer.answer_value === "object"
                            ? JSON.stringify(answer.answer_value)
                            : String(answer.answer_value);

                const allowedTypes = [
                    "text", "number", "boolean", "date", "json"
                ];

                const answerType = allowedTypes.includes(answer.answer_type)
                    ? answer.answer_type
                    : "text";

                await connection.execute(
                    `INSERT INTO survey_answers
                        (visit_id, section_name, question_key,
                         question_label, answer_value, answer_type)
                     VALUES (?, ?, ?, ?, ?, ?)
                     ON DUPLICATE KEY UPDATE
                        section_name = VALUES(section_name),
                        question_label = VALUES(question_label),
                        answer_value = VALUES(answer_value),
                        answer_type = VALUES(answer_type)`,
                    [
                        visitId,
                        answer.section_name || null,
                        answer.question_key,
                        answer.question_label || null,
                        answerValue,
                        answerType
                    ]
                );
            }

            await connection.commit();

            res.status(201).json({
                success: true,
                message: "Survey answers saved successfully",
                visit_id: visitId,
                saved_count: answers.length
            });
        } catch (error) {
            await connection.rollback();

            console.error("Save survey answers error:", error.message);

            res.status(500).json({
                success: false,
                message: "Unable to save survey answers"
            });
        } finally {
            connection.release();
        }
    }
);

// GET survey answers for a visit
router.get("/:id/answers", async (req, res) => {
    const visitId = Number(req.params.id);

    if (!Number.isSafeInteger(visitId) || visitId <= 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid visit ID"
        });
    }

    try {
        const [answers] = await pool.execute(
            `SELECT answer_id, visit_id, section_name, question_key,
                    question_label, answer_value, answer_type,
                    created_at, updated_at
             FROM survey_answers
             WHERE visit_id = ?
             ORDER BY answer_id`,
            [visitId]
        );

        res.json({
            success: true,
            count: answers.length,
            data: answers
        });
    } catch (error) {
        console.error("Fetch survey answers error:", error.message);

        res.status(500).json({
            success: false,
            message: "Unable to retrieve survey answers"
        });
    }
});

// UPLOAD photos/videos for a visit
router.post("/:id/files", (req, res, next) => {
    const visitId = Number(req.params.id);

    if (!Number.isSafeInteger(visitId) || visitId <= 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid visit ID"
        });
    }

    next();
}, upload.array("files", 5), async (req, res) => {
    const visitId = Number(req.params.id);
    let connection;

    try {
        const [visits] = await pool.execute(
            "SELECT visit_id FROM visits WHERE visit_id = ?",
            [visitId]
        );

        if (visits.length === 0) {
            for (const file of req.files || []) {
                fs.unlink(file.path, () => {});
            }

            return res.status(404).json({
                success: false,
                message: "Visit not found"
            });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please upload at least one file using the field name 'files'"
            });
        }

        const uploaderId = Number(req.body.uploaded_by || 1);

        if (!Number.isSafeInteger(uploaderId) || uploaderId <= 0) {
            for (const file of req.files) {
                fs.unlink(file.path, () => {});
            }

            return res.status(400).json({
                success: false,
                message: "Invalid uploader ID"
            });
        }

        const [users] = await pool.execute(
            "SELECT user_id FROM users WHERE user_id = ? AND is_active = TRUE",
            [uploaderId]
        );

        if (users.length === 0) {
            for (const file of req.files) {
                fs.unlink(file.path, () => {});
            }

            return res.status(400).json({
                success: false,
                message: "Uploader does not exist or is inactive"
            });
        }

        connection = await pool.getConnection();
        await connection.beginTransaction();

        const savedFiles = [];

        for (const file of req.files) {
            const fileType = file.mimetype.startsWith("image/")
                ? "photo"
                : "video";

            const relativePath = path.posix.join(
                "uploads",
                file.filename
            );

            const [result] = await connection.execute(
                `INSERT INTO visit_files
                    (visit_id, uploaded_by, file_type, original_name,
                     stored_name, file_path, mime_type, file_size)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    visitId,
                    uploaderId,
                    fileType,
                    file.originalname,
                    file.filename,
                    relativePath,
                    file.mimetype,
                    file.size
                ]
            );

            savedFiles.push({
                file_id: result.insertId,
                original_name: file.originalname,
                file_type: fileType,
                file_size: file.size
            });
        }

        await connection.commit();

        res.status(201).json({
            success: true,
            message: "Files uploaded successfully",
            visit_id: visitId,
            count: savedFiles.length,
            data: savedFiles
        });
    } catch (error) {
        if (connection) {
            await connection.rollback();
        }

        for (const file of req.files || []) {
            fs.unlink(file.path, () => {});
        }

        console.error("Upload files error:", error.message);

        res.status(500).json({
            success: false,
            message: "Unable to upload files"
        });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

// GET uploaded files for a visit
router.get("/:id/files", async (req, res) => {
    const visitId = Number(req.params.id);

    if (!Number.isSafeInteger(visitId) || visitId <= 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid visit ID"
        });
    }

    try {
        const [files] = await pool.execute(
            `SELECT
                file_id,
                visit_id,
                uploaded_by,
                file_type,
                original_name,
                stored_name,
                file_path,
                mime_type,
                file_size,
                description,
                uploaded_at
             FROM visit_files
             WHERE visit_id = ?
             ORDER BY uploaded_at DESC`,
            [visitId]
        );

        res.json({
            success: true,
            count: files.length,
            data: files
        });
    } catch (error) {
        console.error("Fetch visit files error:", error.message);

        res.status(500).json({
            success: false,
            message: "Unable to retrieve visit files"
        });
    }
});

// GET a specific uploaded file
router.get("/files/:fileId", async (req, res) => {
    const fileId = Number(req.params.fileId);

    if (!Number.isSafeInteger(fileId) || fileId <= 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid file ID"
        });
    }

    try {
        const [files] = await pool.execute(
            `SELECT file_id, stored_name
             FROM visit_files
             WHERE file_id = ?`,
            [fileId]
        );

        if (files.length === 0) {
            return res.status(404).json({
                success: false,
                message: "File not found"
            });
        }

        const uploadDir = path.resolve(__dirname, "..", "uploads");
        const filePath = path.resolve(uploadDir, files[0].stored_name);

        // Ensure the file path stays inside uploads
        if (!filePath.startsWith(uploadDir + path.sep)) {
            return res.status(400).json({
                success: false,
                message: "Invalid file path"
            });
        }

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: "File is missing from storage"
            });
        }

        res.sendFile(filePath, (error) => {
            if (error && !res.headersSent) {
                console.error("Send file error:", error.message);
                res.status(500).json({
                    success: false,
                    message: "Unable to retrieve file"
                });
            }
        });
    } catch (error) {
        console.error("Retrieve file error:", error.message);

        res.status(500).json({
            success: false,
            message: "Unable to retrieve file"
        });
    }
});

// GET /api/visits/records
// Search and filter site visit records
router.get("/records", async (req, res) => {
    try {
        const {
            site_id,
            from_date,
            to_date,
            visit_type,
            status
        } = req.query;

        let sql = `
            SELECT
                v.visit_id,
                v.site_id,
                v.technician_id,
                v.assigned_by,
                v.visit_type,
                v.scheduled_date,
                v.started_at,
                v.submitted_at,
                v.reviewed_at,
                v.status,
                v.reviewer_id,
                v.reviewer_comments,
                v.created_at,
                v.updated_at,
                s.project_name,
                s.site_address,
                s.city,
                s.state,
                c.full_name AS customer_name
            FROM visits v
            JOIN sites s ON v.site_id = s.site_id
            LEFT JOIN customers c ON s.customer_id = c.customer_id
            WHERE 1 = 1
        `;

        const params = [];

        if (site_id !== undefined && site_id !== "") {
            const siteId = Number(site_id);

            if (!Number.isSafeInteger(siteId) || siteId <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid site_id"
                });
            }

            sql += " AND v.site_id = ?";
            params.push(siteId);
        }

        if (from_date) {
            if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(from_date)) {
                return res.status(400).json({
                    success: false,
                    message: "from_date must use YYYY-MM-DD format"
                });
            }

            sql += " AND v.scheduled_date >= ?";
            params.push(from_date);
        }

        if (to_date) {
            if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(to_date)) {
                return res.status(400).json({
                    success: false,
                    message: "to_date must use YYYY-MM-DD format"
                });
            }

            sql += " AND v.scheduled_date < DATE_ADD(?, INTERVAL 1 DAY)";
            params.push(to_date);
        }

        if (visit_type) {
            const allowedTypes = [
                "pre_installation",
                "post_installation",
                "maintenance"
            ];

            if (!allowedTypes.includes(visit_type)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid visit_type"
                });
            }

            sql += " AND v.visit_type = ?";
            params.push(visit_type);
        }

        if (status) {
            const allowedStatuses = [
                "Scheduled",
                "In Progress",
                "Submitted",
                "Approved",
                "Returned",
                "Closed"
            ];

            if (!allowedStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid status"
                });
            }

            sql += " AND v.status = ?";
            params.push(status);
        }

        sql += " ORDER BY v.scheduled_date DESC, v.visit_id DESC";

        const [rows] = await pool.execute(sql, params);

        return res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        console.error("Get site visit records error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve site visit records"
        });
    }
});
module.exports = router;
