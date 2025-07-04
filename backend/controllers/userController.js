// Imports

const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');

const User = require('../models/User');
const {
  validateRegisterInput,
  validateLoginInput,
} = require('../utils/validators/authValidator');
const { generateToken } = require('../services/tokenService');
// const { handleError } = require('../utils/errorHandler');

// Register User
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const isValid = validateRegisterInput({ username, email, password });
    if (!isValid.isValid) {
      return res.status(400).json({ errors: isValid.errors });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = generateToken(newUser._id);
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: newUser._id, username, email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const isValid = validateLoginInput({ email, password });
    if (!isValid.isValid) {
      return res.status(400).json({ errors: isValid.errors });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error(error);
    handleError(res, error);
  }
};

const updateUser = async (req, res) => {
  const userId = req.params.id;
  const updates = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    handleError(res, error);
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    handleError(res, error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
};
