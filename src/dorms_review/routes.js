const express = require('express');
const { patchDormReview, deleteDormReview, getDormReviewById, createDormReview, getDormReviewsList } = require('./controllers');
const { isUser, isOwner } = require('../middleware/authMiddleware');

const router = express.Router();

router.get("/", getDormReviewsList )
router.patch('/:id', [isUser, isOwner], patchDormReview);
router.delete('/:id', [isUser, isOwner], deleteDormReview);
router.get('/:id', getDormReviewById);
router.post('/', isUser, createDormReview);

module.exports = router;
