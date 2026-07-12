const mongoose = require('mongoose');

const querySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    connection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DBConnection',
      required: true,
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },
    generatedSQL: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Query', querySchema);