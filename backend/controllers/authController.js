const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const seedAdmin = async (req, res) => {
  try {
    const existing = await pool.query(
      'SELECT * FROM admins WHERE email = $1',
      [process.env.ADMIN_EMAIL]
    );
    if (existing.rows.length > 0) {
      return res.json({ message: 'Admin already exists' });
    }

    const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    await pool.query(
      'INSERT INTO admins (email, password_hash) VALUES ($1, $2)',
      [process.env.ADMIN_EMAIL, hash]
    );
    res.json({ message: 'Admin seeded successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM admins WHERE email = $1',
      [email]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const admin = result.rows[0];
    const match = await bcrypt.compare(password, admin.password_hash);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token, email: admin.email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { seedAdmin, login };