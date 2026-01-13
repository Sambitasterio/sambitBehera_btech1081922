const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authMiddleware = require('./middleware/authMiddleware');
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask
} = require('./controllers/taskController');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Test route
app.get('/', (req, res) => {
  res.json({
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// Task routes (all protected by authMiddleware)
app.post('/api/tasks', authMiddleware, createTask);
app.get('/api/tasks', authMiddleware, getTasks);
app.put('/api/tasks/:id', authMiddleware, updateTask);
app.delete('/api/tasks/:id', authMiddleware, deleteTask);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
