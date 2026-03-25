const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getAllHospitals, createHospital, deleteHospital } = require('../controllers/hospitalController');

router.get('/', auth, getAllHospitals);
router.post('/', auth, createHospital);
router.delete('/:id', auth, deleteHospital);

module.exports = router;