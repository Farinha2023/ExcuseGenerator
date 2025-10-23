const fs = require('fs');
const path = require('path');
const { nanoid } = require('nanoid');

const templatesPath = path.join(__dirname, '..', 'data', 'templates.json');
const templates = JSON.parse(fs.readFileSync(templatesPath, 'utf8'));

// helpers: pickRandom, fillPlaceholders
function pick(arr, rng) {
  return arr[Math.floor(rng() * arr.length)];
}
function seededRng(seed) {
  if (!seed) return Math.random;
  let h = 2166136261 >>> 0;
  for (let i=0;i<seed.length;i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return () => (h = Math.imul(h + 0x6D2B79F5, 1664525) >>> 0) / 4294967296;
}

function fill(template, rng) {
  return template.replace(/\{([^\}]+)\}/g, (_, key) => {
    const parts = key.split('.');
    // support categories: noun, place, time, tech
    const arr = templates[key] || templates[parts[0]] || ['something'];
    return pick(arr, rng);
  });
}

function generate({ type='random', tone='funny', count=1, seed=null }) {
  const rng = seededRng(seed);
  const out = [];
  for (let i=0;i<count;i++) {
    // choose pool by type/tone
    let pool = templates[type] || templates[tone] || templates['all'];
    const template = pick(pool, rng);
    const text = fill(template, rng);
    out.push({ id: nanoid(), text, type, tone, createdAt: new Date().toISOString() });
  }
  return out;
}

module.exports = { generate };
