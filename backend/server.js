const express = require('express');
const cors = require('cors');
require('dotenv').config();


const app = express();
app.use(cors());
app.use(express.json());
const path = require('path');
const fs = require('fs');


app.use('/api/auth', require('./routes/auth'));
app.use('/api/hospitals', require('./routes/hospitals'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/blogs',     require('./routes/blogs'));
app.use('/api/reviews',   require('./routes/reviews')); 
// Ensure uploads dir exists
fs.mkdirSync('public/uploads', { recursive: true });

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/api/upload', require('./routes/upload'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});