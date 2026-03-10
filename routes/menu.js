const express = require('express');

module.exports = function(readJSON) {
  const router = express.Router();

  router.get('/', (req, res) => {
    const menu = readJSON('menu.json');
    res.json(menu);
  });

  router.get('/category/:cat', (req, res) => {
    const menu = readJSON('menu.json');
    const items = menu.items.filter(i => i.category === req.params.cat);
    res.json(items);
  });

  router.get('/item/:id', (req, res) => {
    const menu = readJSON('menu.json');
    const item = menu.items.find(i => i.id === parseInt(req.params.id));
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  });

  router.get('/popular', (req, res) => {
    const menu = readJSON('menu.json');
    res.json(menu.items.filter(i => i.popular));
  });

  return router;
};
