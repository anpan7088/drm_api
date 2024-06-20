const express = require('express');

const { postReviewImage, deleteReviewImage, getReviewImages } = require('./controllers');
const { isUser, isAdmin } = require('../middleware/authMiddleware');
const { createMulterMiddleware } = require('../middleware/uploadMiddleware');

const router = express.Router();



// Route for photo deletion (DELETE)
router.delete('/:imageId', isUser, isAdmin, deleteReviewImage );

// route for getting images for dorm-review by id
router.get('/:review_id', getReviewImages);

module.exports = router;