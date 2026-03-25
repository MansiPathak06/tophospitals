const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getAllDoctors, createDoctor, deleteDoctor } = require('../controllers/doctorController');

router.get('/', auth, getAllDoctors);
router.post('/', auth, createDoctor);
router.delete('/:id', auth, deleteDoctor);

module.exports = router;