require('dotenv').config();

const allowedOrigins = process.env.CORS_WHITELIST
  ? process.env.CORS_WHITELIST.split(',').map(origin => origin.trim())
  : [];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  }
};

module.exports = corsOptions;
