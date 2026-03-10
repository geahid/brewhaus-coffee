const express = require('express');
const { v4: uuidv4 } = require('uuid');

module.exports = function(readJSON, writeJSON) {
  const router = express.Router();

  // Place order
  router.post('/', (req, res) => {
    const { items, customer, paymentMethod, orderType, pickupTime, address, promoCode } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ error: 'No items in order' });

    const subtotal = items.reduce((sum, i) => sum + i.totalPrice, 0);
    let discount = 0;
    if (promoCode === 'BREW10') discount = Math.floor(subtotal * 0.1);
    if (promoCode === 'WELCOME') discount = 50;
    const deliveryFee = orderType === 'delivery' ? 60 : 0;
    const total = subtotal - discount + deliveryFee;

    const order = {
      id: uuidv4(),
      shortId: Math.random().toString(36).substr(2, 6).toUpperCase(),
      items, customer, paymentMethod, orderType,
      pickupTime: pickupTime || null,
      address: address || null,
      promoCode: promoCode || null,
      subtotal, discount, deliveryFee, total,
      status: 'pending',
      userId: req.session.userId || null,
      createdAt: new Date().toISOString(),
      estimatedWait: Math.floor(Math.random() * 10) + 10 // 10-20 min
    };

    const orders = readJSON('orders.json');
    orders.push(order);
    writeJSON('orders.json', orders);

    // Add loyalty points if logged in
    if (req.session.userId) {
      const users = readJSON('users.json');
      const idx = users.findIndex(u => u.id === req.session.userId);
      if (idx !== -1) {
        users[idx].points += Math.floor(total / 10);
        users[idx].orders.push(order.id);
        writeJSON('users.json', users);
      }
    }

    res.json({ success: true, order });
  });

  // Get order by ID
  router.get('/:id', (req, res) => {
    const orders = readJSON('orders.json');
    const order = orders.find(o => o.id === req.params.id || o.shortId === req.params.id.toUpperCase());
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  });

  // Get my orders (session)
  router.get('/', (req, res) => {
    if (!req.session.userId) return res.json([]);
    const orders = readJSON('orders.json');
    res.json(orders.filter(o => o.userId === req.session.userId).reverse());
  });

  // Reorder
  router.post('/:id/reorder', (req, res) => {
    const orders = readJSON('orders.json');
    const original = orders.find(o => o.id === req.params.id);
    if (!original) return res.status(404).json({ error: 'Order not found' });
    res.json({ items: original.items });
  });

  return router;
};
