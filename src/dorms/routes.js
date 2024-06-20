const express = require('express');
const { 
    patchDormData, 
    deleteDorm, 
    getDormById, 
    createDorm, 
    getDormList, 
    getTopDorms, 
    getDormOfTheDay, 
    getDormImages,
    getDormReviews
} = require('./controllers');

const { isUser, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/',  getDormList);
router.get('/:id', getDormById);
router.get('/:dorm_id/images', getDormImages);
router.get('/:dorm_id/reviews', getDormReviews);
router.get('/top-dorms/:count',getTopDorms);
router.get('/dorm-of-the-day/:count', getDormOfTheDay);
router.post('/', isUser, createDorm);
router.patch('/:id', isUser, patchDormData);
router.delete('/:id', [ isUser ], deleteDorm);

module.exports = router; 