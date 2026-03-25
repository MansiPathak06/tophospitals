const pool = require('../db');

const getAllHospitals = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM hospitals ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createHospital = async (req, res) => {
  const { name, address, city, state, phone, email } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Hospital name is required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO hospitals (name, address, city, state, phone, email)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, address, city, state, phone, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteHospital = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM hospitals WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Hospital not found' });
    }
    res.json({ message: 'Hospital deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllHospitals, createHospital, deleteHospital };