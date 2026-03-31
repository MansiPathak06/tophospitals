const express = require("express");
const router = express.Router();
const pool = require("../db");
const jwt = require("jsonwebtoken");

// ── Auth middleware ──────────────────────────────────────────────────────────
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "No token" });
  try {
    req.admin = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

// ── GET /api/hospitals — public ──────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const hospitals = await pool.query(
      "SELECT * FROM hospitals ORDER BY created_at DESC",
    );
    const doctors = await pool.query("SELECT * FROM doctors");
    const result = hospitals.rows.map((h) => ({
      ...h,
      doctors: doctors.rows.filter((d) => d.hospital_id === h.id),
    }));
    res.json(result);
  } catch (err) {
    console.error("❌ GET /hospitals error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/hospitals/:id — public ─────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const h = await pool.query("SELECT * FROM hospitals WHERE id = $1", [
      req.params.id,
    ]);
    if (h.rows.length === 0)
      return res.status(404).json({ message: "Not found" });
    const doctors = await pool.query(
      "SELECT * FROM doctors WHERE hospital_id = $1",
      [req.params.id],
    );
    res.json({ ...h.rows[0], doctors: doctors.rows });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/hospitals — protected ─────────────────────────────────────────
router.post("/", auth, async (req, res) => {
  const {
    name,
    city,
    state,
    address,
    phone,
    email,
    about,
    image,
    gallery,
    specialities,
    tag,
    rating,
    reviews,
    verified,
    emergency,
    opening,
    closing,
    map_embed,
    timings, // ✅ added
    doctors: doctorsList,
  } = req.body;

  if (!name) return res.status(400).json({ message: "Name is required" });

  try {
   const result = await pool.query(
  `INSERT INTO hospitals
    (name, city, state, address, phone, email, about, image, gallery,
     specialities, tag, rating, reviews, verified, emergency,
     opening, closing, map_embed, timings)
   VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
   RETURNING *`,
  [
    name, city, state, address, phone, email,
    about, image,
    gallery      || [],          // text[] — plain array
    specialities || [],          // text[] — plain array
    tag, rating || 0, reviews || 0,
    verified  || false,
    emergency || false,
    opening, closing, map_embed,
    JSON.stringify(timings || []),  // jsonb — must stringify
  ]
);

    const hospital = result.rows[0];

    if (Array.isArray(doctorsList) && doctorsList.length > 0) {
      for (const doc of doctorsList) {
        if (!doc.name) continue;
        await pool.query(
          `INSERT INTO doctors (hospital_id, name, specialization, experience, phone, email, image)
           VALUES ($1,$2,$3,$4,$5,$6,$7)`,
          [
            hospital.id,
            doc.name,
            doc.specialization,
            doc.experience,
            doc.phone,
            doc.email,
            doc.image,
          ],
        );
      }
    }

    const doctors = await pool.query(
      "SELECT * FROM doctors WHERE hospital_id = $1",
      [hospital.id],
    );
    res.status(201).json({ ...hospital, doctors: doctors.rows });
  } catch (err) {
    console.error("❌ POST /hospitals:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// ── DELETE /api/hospitals/:id — protected ────────────────────────────────────
router.delete("/:id", auth, async (req, res) => {
  try {
    await pool.query("DELETE FROM hospitals WHERE id = $1", [req.params.id]);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── PUT /api/hospitals/:id — protected ──────────────────────────────────────
router.put("/:id", auth, async (req, res) => {
  const {
    name,
    city,
    state,
    address,
    phone,
    email,
    about,
    image,
    gallery,
    specialities,
    tag,
    rating,
    reviews,
    verified,
    emergency,
    opening,
    closing,
    map_embed,
    timings, // ✅ added
  } = req.body;

  if (!name) return res.status(400).json({ message: "Name is required" });

  try {
   const result = await pool.query(
  `UPDATE hospitals SET
    name=$1, city=$2, state=$3, address=$4, phone=$5, email=$6,
    about=$7, image=$8, gallery=$9, specialities=$10,
    tag=$11, rating=$12, reviews=$13, verified=$14, emergency=$15,
    opening=$16, closing=$17, map_embed=$18, timings=$19
   WHERE id=$20 RETURNING *`,
  [
    name, city, state, address, phone, email,
    about, image,
    gallery      || [],          // text[] — plain array
    specialities || [],          // text[] — plain array
    tag, rating || 0, reviews || 0,
    verified  || false,
    emergency || false,
    opening, closing, map_embed,
    JSON.stringify(timings || []),  // jsonb — must stringify
    req.params.id,
  ]
);

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Not found" });

    const doctors = await pool.query(
      "SELECT * FROM doctors WHERE hospital_id = $1",
      [req.params.id],
    );
    res.json({ ...result.rows[0], doctors: doctors.rows });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
