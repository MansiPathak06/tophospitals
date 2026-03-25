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
  
  console.log('--- LOGIN ATTEMPT ---');
  console.log('Email received:', email);
  console.log('Password received:', password);

  try {
    const result = await pool.query(
      'SELECT * FROM admins WHERE email = $1',
      [email]
    );
    
    console.log('Rows found:', result.rows.length);
    
    if (result.rows.length === 0) {
      console.log('FAIL: No user found with that email');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const admin = result.rows[0];
    console.log('Hash in DB:', admin.password_hash);
    
    const match = await bcrypt.compare(password, admin.password_hash);
    console.log('Password match:', match);

    if (!match) {
      console.log('FAIL: Password does not match hash');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token, email: admin.email });
  } catch (err) {
    console.error('ERROR:', err.message);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { seedAdmin, login };