const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = function(readJSON, writeJSON) {
  const router = express.Router();

  // Register
  router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: 'All fields required' });

    const users = readJSON('users.json');
    if (users.find(u => u.email === email))
      return res.status(409).json({ error: 'Email already registered' });

    const hash = await bcrypt.hash(password, 10);
    const user = {
      id: uuidv4(), name, email,
      password: hash,
      points: 0,
      createdAt: new Date().toISOString(),
      orders: []
    };
    users.push(user);
    writeJSON('users.json', users);

    req.session.userId = user.id;
    res.json({ success: true, user: { id: user.id, name: user.name, email: user.email, points: user.points } });
  });

  // Login
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const users = readJSON('users.json');
    const user = users.find(u => u.email === email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    req.session.userId = user.id;
    res.json({ success: true, user: { id: user.id, name: user.name, email: user.email, points: user.points } });
  });

  // Logout
  router.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
  });

  // Me
  router.get('/me', (req, res) => {
    if (!req.session.userId) return res.json({ user: null });
    const users = readJSON('users.json');
    const user = users.find(u => u.id === req.session.userId);
    if (!user) return res.json({ user: null });
    res.json({ user: { id: user.id, name: user.name, email: user.email, points: user.points } });
  });

  return router;
};
