const { pool }  = require('../db/db');

const postReviewImage =  async (req, res) => {
    
    try {
        const reviewId = req.params.id;     // param 'id' is dorm primary key id from the dorms table
        const imageUrl = req.file.filename; // Path to the uploaded image

        const [insertResult] = await pool.promise().query('INSERT INTO dorm_review_images (dorm_review_id, url) VALUES (?, ?)', [ reviewId, imageUrl]);
        const imageId = insertResult.insertId;

        res.status(201).json({ message: 'Image uploaded successfully!', imageId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error uploading image!' });
    }
};

const deleteReviewImage = async (req, res) => {
    try {
        const imageId = req.params.imageId;

        // Check if image exists before deletion (optional)
        const [checkResult] = await pool.promise().query('SELECT * FROM dorm_review_images WHERE id = ?', [imageId]);
        if (!checkResult.length) {
            return res.status(404).json({ message: 'Image not found!' });
        }

        const imageUrl = checkResult[0].url; // Get the image URL for potential deletion from storage

        await pool.query('DELETE FROM dorm_review_images WHERE id = ?', [imageId]);

        // Delete the image file from storage if desired (implement logic based on your storage strategy)
        // fs.unlinkSync(imageUrl); // Example using the 'fs' module (adjust path if needed)

        res.status(200).json({ message: 'Image deleted successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting image!' });
    }
};

const getReviewImages = async (req, res) => {
    const { review_id } = req.params;
    try{
        const [result] = await pool.promise().query('SELECT * FROM dorm_review_images WHERE dorm_review_id =?', [review_id]);
        const ret = {
            baseUrl: process.env.IMAGES_BASE_URL,
            data: result
        }
        res.json(ret);
    }
    catch(err){
        // console.error(err);
        res.status(500).json({ message: 'Error getting dorm images!' });
    }
};

module.exports = { postReviewImage, deleteReviewImage, getReviewImages };