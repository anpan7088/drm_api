// user/routes.js
const express = require('express');
const { pool } = require('../db/db'); // Adjust the path to the db module
const { isUser, isOwner } = require('../middleware/authMiddleware'); // Import the auth middleware
const usersTable = process.env.USERS_TABLE || 'users';

const router = express.Router();

router.get("/profile", isUser, async (req, res) => {
    const userId = req.user.id;

    const sql = `SELECT * FROM ${usersTable} WHERE id = ?`;

    try {
        const [results] = await pool.promise().query(sql, [userId]);
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ error: 'UserID not found', userId });
        }
    } catch (err) {
        console.error("Error in SQL query:", err);
        res.status(500).json({ 
            error: 'Internal Server Error',
            sqlError: err.sqlMessage
        });
    }
});

router.get("/listAll", isUser, async (req, res) => {
    const sql = `SELECT * FROM ${usersTable}`;

    try {
        const [results] = await pool.promise().query(sql);
        if (results.length > 0) {
            res.json(results);
        } else {
            res.status(404).json({ error: 'No one is found!' });
        }
    } catch (err) {
        console.error("Error in SQL query:", err);
        res.status(500).json({ 
            error: 'Internal Server Error',
            sqlError: err.sqlMessage
        });
    }
});

router.patch('/profile', isUser, async (req, res) => {
    const userId = req.user.id;
    const fieldsToUpdate = req.body;

    let updateFields = [];
    let updateValues = [];

    for (const field in fieldsToUpdate) {
        updateFields.push(`${field} = ?`);
        updateValues.push(fieldsToUpdate[field]);
    }

    if (updateFields.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
    }

    updateValues.push(userId);

    const sql = `UPDATE ${usersTable} SET ${updateFields.join(", ")} WHERE id = ?`;

    try {
        await pool.promise().query(sql, updateValues);
        res.json({
            status: true,
            message: 'Profile updated successfully',
            values: fieldsToUpdate
        });
    } catch (err) {
        console.error("Error in SQL query:", err);
        res.status(500).json({ 
            error: 'Internal Server Error', 
            sqlError: err.sqlMessage
        });
    }
});

router.get("/test", (req, res) => {
    res.json({ message: "testProfileRoute" });
});

module.exports = router;

