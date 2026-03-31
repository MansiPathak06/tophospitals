const pool = require('../db');

// ── CREATE TABLE + safe migrations ───────────────────────────────────────────
const initTable = async () => {
  // 1. Create table without hospital_id first (safe for fresh installs)
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

  // 2. Add hospital_id column only if missing — no backfill here, that's
  //    done safely inside getHospitalReviews on first request.
  await pool.query(`
    ALTER TABLE reviews
    ADD COLUMN IF NOT EXISTS hospital_id INTEGER REFERENCES hospitals(id) ON DELETE SET NULL;
  `);
};
initTable().catch(err => console.error('reviews table init error:', err.message));


// GET /api/reviews — all reviews, newest first
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


// GET /api/reviews/hospital/:hospitalId
exports.getHospitalReviews = async (req, res) => {
  try {
    const hospitalId = parseInt(req.params.hospitalId, 10);
    if (isNaN(hospitalId)) {
      return res.status(400).json({ success: false, message: 'Invalid hospital id' });
    }

    // Get the hospital name
    const hospitalRow = await pool.query(
      'SELECT id, name FROM hospitals WHERE id = $1',
      [hospitalId]
    );
    if (hospitalRow.rows.length === 0) {
      return res.json({ success: true, data: [] });
    }
    const hospitalName = hospitalRow.rows[0].name.trim();

    // Backfill any existing reviews that match by name but have null hospital_id
    // (safe — hospital_id column is guaranteed to exist by this point)
    await pool.query(
      `UPDATE reviews
       SET    hospital_id = $1
       WHERE  hospital_id IS NULL
         AND  LOWER(TRIM(hospital)) = LOWER(TRIM($2))`,
      [hospitalId, hospitalName]
    );

    // Fetch all reviews for this hospital
    const { rows } = await pool.query(
      `SELECT * FROM reviews
       WHERE  hospital_id = $1
          OR  LOWER(TRIM(hospital)) = LOWER(TRIM($2))
       ORDER  BY created_at DESC`,
      [hospitalId, hospitalName]
    );

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('getHospitalReviews error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


// POST /api/reviews
exports.addReview = async (req, res) => {
  const { name, location, hospital, rating, review_text } = req.body;

  if (!name?.trim() || !location?.trim() || !hospital?.trim() || !review_text?.trim() || !rating) {
    return res.status(400).json({
      success: false,
      message: 'name, location, hospital, rating and review_text are all required.',
    });
  }
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ success: false, message: 'rating must be between 1 and 5.' });
  }
  if (review_text.trim().length < 20) {
    return res.status(400).json({ success: false, message: 'review_text must be at least 20 characters.' });
  }

  try {
    const hospitalResult = await pool.query(
      `SELECT id FROM hospitals WHERE LOWER(TRIM(name)) = LOWER(TRIM($1)) LIMIT 1`,
      [hospital.trim()]
    );
    const hospitalId = hospitalResult.rows.length > 0
      ? parseInt(hospitalResult.rows[0].id, 10)
      : null;

    const { rows } = await pool.query(
      `INSERT INTO reviews (name, location, hospital, hospital_id, rating, review_text)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name.trim(), location.trim(), hospital.trim(), hospitalId, Number(rating), review_text.trim()]
    );

    if (hospitalId) {
      await pool.query(
        `UPDATE hospitals
         SET reviews = reviews + 1,
             rating  = ROUND((rating * reviews + $1) / (reviews + 1)::numeric, 1)
         WHERE id = $2`,
        [Number(rating), hospitalId]
      );
    }

    res.status(201).json({ success: true, data: rows[0], linked: !!hospitalId });
  } catch (err) {
    console.error('addReview error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};