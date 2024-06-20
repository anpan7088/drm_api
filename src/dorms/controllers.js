const { pool } = require('../db/db');


const getDormList = async (req, res) => {
    const { id } = req.params;

    const sql = `SELECT * FROM dorms where 1=1`;

    try {
        const [result] = await pool.promise().query(sql);
        if (result.length > 0) {
            res.json(result);
        } else {
            res.status(404).json({ error: `Dorm not found: ${id}` });
        }
    } catch (err) {
        console.error("Error in SQL query:", err);
        res.status(500).json({
            error: 'Internal Server Error',
            sqlError: err.sqlMessage
        });
    }
};

//
const getDormById = async (req, res) => {
    const { id } = req.params;

    const sql = `SELECT * FROM dorms WHERE id = ?`;

    try {
        const [result] = await pool.promise().query(sql, [id]);
        if (result.length > 0) {
            res.json(result[0]);
        } else {
            res.status(404).json({ error: `Dorm not found: ${id}` });
        }
    } catch (err) {
        console.error("Error in SQL query:", err);
        res.status(500).json({
            error: 'Internal Server Error',
            sqlError: err.sqlMessage
        });
    }
};

// 
const createDorm = async (req, res) => {
    const { name, address, city } = req.body;

    const sql = `INSERT INTO dorms (name, address, city) VALUES (?, ?, ?)`;

    try {
        const [result] = await pool.promise().query(sql, [name, address, city]);
        res.json({ message: 'Dorm created successfully!' });
    } catch (err) {
        console.error("Error in SQL query:", err);
        res.status(500).json({
            error: 'Internal Server Error',
            sqlError: err.sqlMessage
        });
    }
};

const patchDormData = async (req, res) => {
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

    const sql = `UPDATE dorms SET ${updateFields.join(", ")} WHERE id = ?`;

    try {
        const [result] = await pool.promise().query(sql, updateValues);
        res.json({ message: 'Dorm updated successfully!' });
    } catch (err) {
        console.error("Error in SQL query:", err);
        res.status(500).json({
            error: 'Internal Server Error',
            sqlError: err.sqlMessage
        });
    }
};

const deleteDorm = async (req, res) => {
    const { id } = req.params;

    const sql = `DELETE FROM dorms WHERE id = ?`;

    try {
        const [result] = await pool.promise().query(sql, [id]);
        res.json({ message: 'Dorm deleted successfully!' });
    } catch (err) {
        console.error("Error in SQL query:", err);
        res.status(500).json({
            error: 'Internal Server Error',
            sqlError: err.sqlMessage
        });
    }
};

const getTopDorms = async (req, res) => {
    const { count } = req.params;

    const sql = `CALL GetTopReviewedDorms(${count});`;

    try {
        const [result] = await pool.promise().query(sql);
        res.json(result[0]);
    } catch (err) {
        console.error("Error in SQL query:", err);
        res.status(500).json({
            error: 'Internal Server Error',
            sqlError: err.sqlMessage
        });
    }
};

const getDormOfTheDay = async (req, res) => {
    const { count } = req.params;

    const sql = `SELECT * FROM dorms order by rand() limit ${count};`;

    try {
        const [result] = await pool.promise().query(sql);
        if (result.length > 0) {
            res.json(result);
        } else {
            res.status(404).json({ error: `Top Dorms not found!!!` });
        }
    } catch (err) {
        console.error("Error in SQL query:", err);
        res.status(500).json({
            error: 'Internal Server Error',
            sqlError: err.sqlMessage
        });
    }
};

const getDormImages = async (req, res) => {
    const { dorm_id } = req.params;
    try {
        const [result] = await pool.promise().query('SELECT * FROM dorms_images WHERE dorm_id =?', [dorm_id]);
        const ret = {
            baseUrl: process.env.IMAGES_BASE_URL,
            data: result
        }
        res.json(ret);
    }
    catch (err) {
        // console.error(err);
        res.status(500).json({ message: 'Error getting dorm images!' });
    }
};

const getDormReviews = async (req, res) => {
    const { dorm_id } = req.params;

    const sql =`
        SELECT 
            dr.id AS review_id, 
            dr.rating AS rating, 
            dr.comment AS comment, 
            usr.username AS username,
            CONCAT(usr.firstName, ' ', usr.lastName) AS fullName
        FROM dorms_review AS dr
        INNER JOIN users AS usr ON usr.id = dr.user_id
        WHERE dorm_id = ?;
        `;

    try {
        const [result] = await pool.promise().query(sql, [dorm_id]);
        const ret = {
            title: "Reviews for dorm",
            dormID: dorm_id,
            list: result
        }
        res.json(ret);
    }
    catch (err) {
        // console.error(err);
        res.status(500).json({ message: 'Error getting dorm reviews!' });
    }
};


module.exports = {
    patchDormData,
    deleteDorm,
    getDormById,
    createDorm,
    getDormList,
    getTopDorms,
    getDormOfTheDay,
    getDormImages,
    getDormReviews,
};
