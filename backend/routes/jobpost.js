//Cazandra Jae Lapig
const express = require("express")
const router = express.Router()
const db = require('../database').db;

// Cazandra Jae Lapig
router.get("/", (req, res) => {
    res.send("All Job Post")
})

// Cariel Joyce Maga
router.get("/", (req, res) => {
    res.send("Interested in Job Post")
})


module.exports = router;