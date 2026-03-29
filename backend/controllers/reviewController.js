const pool = require('../db');

// ── CREATE TABLE if it doesn't exist (runs once on first request) ──────────
const initTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS reviews (
      id           SERIAL PRIMARY KEY,
      name         VARCHAR(100)  NOT NULL,
      location     VARCHAR(100)  NOT NULL,
      hospital     VARCHAR(150),
      rating       SMALLINT      NOT NULL CHECK (rating BETWEEN 1 AND 5),
      review_text  TEXT          NOT NULL,
      created_at   TIMESTAMPTZ   DEFAULT NOW()
    );
  `);
};
initTable().catch(err => console.error('reviews table init error:', err.message));


// GET /api/reviews  — fetch all reviews, newest first
exports.getReviews = async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM reviews ORDER BY created_at DESC'
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('getReviews error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


// POST /api/reviews  — add a new review
exports.addReview = async (req, res) => {
  const { name, location, hospital, rating, review_text } = req.body;

  // Basic validation
  if (!name?.trim() || !location?.trim() || !review_text?.trim() || !rating) {
    return res.status(400).json({ success: false, message: 'name, location, rating and review_text are required.' });
  }
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ success: false, message: 'rating must be between 1 and 5.' });
  }
  if (review_text.trim().length < 20) {
    return res.status(400).json({ success: false, message: 'review_text must be at least 20 characters.' });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO reviews (name, location, hospital, rating, review_text)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name.trim(), location.trim(), hospital?.trim() || null, Number(rating), review_text.trim()]
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('addReview error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};