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

// ── Public routes ──────────────────────────────────────────────────────────
router.get('/', getBlogs);                                    // GET /api/blogs
router.get('/admin/all', verifyToken, getAllBlogsAdmin);       // GET /api/blogs/admin/all  ← MOVE UP
router.get('/:id', getBlogById);                              // GET /api/blogs/:id  ← keep last

// ── Admin-only routes ──────────────────────────────────────────────────────
router.post('/',      verifyToken, createBlog);
router.put('/:id',    verifyToken, updateBlog);
router.delete('/:id', verifyToken, deleteBlog);

module.exports = router;