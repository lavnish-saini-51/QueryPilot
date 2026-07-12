require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const dbConnectionRoutes = require('./routes/dbConnectionRoutes');
const queryRoutes = require('./routes/queryRoutes');

connectDB();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/api/auth', authRoutes);
app.use('/api/db-connections', dbConnectionRoutes);
app.use('/api/query', queryRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'QueryMind AI Backend Running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));