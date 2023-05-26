const mongoose = require("mongoose");
const slugify = require("slugify");
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  class: {
    type: String,
    required: [true, "Please select a class"],
  },
  subject: {
    type: String,
    required: [true, "Please provide a subject"],
  },
  description: {
    type: String,
  },
  location: {
    type: mongoose.Schema.ObjectId,
    ref: 'Location',
    // required: true
  },
  quota: {
    type: Number,
    required: [true, "Please specify quota"],
    // minlength : [0,"Please provide a title at least 0 quota"],
  },

  slug: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  courseFee:{
    type: Number,
    default: 0
  },
  courseDate: {
    type: Date,
    default: Date.now,
    // required: [true, "Please specify date"],
  },
  instructor: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "User",
  },
  students: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
});


module.exports = mongoose.model("Course", CourseSchema);
