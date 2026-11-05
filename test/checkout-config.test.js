const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

test('browser checkout uses the same-origin serverless route', () => {
  assert.match(html, /const checkoutEndpoint = '\/create-checkout-session';/);
  assert.doesNotMatch(html, /localhost:4242\/create-checkout-session/);
});

test('Vercel routes checkout requests to the API function', () => {
  const config = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));

  assert.ok(config.rewrites.some(({ source, destination }) => (
    source === '/create-checkout-session' &&
    destination === '/api/create-checkout-session'
  )));
});

test('Netlify routes checkout requests to its function', () => {
  const config = fs.readFileSync(path.join(root, 'netlify.toml'), 'utf8');

  assert.match(config, /from = "\/create-checkout-session"[\s\S]*to = "\/\.netlify\/functions\/create-checkout-session"/);
});
