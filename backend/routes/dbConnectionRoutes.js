const express = require('express');
const { body } = require('express-validator');
const {
  testDBConnection,
  createDBConnection,
  getDBConnections,
  deleteDBConnection,
} = require('../controllers/dbConnectionController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

const router = express.Router();

const connectionValidation = [
  body('host').trim().notEmpty().withMessage('Host is required'),
  body('port').isInt({ min: 1, max: 65535 }).withMessage('Valid port is required'),
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
  body('database').trim().notEmpty().withMessage('Database name is required'),
];

router.use(protect);

router.post('/test', connectionValidation, validate, testDBConnection);
router.post(
  '/',
  [...connectionValidation, body('label').trim().notEmpty().withMessage('Label is required')],
  validate,
  createDBConnection
);
router.get('/', getDBConnections);
router.delete('/:id', deleteDBConnection);

module.exports = router;