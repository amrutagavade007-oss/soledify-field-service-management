
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/db");

const app = express();

const visitRoutes = require("./routes/visits");

app.use(cors());
app.use(express.json());
app.use("/api/visits", visitRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Soledify Backend API is running!"
    });
});

app.get("/api/health", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT DATABASE() AS databaseName");

        res.json({
            success: true,
            message: "MySQL connected successfully",
            database: rows[0].databaseName
        });
    } catch (error) {
        console.error("Database connection error:", error.message);

        res.status(500).json({
            success: false,
            message: "Database connection failed"
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Soledify server running at http://localhost:${PORT}`);
});
