const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
  userId: { type: String, unique: true, required: true, trim: true },
  link: { type: String, unique: true, required: true, trim: true }
}, { timestamps: true } );


module.exports = mongoose.model('File', fileSchema);
