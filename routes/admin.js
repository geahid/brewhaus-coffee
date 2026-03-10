const express = require('express');

const ADMIN_PASSWORD = 'brewhaus-admin-2024';

module.exports = function(readJSON, writeJSON) {
  const router = express.Router();

  // Admin login
  router.post('/login', (req, res) => {
    if (req.body.password === ADMIN_PASSWORD) {
      req.session.isAdmin = true;
      res.json({ success: true });
    } else {
      res.status(401).json({ error: 'Wrong password' });
    }
  });

  function requireAdmin(req, res, next) {
    if (!req.session.isAdmin) return res.status(403).json({ error: 'Admin only' });
    next();
  }

  // Dashboard stats
  router.get('/stats', requireAdmin, (req, res) => {
    const orders = readJSON('orders.json');
    const users = readJSON('users.json');
    const today = new Date().toDateString();
    const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === today);
    res.json({
      totalOrders: orders.length,
      todayOrders: todayOrders.length,
      todayRevenue: todayOrders.reduce((s, o) => s + o.total, 0),
      totalRevenue: orders.reduce((s, o) => s + o.total, 0),
      totalUsers: users.length,
      pendingOrders: orders.filter(o => o.status === 'pending').length
    });
  });

  // All orders
  router.get('/orders', requireAdmin, (req, res) => {
    res.json(readJSON('orders.json').reverse());
  });

  // Update order status
  router.put('/orders/:id/status', requireAdmin, (req, res) => {
    const { status } = req.body;
    const valid = ['pending','preparing','ready','completed','cancelled'];
    if (!valid.includes(status)) return res.status(400).json({ error: 'Invalid status' });
    const orders = readJSON('orders.json');
    const idx = orders.findIndex(o => o.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Order not found' });
    orders[idx].status = status;
    writeJSON('orders.json', orders);
    res.json({ success: true, order: orders[idx] });
  });

  // Update menu item availability
  router.put('/menu/:id/availability', requireAdmin, (req, res) => {
    const { available } = req.body;
    const menu = readJSON('menu.json');
    const idx = menu.items.findIndex(i => i.id === parseInt(req.params.id));
    if (idx === -1) return res.status(404).json({ error: 'Item not found' });
    menu.items[idx].available = available;
    writeJSON('menu.json', menu);
    res.json({ success: true });
  });

  return router;
};
