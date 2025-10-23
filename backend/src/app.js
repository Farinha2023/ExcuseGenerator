const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimitFlexible = require('rate-limit-flexible');

const excusesRouter = require('./routes/excuses');

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || '*' }));
app.use(express.json());
app.use(morgan('dev'));

// basic rate limiting
const { RateLimitMemory } = require('rate-limit-flexible');
const rateLimiter = new RateLimitMemory({
  points: 100, duration: 60 // 100 requests per minute
});
app.use((req, res, next) => {
  rateLimiter.consume(req.ip)
    .then(() => next())
    .catch(() => res.status(429).json({ error: 'Too many requests' }));
});

app.use('/api/excuses', excusesRouter);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

module.exports = app;
