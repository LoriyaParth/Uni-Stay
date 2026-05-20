const express = require('express');
const {
  getListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
  getMyListings
} = require('../controllers/listingController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/listings/my — Must be before /:id
router.get('/my', auth, getMyListings);

// @route   GET /api/listings
router.get('/', getListings);

// @route   GET /api/listings/:id
router.get('/:id', getListing);

// @route   POST /api/listings
router.post('/', auth, createListing);

// @route   PUT /api/listings/:id
router.put('/:id', auth, updateListing);

// @route   DELETE /api/listings/:id
router.delete('/:id', auth, deleteListing);

module.exports = router;
