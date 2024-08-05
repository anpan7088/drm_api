// user/routes.js
const express = require('express');
const { pool } = require('../db/db'); // Adjust the path to the db module
const { isUser, isOwner } = require('../middleware/authMiddleware'); // Import the auth middleware
const { getUserProfile, listAllUsers } = require('./controllers');

const router = express.Router();

router.get("/profile", isUser, getUserProfile);
router.get("/listAll", isUser, listAllUsers);
router.patch('/profile', isUser, getUserProfile);

module.exports = router;

