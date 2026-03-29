const db = require('../db'); // adjust path to your DB connection module

// ─── GET all published blogs (public) ─────────────────────────────────────────
const getBlogs = async (req, res) => {
  try {
    const { category, featured } = req.query;

    let query = 'SELECT * FROM blogs WHERE published = TRUE';
    const params = [];

    if (category && category !== 'All') {
      params.push(category);
      query += ` AND category = $${params.length}`; // use ? for MySQL
    }

    if (featured === 'true') {
      query += ' AND is_featured = TRUE';
    }

    query += ' ORDER BY created_at DESC';

    const result = await db.query(query, params);
    res.json(result.rows ?? result); // result.rows for pg, result for mysql2
  } catch (err) {
    console.error('getBlogs error:', err);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
};

// ─── GET single blog by id (public) ───────────────────────────────────────────
const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Add this guard
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'Invalid blog ID' });
    }

    const result = await db.query(
      'SELECT * FROM blogs WHERE id = $1 AND published = TRUE',
      [id]
    );
    const blog = result.rows ? result.rows[0] : result[0];
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    console.error('getBlogById error:', err);
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
};

// ─── GET all blogs including drafts (admin only) ───────────────────────────────
const getAllBlogsAdmin = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM blogs ORDER BY created_at DESC',
      []
    );
    res.json(result.rows ?? result);
  } catch (err) {
    console.error('getAllBlogsAdmin error:', err);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
};

// ─── CREATE blog (admin) ───────────────────────────────────────────────────────
const createBlog = async (req, res) => {
  try {
    const {
      title, excerpt, content, category,
      author, author_role, image_url, read_time,
      is_featured, published,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }

    // ── PostgreSQL ─────────────────────────────────────────────────────────────
    const result = await db.query(
      `INSERT INTO blogs
         (title, excerpt, content, category, author, author_role,
          image_url, read_time, is_featured, published)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING *`,
      [
        title.trim(),
        excerpt   ?? null,
        content   ?? null,
        category  ?? null,
        author    ?? null,
        author_role ?? null,
        image_url ?? null,
        read_time ?? null,
        is_featured ?? false,
        published   ?? true,
      ]
    );

    /* ── MySQL variant ──────────────────────────────────────────────────────────
    const [result] = await db.query(
      `INSERT INTO blogs
         (title, excerpt, content, category, author, author_role,
          image_url, read_time, is_featured, published)
       VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [title.trim(), excerpt??null, content??null, category??null,
       author??null, author_role??null, image_url??null, read_time??null,
       is_featured??0, published??1]
    );
    const [rows] = await db.query('SELECT * FROM blogs WHERE id = ?', [result.insertId]);
    return res.status(201).json(rows[0]);
    ─────────────────────────────────────────────────────────────────────────── */

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('createBlog error:', err);
    res.status(500).json({ error: 'Failed to create blog' });
  }
};

// ─── UPDATE blog (admin) ───────────────────────────────────────────────────────
const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title, excerpt, content, category,
      author, author_role, image_url, read_time,
      is_featured, published,
    } = req.body;

    // ── PostgreSQL ─────────────────────────────────────────────────────────────
    const result = await db.query(
      `UPDATE blogs SET
         title       = COALESCE($1, title),
         excerpt     = COALESCE($2, excerpt),
         content     = COALESCE($3, content),
         category    = COALESCE($4, category),
         author      = COALESCE($5, author),
         author_role = COALESCE($6, author_role),
         image_url   = COALESCE($7, image_url),
         read_time   = COALESCE($8, read_time),
         is_featured = COALESCE($9, is_featured),
         published   = COALESCE($10, published),
         updated_at  = CURRENT_TIMESTAMP
       WHERE id = $11
       RETURNING *`,
      [title, excerpt, content, category, author, author_role,
       image_url, read_time, is_featured, published, id]
    );

    /* ── MySQL variant ──────────────────────────────────────────────────────────
    await db.query(
      `UPDATE blogs SET
         title       = COALESCE(?, title),
         excerpt     = COALESCE(?, excerpt),
         content     = COALESCE(?, content),
         category    = COALESCE(?, category),
         author      = COALESCE(?, author),
         author_role = COALESCE(?, author_role),
         image_url   = COALESCE(?, image_url),
         read_time   = COALESCE(?, read_time),
         is_featured = COALESCE(?, is_featured),
         published   = COALESCE(?, published)
       WHERE id = ?`,
      [title, excerpt, content, category, author, author_role,
       image_url, read_time, is_featured, published, id]
    );
    const [rows] = await db.query('SELECT * FROM blogs WHERE id = ?', [id]);
    return res.json(rows[0]);
    ─────────────────────────────────────────────────────────────────────────── */

    const blog = result.rows[0];
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    console.error('updateBlog error:', err);
    res.status(500).json({ error: 'Failed to update blog' });
  }
};

// ─── DELETE blog (admin) ───────────────────────────────────────────────────────
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM blogs WHERE id = $1', [id]); // $1 → ? for MySQL
    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    console.error('deleteBlog error:', err);
    res.status(500).json({ error: 'Failed to delete blog' });
  }
};

module.exports = {
  getBlogs,
  getBlogById,
  getAllBlogsAdmin,
  createBlog,
  updateBlog,
  deleteBlog,
};