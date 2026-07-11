const mongoose = require('mongoose');
const { encrypt, decrypt } = require('../utils/encryption');

const dbConnectionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    label: {
      type: String,
      required: [true, 'Connection label is required'],
      trim: true,
      maxlength: [50, 'Label cannot exceed 50 characters'],
    },
    host: {
      type: String,
      required: [true, 'Host is required'],
      trim: true,
    },
    port: {
      type: Number,
      required: [true, 'Port is required'],
      default: 3306,
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false, // never returned by default queries
    },
    database: {
      type: String,
      required: [true, 'Database name is required'],
      trim: true,
    },
  },
  { timestamps: true }
);

// Encrypt sensitive fields before saving
dbConnectionSchema.pre('save', function () {
  if (this.isModified('password')) {
    this.password = encrypt(this.password);
  }
  if (this.isModified('username')) {
    this.username = encrypt(this.username);
  }
});

// Instance method to get decrypted credentials (used only internally, never sent to client)
dbConnectionSchema.methods.getDecryptedCredentials = function () {
  return {
    host: this.host,
    port: this.port,
    username: decrypt(this.username),
    password: decrypt(this.password),
    database: this.database,
  };
};

module.exports = mongoose.model('DBConnection', dbConnectionSchema);