// DEMO DATA. Member 2's API (GET /api/technician/visits) will replace this.
// One unique Customer ID per customer; "type" is pre | post | om.
const MOCK = [
  {id:'CUST-2026-0142',visitId:1,name:'Demo Customer',addr:'Pune, Maharashtra',type:'pre',date:'2026-10-26',time:'10:00',st:'In Progress',tech:'Demo Technician'},
  {id:'CUST-2026-0087',name:'XYZ Manufacturing',addr:'Chakan Industrial Area, Pune',type:'post',date:'2026-10-26',time:'14:00',st:'Scheduled',tech:'John Smith'},
  {id:'CUST-2026-0231',name:'Solaris Power Hub',addr:'Hinjawadi Phase 1, Pune',type:'om',date:'2026-10-27',time:'09:00',st:'Scheduled',tech:'John Smith',base:4},
  {id:'CUST-2026-0115',name:'Green Valley Hospital',addr:'Baner Road, Pune',type:'pre',date:'2026-10-24',time:'11:15',st:'Returned',tech:'John Smith'},
  {id:'CUST-2026-0063',name:'Sunrise Cold Storage',addr:'Hadapsar, Pune',type:'post',date:'2026-10-22',time:'15:00',st:'Submitted',tech:'John Smith'},
  {id:'CUST-2026-0054',name:'Apex Logistics',addr:'Talegaon MIDC, Pune',type:'om',date:'2026-10-21',time:'10:00',st:'Approved',tech:'John Smith',base:9}
];
