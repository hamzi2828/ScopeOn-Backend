const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes/userRoutes'); // Adjust path as needed
const connectDB = require('./connections/mongo'); // Adjust path as needed
const cookieParser = require('cookie-parser');
const blogRoutes = require('./routes/blogRoutes/blogRoutes');
const productRoutes = require('./routes/productRoutes/productRoutes');
app.use(cookieParser());

const port = 3000;




dotenv.config();  // Load environment variables from .env file
app.use(cors()); // Enable CORS for all routes



app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies


// Connect to MongoDB
connectDB();



app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/api/users', userRoutes); 
app.use('/api/blogs', blogRoutes);
app.use('/api/products', productRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
