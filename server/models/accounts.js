const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountSchema = new Schema({
  admin: {
    type: Boolean,
    default: false
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  reg_date_time: {
    type: Date,
    default: Date.now
  },
  reputation: {
    type: Number,
    default: 0
  },
  questions: [{
    type: Schema.Types.ObjectId,
    ref: "Question"
  }],
  tags: [{
    type: Schema.Types.ObjectId,
    ref: "Tag"
  }],
  answers: [{
    type: Schema.Types.ObjectId,
    ref: "Answer"
  }]
});
module.exports = mongoose.model("Account", accountSchema);
