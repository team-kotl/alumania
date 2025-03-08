const express = require("express");
const router = express.Router();
const db = require("../database").db;

// Get Recipient
router.get("/recipient", (req, res) => {
    try {
        const { recipientid } = req.query;
        db.query(
            `SELECT CONCAT(firstname,' ', COALESCE(CONCAT(middlename, ' '), ''), lastname) AS recipient, displaypic FROM alumni WHERE userid = ?`,
            [recipientid],
            (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ error: err.message });
                }
                res.status(200).json(result[0]);
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

// Get Sender
router.get("/sender", (req, res) => {
    try {
        const { senderid } = req.query;
        db.query(
            `SELECT CONCAT(firstname,' ', COALESCE(CONCAT(middlename, ' '), ''), lastname) AS sender, displaypic FROM alumni WHERE userid = ?`,
            [senderid],
            (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ error: err.message });
                }
                res.status(200).json(result[0]);
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

// Get messages
router.get("/", async (req, res) => {
    try {
        const { senderid, recipientid } = req.query;
        db.query(
            `SELECT * FROM message 
                WHERE (senderid = ? AND recipientid = ?) 
                OR (senderid = ? AND recipientid = ?) 
                ORDER BY timesent ASC`,
            [senderid, recipientid, recipientid, senderid],
            (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ error: err.message });
                }
                res.status(200).json(result);
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

// Get recipients with last message
router.get("/recipients", async (req, res) => {
    try {
        const userId = req.query.userid;

        db.query(
            `
            SELECT 
                u.userid,
                CONCAT(u.firstname,' ', COALESCE(CONCAT(u.middlename, ' '), ''), u.lastname) AS fullname,
                u.displaypic,
                MAX(m.timesent) AS last_message_time,
                MAX(CASE WHEN m.senderid = u.userid THEN m.message END) AS last_message,
                SUM(CASE WHEN m.recipientid = ? AND m.is_read = 0 THEN 1 ELSE 0 END) AS unread_count
            FROM alumni u
            JOIN message m ON u.userid = m.senderid OR u.userid = m.recipientid
            WHERE ? IN (m.senderid, m.recipientid) AND u.userid != ?
            GROUP BY u.userid
            ORDER BY last_message_time DESC
        `,
            [userId, userId, userId],
            (err, result) => {
                if (err) {
                    console.log(err);
                }
                const recipientsWithImages = result.map(recipient => ({
                    ...recipient,
                    displaypic: recipient.displaypic 
                        ? Buffer.from(recipient.displaypic).toString('base64') 
                        : null
                }));
                res.json(recipientsWithImages);
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

// Mark messages as read
router.put("/messages/read", async (req, res) => {
    try {
        const { userId, recipientId } = req.body;

        db.query(
            `
            UPDATE message 
            SET is_read = 1 
            WHERE senderid = ? AND recipientid = ?
        `,
            [recipientId, userId]
        );

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
