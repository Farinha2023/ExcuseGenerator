const express = require('express');
const router = express.Router();
const generator = require('../services/generator');

router.get('/', async (req, res) => {
  // params: type, tone, count
  const type = req.query.type || 'random';     // surreal/plausible/tech/random
  const tone = req.query.tone || 'funny';      // funny/serious
  const count = Math.min(parseInt(req.query.count || '1', 10), 10);
  const seed = req.query.seed || null;

  try {
    const excuses = generator.generate({ type, tone, count, seed });
    res.json({ excuses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Generator error' });
  }
});

module.exports = router;
