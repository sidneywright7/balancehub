\// Main entry point for the BalanceHub API server
// Loads environment variables, connects to MongoDB, and sets up Express middleware and routes

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

const app = express();

// Middleware
app.use(cors()); // Allow cross-origin requests from the React frontend
app.use(express.json()); // Parse incoming JSON request bodies

// API Routes
app.use('/api/auth', require('./routes/auth')); // Authentication routes (login/register)
app.use('/api/categories', require('./routes/categories')); // Category routes
app.use('/api/questions', require('./routes/questions')); // Question routes
app.use('/api/answers', require('./routes/answers')); // Answer routes

// Test route to confirm server is running
app.get('/', (req, res) => {
  res.send('BalanceHub API is running!');
});

// Start the server on the specified port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});