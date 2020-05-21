const express = require('express');
const imageController = require('../controllers/imageController');
const { verifyToken } = require('../middleware/tokenMiddleware');

const router = express.Router();

// Route to create image thumbnail.
router.post('/create-thumbnail', verifyToken, imageController.create_thumbnail_post);

// Route to patch json objects.
router.patch('/patch-object', verifyToken, imageController.patch_json_patch);

module.exports = router;
