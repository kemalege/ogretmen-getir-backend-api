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
  cost: {
    type: Number
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    // required: true
  },
  quota: {
    type: Number,
    required: [true, "Please specify quota"],
    // minlength : [20,"Please provide a title at least 20 characters"],
  },
  slug: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  courseDate: {
    type: Date,
    default: Date.now,
    required: [true, "Please specify date"],
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
