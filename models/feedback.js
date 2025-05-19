const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
  occupation: String,

  chatbotVersion: String,
  chatMessage: Number,
  quickReply: Number,
  typingIndicator: Number,
  persistentMenu: Number,
  informationStamp: Number,
  sessionMinimization: Number,
  conversationClosure: Number,

  comments: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Feedback', FeedbackSchema);