const express = require('express');
const { getFavorites, toggleFavorite, checkFavorite } = require('../controllers/favoriteController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// All routes require auth
router.use(auth);

// @route   GET /api/favorites
router.get('/', getFavorites);

// @route   POST /api/favorites/:listingId
router.post('/:listingId', toggleFavorite);

// @route   GET /api/favorites/check/:listingId
router.get('/check/:listingId', checkFavorite);

module.exports = router;
