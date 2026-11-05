const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const products = require('../products');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const chalkboard = fs.readFileSync(path.join(root, 'chalkboard.html'), 'utf8');

test('menu items and displayed prices match the shared checkout catalog', () => {
  const menuItems = [...html.matchAll(
    /<h5 class="card-title">([^<]+)<\/h5>\s*<p class="card-text">\$(\d+)\.(\d{2})<\/p>/g
  )].map(([, name, dollars, cents]) => ({
    name,
    amount: Number(dollars) * 100 + Number(cents)
  }));

  assert.equal(menuItems.length, Object.keys(products).length);
  assert.equal(new Set(menuItems.map(({ name }) => name)).size, menuItems.length);
  assert.deepEqual(
    Object.fromEntries(menuItems.map(({ name, amount }) => [name, amount])),
    Object.fromEntries(Object.entries(products).map(([name, product]) => [name, product.amount]))
  );
});

test('chalkboard menu names and prices match the shared catalog', () => {
  const menuItems = [...chalkboard.matchAll(
    /<div class="menu-item">\s*<span>([\s\S]*?)<\/span>\s*<span>\$(\d+)\.(\d{2})<\/span>\s*<\/div>/g
  )].map(([, label, dollars, cents]) => ({
    name: label.replace(/<[^>]*>/g, '').replace('★ Customer favorite', '').trim(),
    amount: Number(dollars) * 100 + Number(cents)
  }));

  assert.ok(menuItems.length > 0);
  menuItems.forEach(({ name, amount }) => {
    assert.equal(products[name]?.amount, amount, `${name} should match the checkout catalog`);
  });
});

test('each menu card uses a distinct local optimized image', () => {
  const imagePaths = [...html.matchAll(
    /<img src="([^"]+)" class="card-img-top" alt="([^"]+)" loading="lazy"/g
  )].map(([, imagePath]) => imagePath);

  assert.equal(imagePaths.length, Object.keys(products).length);
  assert.equal(new Set(imagePaths).size, imagePaths.length);

  imagePaths.forEach((imagePath) => {
    assert.match(imagePath, /^img\//, `${imagePath} should be local`);
    const resolvedPath = path.join(root, imagePath);
    assert.ok(fs.existsSync(resolvedPath), `${imagePath} should exist`);
    assert.ok(fs.statSync(resolvedPath).size < 200 * 1024, `${imagePath} should be optimized`);
  });
});
