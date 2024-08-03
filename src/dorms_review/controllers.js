const { pool, safeEscape } = require('../db/db');

const mainQuery = `
          SELECT 
            dr.id AS id,
            dr.dorm_id AS dorm_id,
            dr.id AS review_id,
            dr.rating AS rating, 
            dr.room_rating AS room_rating,
            dr.bathroom_rating AS bathroom_rating,
            dr.location_rating AS location_rating,
            dr.hot_water AS hot_water,
            dr.comment AS comment, 
            dr.user_id AS user_id,
            usr.username AS username,
            CONCAT(usr.firstName, ' ', usr.lastName) AS fullName,
            dr.created_at AS created_at,
            dr.updated_at AS updated_at
        FROM dorms_review AS dr
        INNER JOIN users AS usr ON usr.id = dr.user_id
        `;

const getDormReviewsList = async (req, res) => {

    const sql = mainQuery;

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

    const sql = `
        ${mainQuery}    
        WHERE dr.id = ?`;

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
    const { dorm_id, comment, rating, room_rating, bathroom_rating, location_rating } = req.body;
    const user_id = req.user.id;

    const sql = "INSERT INTO dorms_review (user_id, dorm_id, comment, rating, room_rating, bathroom_rating, location_rating) VALUES (?, ?, ?, ?, ?, ?, ?)";

    // Escape user-provided comment to prevent SQL injection
    const escapedComment = safeEscape(comment); // Assuming you're using mysql2

    try {
        const [result] = await pool.promise().query(sql, [user_id, dorm_id, escapedComment, rating, room_rating, bathroom_rating, location_rating]);
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
