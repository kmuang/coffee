(function (root, createProducts) {
  const products = createProducts();

  if (typeof module === 'object' && module.exports) {
    module.exports = products;
  } else {
    root.CoffeeProducts = products;
  }
})(typeof globalThis === 'undefined' ? this : globalThis, function () {
  return Object.freeze({
    Espresso: { amount: 300 },
    Latte: { amount: 400 },
    Cappuccino: { amount: 450 },
    Americano: { amount: 350 },
    Mocha: { amount: 475 },
    Macchiato: { amount: 425 },
    'Flat White': { amount: 450 },
    'Irish Coffee': { amount: 550 },
    'Caramel Latte': { amount: 475 },
    'Vanilla Latte': { amount: 475 },
    'Hazelnut Coffee': { amount: 480 },
    'Iced Latte': { amount: 425 },
    'Iced Coffee': { amount: 250 },
    Affogato: { amount: 500 },
    Ristretto: { amount: 350 }
  });
});
