const express = require('express');
const router  = express.Router();
const {
  getBlogs,
  getBlogById,
  getAllBlogsAdmin,
  createBlog,
  updateBlog,
  deleteBlog,
} = require('../controllers/blogController');

const  verifyToken  = require('../middleware/auth'); // your existing auth middleware

// ── Public routes (no auth needed) ────────────────────────────────────────────
router.get('/',     getBlogs);      // GET /api/blogs          (with ?category=&featured=true)
router.get('/:id',  getBlogById);   // GET /api/blogs/:id

// ── Admin-only routes (require valid JWT) ─────────────────────────────────────
router.get  ('/admin/all',  verifyToken, getAllBlogsAdmin); // GET    /api/blogs/admin/all
router.post ('/',           verifyToken, createBlog);       // POST   /api/blogs
router.put  ('/:id',        verifyToken, updateBlog);       // PUT    /api/blogs/:id
router.delete('/:id',       verifyToken, deleteBlog);       // DELETE /api/blogs/:id

module.exports = router;