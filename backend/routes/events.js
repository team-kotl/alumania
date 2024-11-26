//Lapig & Maga
const express = require("express")
const router = express.Router()
const db = require('../database').db;

// Get all Event
router.get("/", (req, res) => {
    db.query("SELECT * FROM event", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
})

// Cariel Joyce Maga
router.get("/", (req, res) => {
    res.send("Interested in Event")
})

module.exports = router;