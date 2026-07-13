const DBConnection = require('../models/DBConnection');
const Query = require('../models/Query');
const { testConnection } = require('../services/mysqlService');

// @desc    Test MySQL connection credentials (without saving)
// @route   POST /api/db-connections/test
exports.testDBConnection = async (req, res, next) => {
  try {
    const { host, port, username, password, database } = req.body;
    await testConnection({ host, port, username, password, database });
    res.status(200).json({ success: true, message: 'Connection successful' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Connection failed: ' + error.message });
  }
};

// @desc    Save a new DB connection (credentials encrypted at rest)
// @route   POST /api/db-connections
exports.createDBConnection = async (req, res, next) => {
  try {
    const { label, host, port, username, password, database } = req.body;

    // Verify connection works before saving
    await testConnection({ host, port, username, password, database });

    const connection = await DBConnection.create({
      user: req.user.id,
      label,
      host,
      port,
      username,
      password,
      database,
    });

    res.status(201).json({
      success: true,
      data: {
        _id: connection._id,
        label: connection.label,
        host: connection.host,
        port: connection.port,
        database: connection.database,
        createdAt: connection.createdAt,
      },
    });
  } catch (error) {
    if (error.message.startsWith('Connection failed') || error.name === 'MongooseError') {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

// @desc    Get all DB connections for logged-in user (metadata only)
// @route   GET /api/db-connections
exports.getDBConnections = async (req, res, next) => {
  try {
    const connections = await DBConnection.find({ user: req.user.id }).select('-password -username');
    res.status(200).json({ success: true, data: connections });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a DB connection
// @route   DELETE /api/db-connections/:id
exports.deleteDBConnection = async (req, res, next) => {
  try {
    const connection = await DBConnection.findOne({ _id: req.params.id, user: req.user.id });
    if (!connection) {
      return res.status(404).json({ success: false, message: 'Connection not found' });
    }

    await Query.deleteMany({ connection: connection._id, user: req.user.id });
    await connection.deleteOne();

    res.status(200).json({ success: true, message: 'Connection and its query history deleted' });
  } catch (error) {
    next(error);
  }
};