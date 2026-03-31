// routes/reviews.js
const express = require('express');
const router  = express.Router();
const { getReviews, addReview, getHospitalReviews } = require('../controllers/reviewController');

router.get('/',                      getReviews);
router.get('/hospital/:hospitalId',  getHospitalReviews);   // ← new
router.post('/',                     addReview);

module.exports = router;


