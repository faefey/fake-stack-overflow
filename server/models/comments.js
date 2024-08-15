const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  com_by: {
    type: String,
    required: true
  },
  com_date_time: {
    type: Date,
    default: Date.now
  },
  votes: {
    type: Number,
    default: 0
  }
});
commentSchema.virtual("url").get(function() {return "posts/comment/" + this._id;});
module.exports = mongoose.model("Comment", commentSchema);
