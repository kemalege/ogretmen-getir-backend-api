const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: String,
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
});

locationSchema.index({ location: '2dsphere' });

const Location = mongoose.model('point', locationSchema);

module.exports = Location;