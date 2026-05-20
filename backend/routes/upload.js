const express = require('express');
const { uploadImages } = require('../controllers/uploadController');
const upload = require('../middleware/upload');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/upload
router.post('/', auth, upload.array('images', 10), uploadImages);

module.exports = router;
