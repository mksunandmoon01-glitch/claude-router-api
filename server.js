/**
 * Claude Router API
 * Main Express server for managing Claude AI model requests
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import routes
const modelsRouter = require('./routes/models');
const messagesRouter = require('./routes/messages');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    apiVersion: '1.0.0'
  });
});

// API Routes
app.use('/api/models', modelsRouter);
app.use('/api/messages', messagesRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Claude Router API',
    version: '1.0.0',
    description: 'API router for Claude AI models including Opus 4.8',
    endpoints: {
      health: '/health',
      models: '/api/models',
      messages: '/api/messages'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.path} not found`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════╗
║   Claude Router API Server Running  ║
║         Port: ${PORT}              ║
║    Model: Claude Opus 4.8 Ready    ║
╚════════════════════════════════════╝
  `);
  console.log('Available endpoints:');
  console.log('  GET  /                    - API info');
  console.log('  GET  /health              - Health check');
  console.log('  GET  /api/models          - List all models');
  console.log('  GET  /api/models/enabled  - List enabled models');
  console.log('  GET  /api/models/:modelId - Get model details');
  console.log('  POST /api/messages/send   - Send message');
  console.log('  POST /api/messages/batch  - Batch messages');
  console.log('  POST /api/messages/stream - Stream response');
});

module.exports = app;
