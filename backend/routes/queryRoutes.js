const express = require('express');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { executeQuery, getQueryHistory } = require('../controllers/queryController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

const router = express.Router();

const queryLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 15,
  message: { success: false, message: 'Too many queries, please slow down.' },
});

router.use(protect);

router.post(
  '/',
  queryLimiter,
  [
    body('connectionId').notEmpty().withMessage('Connection ID is required'),
    body('question').trim().notEmpty().withMessage('Question is required'),
  ],
  validate,
  executeQuery
);
router.get('/history/:connectionId', getQueryHistory);

module.exports = router;