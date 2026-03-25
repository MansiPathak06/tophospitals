const pool = require('../db');

const getAllDoctors = async (req, res) => {
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
};

const createDoctor = async (req, res) => {
  const { name, specialization, phone, email, hospital_id } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Doctor name is required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO doctors (name, specialization, phone, email, hospital_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, specialization, phone, email, hospital_id || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteDoctor = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM doctors WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json({ message: 'Doctor deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllDoctors, createDoctor, deleteDoctor };