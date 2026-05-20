const Favorite = require('../models/Favorite');

// @desc    Get user's favorites
// @route   GET /api/favorites
exports.getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.userId })
      .populate({
        path: 'listing',
        populate: { path: 'owner', select: 'name email avatar' }
      })
      .sort({ createdAt: -1 });

    // Filter out any favorites where listing was deleted
    const validFavorites = favorites.filter(f => f.listing !== null);
    
    res.json(validFavorites.map(f => f.listing));
  } catch (error) {
    console.error('GetFavorites error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Toggle favorite
// @route   POST /api/favorites/:listingId
exports.toggleFavorite = async (req, res) => {
  try {
    const { listingId } = req.params;
    
    const existing = await Favorite.findOne({
      user: req.userId,
      listing: listingId
    });

    if (existing) {
      await Favorite.findByIdAndDelete(existing._id);
      return res.json({ favorited: false, message: 'Removed from favorites' });
    }

    const favorite = new Favorite({
      user: req.userId,
      listing: listingId
    });
    await favorite.save();

    res.status(201).json({ favorited: true, message: 'Added to favorites' });
  } catch (error) {
    console.error('ToggleFavorite error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Check if listing is favorited
// @route   GET /api/favorites/check/:listingId
exports.checkFavorite = async (req, res) => {
  try {
    const existing = await Favorite.findOne({
      user: req.userId,
      listing: req.params.listingId
    });
    res.json({ favorited: !!existing });
  } catch (error) {
    console.error('CheckFavorite error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
