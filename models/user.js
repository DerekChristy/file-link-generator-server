const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, unique: true, required: true, trim: true },
  passwd: { type: String, required: true }
});

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('passwd')) {
    user.passwd = await bcrypt.hash(user.passwd, 8);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
