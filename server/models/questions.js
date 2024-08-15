const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  title: {
    type: String,
    maxLength: 50,
    required: true
  },
  summary: {
    type: String,
    maxLength: 140,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  tags: [{
    type: Schema.Types.ObjectId,
    ref: "Tag",
    required: true
  }],
  comments: [{
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }],
  answers: [{
    type: Schema.Types.ObjectId,
    ref: "Answer"
  }],
  asked_by: {
    type: String,
    required: true
  },
  ask_date_time: {
    type: Date,
    default: Date.now
  },
  views: {
    type: Number,
    default: 0
  },
  votes: {
    type: Number,
    default: 0
  }
});
questionSchema.virtual("url").get(function() {return "posts/question/" + this._id;});
module.exports = mongoose.model("Question", questionSchema);
