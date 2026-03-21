const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please add all fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // Check if user exists & password matches
    if (user && user.password && (await bcrypt.compare(password, user.password))) {
      user.lastLogin = Date.now();
      await user.save();
      
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        picture: user.picture,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: 'No Google token provided' });

    // In local dev without a Google Client ID, this will fail.
    // Ensure GOOGLE_CLIENT_ID is valid in prod/testing.
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if doesn't exist
      user = await User.create({
        googleId,
        email,
        name,
        picture
      });
    } else if (!user.googleId) {
      // Link Google ID if user logged in previously with just email
      user.googleId = googleId;
      user.picture = user.picture || picture;
      await user.save();
    }
    
    user.lastLogin = Date.now();
    await user.save();

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      picture: user.picture,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(401).json({ message: `Google Auth Error: ${error.message}` });
  }
};

const getMe = async (req, res) => {
  try {
    const user = {
      _id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      picture: req.user.picture
    };
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const logoutUser = (req, res) => {
  // Client handles throwing away the JWT, but API exists for completeness
  res.status(200).json({ message: 'Logged out successfully' });
};

const updateProfilePicture = async (req, res) => {
  try {
    const { picture } = req.body;
    if (!picture) {
      return res.status(400).json({ message: 'No picture provided' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Save the base64 string or image URL
    user.picture = picture;
    await user.save();

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      picture: user.picture,
    });
  } catch (error) {
    console.error('Update Profile Picture Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });

    // For Demo: Auto-provision the default admin if it doesn't exist
    if (!user && email === 'admin@police.gov.in') {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user = await User.create({
        name: 'System Administrator',
        email: 'admin@police.gov.in',
        password: hashedPassword,
        role: 'admin'
      });
    }

    if (user && user.password && (await bcrypt.compare(password, user.password))) {
      if (user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Administrator privileges required.' });
      }

      user.lastLogin = Date.now();
      await user.save();
      
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        picture: user.picture,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid admin credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  googleAuth,
  getMe,
  logoutUser,
  updateProfilePicture,
  adminLogin
};
