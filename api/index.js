const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('../connections/mongo');
const userRoutes = require('../routes/userRoutes/userRoutes');
const blogRoutes = require('../routes/blogRoutes/blogRoutes');
const productRoutes = require('../routes/productRoutes/productRoutes');
const setupSwagger = require('../swagger/swaggerConfig');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Initialize Swagger
setupSwagger(app);

// Routes
app.get('/', (req, res) => {
  res.send('ScopeOn API is running!');
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
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Swagger API documentation available at http://localhost:${PORT}/api-docs`);
  });
}

// Export for Vercel serverless function
module.exports = app;
