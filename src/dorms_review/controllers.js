const { pool, safeEscape } = require('../db/db');


const getDormReviewsList = async (req, res) => {

    const sql = `SELECT * FROM dorms_review`;

    try {
        const [result] = await pool.promise().query(sql);
        if (result.length > 0) {
            res.json(result);
        } else {
            res.status(404).json({ error: `Dorm review list is empty!` });
        }
    } catch (err) {
        console.error("Error in SQL query:", err);
        res.status(500).json({
            error: 'Internal Server Error',
            sqlError: err.sqlMessage
        });
    }
}


const patchDormReview = async (req, res) => {
    const { id } = req.params;
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

    updateValues.push(id);

    const sql = `UPDATE dorms_review SET ${updateFields.join(", ")} WHERE id = ?`;

    try {
        const [result] = await pool.promise().query(sql, updateValues);
        res.json({ message: 'Dorm review updated successfully!' });
    } catch (err) {
        console.error("Error in SQL query:", err);
        res.status(500).json({
            error: 'Internal Server Error',
            sqlError: err.sqlMessage
        });
    }
};

const deleteDormReview = async (req, res) => {
    const { id } = req.params;

    const sql = `DELETE FROM dorms_review WHERE id = ?`;

    try {
        const [result] = await pool.promise().query(sql, [id]);
        res.json({ message: 'Dorm review deleted successfully!' });
    } catch (err) {
        console.error("Error in SQL query:", err);
        res.status(500).json({
            error: 'Internal Server Error',
            sqlError: err.sqlMessage
        });
    }
};

const getDormReviewById = async (req, res) => {
    const { id } = req.params;

    const sql = `SELECT * FROM dorms_review WHERE id = ?`;

    try {
        const [result] = await pool.promise().query(sql, [id]);
        if (result.length > 0) {
            res.json(result[0]);
        } else {
            res.status(404).json({ error: `Dorm review not found: ${id}` });
        }
    } catch (err) {
        console.error("Error in SQL query:", err);
        res.status(500).json({
            error: 'Internal Server Error',
            sqlError: err.sqlMessage
        });
    }
};

const createDormReview = async (req, res) => {
    const { dorm_id, comment, rating } = req.body;
    const user_id = req.user.id;

    const sql = `INSERT INTO dorms_review (user_id, dorm_id, comment, rating) VALUES (?, ?, ?, ?)`;

    // Escape user-provided comment to prevent SQL injection
    const escapedComment = safeEscape(comment); // Assuming you're using mysql2

    try {
        const [result] = await pool.promise().query(sql, [user_id, dorm_id, escapedComment, rating]);
        // console.log(result);
        res.json({ 
            message: 'Dorm review created successfully!',
            result: result
        });
    } catch (err) {
        console.error("Error in SQL query:", err);
        res.status(500).json({
            error: 'Internal Server Error',
            sqlError: err.sqlMessage
        });
    }
};

module.exports = { patchDormReview, deleteDormReview, getDormReviewById, createDormReview, getDormReviewsList };
