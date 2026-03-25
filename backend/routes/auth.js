const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const pool = require('../db'); // ← ADD THIS
const { seedAdmin, login } = require('../controllers/authController');

router.post('/seed', seedAdmin);
router.post('/login', login);

router.get('/test-hash', async (req, res) => {
  try {
    const password = 'Zentrix@2026';
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query('SELECT password_hash FROM admins WHERE email = $1', ['team.zentrix01@gmail.com']);
    const storedHash = result.rows[0]?.password_hash;
    const match = await bcrypt.compare(password, storedHash);
    
    res.json({
      newHash: hash,
      storedHash: storedHash,
      match: match,
      envPassword: process.env.ADMIN_PASSWORD
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
