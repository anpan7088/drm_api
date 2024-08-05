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
    getDormReviews,
    getTopDormsWithImages,
    getDormLocations
} = require('./controllers');

const { isUser, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/',  getDormList);
router.get('/locations/', getDormLocations);
router.get('/:id', getDormById);
router.get('/:dorm_id/images', getDormImages);
router.get('/:dorm_id/reviews', getDormReviews);
router.get('/top-dorms/:count',getTopDorms);
router.get('/top-dorms-with-images/:count', getTopDormsWithImages);
router.get('/dorm-of-the-day/:count', getDormOfTheDay);
router.post('/', isAdmin, createDorm);
router.patch('/:id', isAdmin, patchDormData);
router.delete('/:id', [ isAdmin ], deleteDorm);

module.exports = router; 