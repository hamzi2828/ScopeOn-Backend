const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer'); 

dotenv.config();  

const userController = {

registerUser : async (req, res) => {
  // Accept all merchant fields from frontend
  const {
    fullname,
    email,
    password,
    businessName,
    businessAddress,
    phoneNumber,
    website,
    businessType,
    userType
  } = req.body;



  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists', statusCode: 400  });
    }

    const newUser = new User({ fullname, email, password, businessName, businessAddress, phoneNumber, website, businessType, userType });
    await newUser.save();   

    res
      .status(201)
      .json({ message: 'User registered successfully', statusCode: 201, user: { fullname, email } });
  } catch (err) {
    console.error('Error during user registration:', err);
    res
    .status(500)
    .json({ message: 'Server error', statusCode: 500 });
  }
},
loginUser: async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email and populate the role and permissions
    const user = await User.findOne({ email }); // Populate the role field
    console.log(user.role);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Exclude password and generate JWT with all other user details
    const { password: _pw, ...userDetails } = user.toObject();
    const token = jwt.sign(
      userDetails,
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // Save token in cookies
    res.cookie('token', token, {
      httpOnly: true, // Prevents client-side scripts from accessing the token
      secure: process.env.NODE_ENV === 'production', // Ensures the cookie is sent over HTTPS in production
      maxAge: 3600000, // 1 hour in milliseconds
    });

    // You now have access to user.role and user.role.permissions

    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Error during user login:', err);
    res.status(500).json({ message: 'Server error' });
  }
},
updateUser : async (req, res) => {
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
},
forgotPassword : async (req, res) => {
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
},
resetPassword : async (req, res) => {
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
},
getUserById : async (req, res) => {
  const userId = req.params.id;

  try {
    // Find the user by ID
    const user = await User.findById(userId).select('-password'); // Exclude password from response

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error('Error fetching user by ID:', err);
    res.status(500).json({ message: 'Server error' });
  }
},
};

module.exports = userController;
