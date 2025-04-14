const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes/userRoutes');
const connectDB = require('./connections/mongo');
const cookieParser = require('cookie-parser');
const blogRoutes = require('./routes/blogRoutes/blogRoutes');
const productRoutes = require('./routes/productRoutes/productRoutes');
const setupSwagger = require('./swagger/swaggerConfig');

// Load environment variables
dotenv.config();

// Middleware
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Initialize Swagger
setupSwagger(app);

// Routes
// Import the welcome page generator
const getWelcomePage = require('./views/welcome');

// Root endpoint to display welcome page
app.get('/', (req, res) => {
  res.send(getWelcomePage());
});

app.use('/api/users', userRoutes); 
app.use('/api/blogs', blogRoutes);
app.use('/api/products', productRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Swagger API documentation available at http://localhost:${port}/api-docs`);
  });
}

// Export for Vercel serverless function
module.exports = app;
