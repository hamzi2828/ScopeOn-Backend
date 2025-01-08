const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  fullname: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
userSchema.index({ email: 1 }, { unique: true });

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) { 
    const saltRounds = 10;
    try {
      const hashedPassword = await bcrypt.hash(this.password, saltRounds);
      this.password = hashedPassword;
      next(); 
    } catch (err) {
      next(err); 
    }
  } else {
    next();
  }
});


userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password); 
};

const User = mongoose.model('User', userSchema);

module.exports = User;
