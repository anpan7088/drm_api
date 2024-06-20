const express = require('express');

const { postDormImage, deleteDormImage, getDormImages } = require('./controllers');
const { isUser, isAdmin } = require('../middleware/authMiddleware');
const { createMulterMiddleware } = require('../middleware/uploadMiddleware');

const router = express.Router();

const storageConfig = { 
    destination: process.env.IMAGES_FOLDER || 'public/images',
    fieldName: 'drmImg' 
};

router.post('/:id', isUser, createMulterMiddleware(storageConfig), postDormImage);

// Route for photo deletion (DELETE)
router.delete('/:imageId', isUser, deleteDormImage );

//route for getting images for dorm by id
router.get('/:dorm_id', getDormImages);

module.exports = router;