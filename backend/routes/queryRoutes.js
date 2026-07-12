const express = require('express');
const rateLimit = require('express-rate-limit');
const { executeQuery } = require('../controllers/queryController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

const queryLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 15,
  message: { success: false, message: 'Too many queries, please slow down.' },
});

router.use(protect);
router.post('/', queryLimiter, executeQuery);

module.exports = router;