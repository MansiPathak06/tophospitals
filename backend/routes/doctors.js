const express = require('express');
const router = express.Router();
const pool = require('../db');
const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'No token' });
  try {
    req.admin = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// GET /api/doctors — public, joins hospital name
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT d.*, h.name AS hospital_name
      FROM doctors d
      LEFT JOIN hospitals h ON d.hospital_id = h.id
      ORDER BY d.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/doctors — protected
router.post('/', auth, async (req, res) => {
  const { name, specialization, experience, phone, email, image, hospital_id } = req.body;
  if (!name) return res.status(400).json({ message: 'Name is required' });
  try {
    const result = await pool.query(
      `INSERT INTO doctors (name, specialization, experience, phone, email, image, hospital_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [name, specialization, experience, phone, email, image, hospital_id || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/doctors/:id — protected
router.delete('/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM doctors WHERE id = $1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;