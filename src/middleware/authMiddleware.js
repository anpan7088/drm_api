// middleware/authMiddleware.js
const { pool } = require('../db/db');
const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET_KEY || 'defaultSecretKey-eohfufiufrei';

const isUser = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token.split(' ')[1], secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        req.user = user;
        next();
    });
};

const isOwner = async (req, res, next) => {
    const reviewToDel = req.params.id;
    // console.log(reviewToDel);
    // console.log(req.user.id);
    try {
        const [result] = await pool.promise().query('SELECT user_id FROM dorms_review WHERE id = ?', [reviewToDel]);
        if (result.length > 0 && result[0].user_id === req.user.id) {
            next();
        } else {
            res.status(403).json({ error: 'Forbidden: You are not the owner of this review' });
        }
    } catch (err) {
        console.error("Error in SQL query:", err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const isAdmin = (req, res, next) => {
    // console.log(req.role);
    if (req.user && req.role=='admin' ) {
        next();
    } else {
        res.status(403).json({ error: 'Forbidden: Admins only' });
    }
};


module.exports = { isUser, isAdmin, isOwner };
