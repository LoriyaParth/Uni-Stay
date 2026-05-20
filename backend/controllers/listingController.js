const Listing = require('../models/Listing');

// @desc    Get all published listings
// @route   GET /api/listings
exports.getListings = async (req, res, next) => {
  try {
    const { search, type, city, minPrice, maxPrice, amenities, page = 1, limit = 12 } = req.query;
    
    let query = { status: 'published' };

    // Search filter
    if (search) {
      query.$text = { $search: search };
    }

    // Type filter
    if (type) {
      query.propertyType = type;
    }

    // City filter
    if (city) {
      query.city = new RegExp(city, 'i');
    }

    // Price filter
    if (minPrice || maxPrice) {
      query['roomConfigs.priceMonthly'] = {};
      if (minPrice) query['roomConfigs.priceMonthly'].$gte = Number(minPrice);
      if (maxPrice) query['roomConfigs.priceMonthly'].$lte = Number(maxPrice);
    }

    // Amenities filter
    if (amenities) {
      const amenityList = amenities.split(',');
      query.amenities = { $all: amenityList };
    }

    const total = await Listing.countDocuments(query);
    const listings = await Listing.find(query)
      .populate('owner', 'name email avatar phone')
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.json({
      listings,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    console.error('GetListings error:', error);
    next(error);
  }
};

// @desc    Get single listing
// @route   GET /api/listings/:id
exports.getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('owner', 'name email avatar phone');
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.json(listing);
  } catch (error) {
    console.error('GetListing error:', error);
    next(error);
  }
};

// @desc    Create listing
// @route   POST /api/listings
exports.createListing = async (req, res, next) => {
  try {
    const listingData = {
      ...req.body,
      owner: req.userId
    };

    const listing = new Listing(listingData);
    await listing.save();
    
    await listing.populate('owner', 'name email avatar phone');

    res.status(201).json(listing);
  } catch (error) {
    console.error('CreateListing error:', error);
    next(error);
  }
};

// @desc    Update listing
// @route   PUT /api/listings/:id
exports.updateListing = async (req, res, next) => {
  try {
    let listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check ownership
    if (listing.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this listing' });
    }

    listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate('owner', 'name email avatar phone');

    res.json(listing);
  } catch (error) {
    console.error('UpdateListing error:', error);
    next(error);
  }
};

// @desc    Delete listing
// @route   DELETE /api/listings/:id
exports.deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check ownership
    if (listing.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this listing' });
    }

    await Listing.findByIdAndDelete(req.params.id);
    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('DeleteListing error:', error);
    next(error);
  }
};

// @desc    Get current user's listings
// @route   GET /api/listings/my
exports.getMyListings = async (req, res, next) => {
  try {
    const listings = await Listing.find({ owner: req.userId })
      .populate('owner', 'name email avatar phone')
      .sort({ createdAt: -1 });
    
    res.json(listings);
  } catch (error) {
    console.error('GetMyListings error:', error);
    next(error);
  }
};
