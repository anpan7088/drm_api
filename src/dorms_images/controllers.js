const { pool }  = require('../db/db');

const postDormImage =  async (req, res) => {
    
    try {
        const dormId = req.params.id;     // param 'id' is dorm primary key id from the dorms table
        const imageUrl = req.file.filename; // Path to the uploaded image
        const userID = req.user.id; // User ID from request

        const [insertResult] = await pool.promise().query('INSERT INTO dorms_images (dorm_id, url, user_id) VALUES (?, ?, ?)', [dormId, imageUrl, userID]);
        const imageId = insertResult.insertId;

        res.status(201).json({ message: 'Image uploaded successfully!', imageId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error uploading image!' });
    }
};

const deleteDormImage = async (req, res) => {
    try {
        const imageId = req.params.imageId;

        // Check if image exists before deletion (optional)
        const [checkResult] = await pool.promise().query('SELECT * FROM dorms_images WHERE id = ?', [imageId]);
        if (!checkResult.length) {
            return res.status(404).json({ message: 'Image not found!' });
        }

        const imageUrl = checkResult[0].url; // Get the image URL for potential deletion from storage

        pool.query('DELETE FROM dorms_images WHERE id = ?', [imageId]);

        res.status(200).json({ message: 'Image deleted successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting image!' });
    }
};

const getDormImages = async (req, res) => {
    const { dorm_id } = req.params;
    try{
        const [result] = await pool.promise().query('SELECT * FROM dorms_images WHERE dorm_id =?', [dorm_id]);
        const ret = {
            baseUrl: process.env.IMAGES_BASE_URL,
            list: result
        }
        res.json(ret);
    }
    catch(err){
        // console.error(err);
        res.status(500).json({ message: 'Error getting dorm images!' });
    }
};

module.exports = { postDormImage, deleteDormImage, getDormImages };