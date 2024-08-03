const express = require('express');
const { patchDormReview, deleteDormReview, getDormReviewById, createDormReview, getDormReviewsList } = require('./controllers');
const { isUser, isOwner, isAdmin, isAdminOrOwner } = require('../middleware/authMiddleware');

const router = express.Router();

router.get("/", getDormReviewsList )
router.patch('/:id', [ isAdminOrOwner ] ,patchDormReview);
router.delete('/:id', [isUser, isOwner, isAdmin], deleteDormReview);
router.get('/:id', getDormReviewById);
router.post('/', isUser, createDormReview);

module.exports = router;
