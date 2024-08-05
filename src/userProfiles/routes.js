// user/routes.js
const express = require('express');
const { isUser, isOwner, isAdmin, isAdminOrOwner } = require('../middleware/authMiddleware'); // Import the auth middleware
const { getUserProfile, listAllUsers, patchUserProfile } = require('./controllers');

const router = express.Router();

router.get("/profile/:user_id?", isUser, getUserProfile);
router.get("/listAll", isUser, listAllUsers);  // this is old route keeped for compatibility
router.get("/profilesAll", isUser, listAllUsers);
router.patch('/profile/:user_id?', isUser, patchUserProfile);

module.exports = router;

