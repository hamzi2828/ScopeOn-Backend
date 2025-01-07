const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer'); // Add this line to import nodemailer

dotenv.config();  // Load environment variables from .env file

// Register a new user
exports.registerUser = async (req, res) => {
  const { fullname, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user
    const newUser = new User({ fullname, email, password });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', user: { fullname, email } });
  } catch (err) {
    console.error('Error during user registration:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Log in a user
// Log in a user and save the token in cookies
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // Save token in cookies
    res.cookie('token', token, {
      httpOnly: true, // Prevents client-side scripts from accessing the token
      secure: process.env.NODE_ENV === 'production', // Ensures the cookie is sent over HTTPS in production
      maxAge: 3600000, // 1 hour in milliseconds
    });

    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Error during user login:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user details (from token in cookies)
// Update user details (from token in cookies)
exports.updateUser = async (req, res) => {
  const { fullname, email } = req.body;
  const userId = req.user.id; // Get the user ID from the decoded token (set by the verifyToken middleware)

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the email has been changed and if the new email is already in use
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    // Update user details only if the new value is provided
    if (fullname) user.fullname = fullname;
    if (email) user.email = email;

    // Save the updated user to the database
    await user.save();

    // Return the updated user details (excluding the password)
    res.status(200).json({
      message: 'User updated successfully',
      user: { fullname: user.fullname, email: user.email }
    });
  } catch (err) {
    console.error('Error during user update:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Forget password API
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const resetUrl = `${process.env.LOCALHOST}/api/users/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    const mailOptions = {
      from: 'ScopeOn',
      to: email,
      subject: 'Password Reset Request',
      text: `Click on the link to reset your password: ${resetUrl}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Password reset link sent to your email' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};



exports.resetPassword = async (req, res) => {
  const { password, confirmPassword } = req.body;
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
