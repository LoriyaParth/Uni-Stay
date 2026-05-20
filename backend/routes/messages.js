const router = require('express').Router();
const Message = require('../models/Message');
const { auth } = require('../middleware/auth');

// Get messages for current user
router.get('/', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.userId }, { receiver: req.userId }]
    })
      .populate('sender', 'name email avatar')
      .populate('receiver', 'name email avatar')
      .populate('listing', 'propertyName')
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Send message
router.post('/', auth, async (req, res) => {
  try {
    const { receiver, listing, content } = req.body;
    const message = new Message({ sender: req.userId, receiver, listing, content });
    await message.save();
    await message.populate('sender', 'name email avatar');
    await message.populate('receiver', 'name email avatar');
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update message status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(message);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
