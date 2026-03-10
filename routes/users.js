const express = require('express');

module.exports = function(readJSON, writeJSON) {
  const router = express.Router();

  // Get profile
  router.get('/profile', (req, res) => {
    if (!req.session.userId) return res.status(401).json({ error: 'Not logged in' });
    const users = readJSON('users.json');
    const user = users.find(u => u.id === req.session.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ id: user.id, name: user.name, email: user.email, points: user.points, createdAt: user.createdAt });
  });

  // Update profile
  router.put('/profile', (req, res) => {
    if (!req.session.userId) return res.status(401).json({ error: 'Not logged in' });
    const { name } = req.body;
    const users = readJSON('users.json');
    const idx = users.findIndex(u => u.id === req.session.userId);
    if (idx === -1) return res.status(404).json({ error: 'User not found' });
    if (name) users[idx].name = name;
    writeJSON('users.json', users);
    res.json({ success: true, user: users[idx] });
  });

  return router;
};
