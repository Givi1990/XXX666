const mongoose = require('mongoose');

const presentationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  slides: {
    type: Array,
    default: []
  }
});

module.exports = mongoose.model('Presentation', presentationSchema);
