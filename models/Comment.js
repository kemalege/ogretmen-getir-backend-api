const mongoose = require('mongoose');
const slugify = require('slugify');
const User = require('./User');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    title : {
        type : String,
        required: [true, "Please provide a title"],
        // minlength : [10,"Please provide a title at least 10 characters"],
        unique : true,
    },
    content : {
        type : String,
        required: [true, "Please provide a content"],
        // minlength : [20,"Please provide a title at least 20 characters"],
    } ,
    slug : String, 
    createdAt : {
        type : Date,
        default : Date.now
    },
    owner : {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    sent : {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },      
        
});
CommentSchema.pre("save", async function (next) { 
    if (!this.isModified("owner")) return next(); 
   
    try {
      const user = await User.findById(this.sent); 
  
      user.comments.push(this._id); 
  
      await user.save(); 

      next();
    } catch (err) {
      return next(err);
    }
  });

CommentSchema.pre("save",function(next){
    if (!this.isModified("title")) {
        next();
    }
    this.slug = this.makeSlug();
    next();
});
CommentSchema.methods.makeSlug = function () {
    return slugify(this.title, {
        replacement: '-',
        remove: /[*+~.()'"!:@]/g,
        lower: true
    });
};
module.exports = mongoose.model("Comment" ,CommentSchema);