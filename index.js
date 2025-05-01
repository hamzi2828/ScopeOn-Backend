const express = require('express');
const app = express();
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');       
const userRoutes = require('./src/routes/userRoutes/userRoutes');
const connectDB = require('./connections/mongo');
const cookieParser = require('cookie-parser');
const blogRoutes = require('./src/routes/blogRoutes/blogRoutes');
const listingRoutes = require('./src/routes/listingRoutes/listingRoutes');
const setupSwagger = require('./swagger/swaggerConfig');

// Load environment variables
dotenv.config();

// Middleware
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from /uploads/photos
const path = require('path');
app.use('/uploads/photos', express.static(path.join(__dirname, 'uploads/listing-photos')));

// Connect to MongoDB
connectDB();

// Initialize Swagger
setupSwagger(app);

// Routes
const getWelcomePage = require('./views/welcome');
app.get('/', (req, res) => {
  res.send(getWelcomePage());
});
app.use('/users', userRoutes); 
app.use('/blogs', blogRoutes);
app.use('/listings', listingRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const port = 3001;
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Swagger API documentation available at http://localhost:${port}/api-docs`);
  });
}

// Export for Vercel serverless function
module.exports = app;