const express = require("express");
const router = express.Router();
const db = require("../database").db;

// Get all Likes
router.get("/likes", (req, res) => {
    const { userid } = req.query;
    db.query(
        `
            SELECT 
                CONCAT(a.firstname,' ', COALESCE(CONCAT(a.middlename, ' '), ''), a.lastname) AS fullname,
                a.displaypic,
                lk.liketimestamp
            FROM experiencelike lk
            INNER JOIN experience ex ON lk.xpid = ex.xpid
            INNER JOIN alumni a ON lk.userid = a.userid
            WHERE ex.userid = 'U004' AND lk.userid != 'U004'`,
        [userid, userid],
        (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).json({ message: "Internal Server Error" });
            }
            const notifs = results.map((notif) => ({
                ...notif,
                displaypic: notif.displaypic?.toString("base64")
            }));
            res.json(notifs);
        }
    );
});

module.exports = router;
