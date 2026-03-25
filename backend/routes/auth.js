const express = require('express');
const router = express.Router();
const { seedAdmin, login } = require('../controllers/authController');

router.post('/seed', seedAdmin);
router.post('/login', login);

module.exports = router;   // ← this was missing before, causing your error