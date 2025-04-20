const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET user details by ID (e.g., for My Account)
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});


// PUT - Update user profile
router.put('/:id', async (req, res) => {
  try {
    const { username, email, firstName, lastName, address } = req.body;

    const updatedFields = {
      username,
      email,
      firstName,
      lastName,
      address
    };

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(400).json({ message: 'Update failed', error: err.message });
  }
});
router.delete('/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'User account deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete user', error: err.message });
  }
});

module.exports = router;
