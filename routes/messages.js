/**
 * Message Routes
 * Endpoints for sending messages to Claude models
 */

const express = require('express');
const router = express.Router();
const ClaudeService = require('../services/claudeService');
const { isValidModel } = require('../models/modelConfig');

// Initialize Claude service
const claudeService = new ClaudeService(process.env.CLAUDE_API_KEY);

/**
 * POST /messages/send
 * Send a message to a Claude model
 */
router.post('/send', async (req, res) => {
  try {
    const { modelId, message, systemPrompt, options } = req.body;

    // Validate required fields
    if (!modelId) {
      return res.status(400).json({
        success: false,
        error: 'modelId is required'
      });
    }

    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'message is required'
      });
    }

    // Validate model
    if (!isValidModel(modelId)) {
      return res.status(400).json({
        success: false,
        error: `Invalid or disabled model: ${modelId}`
      });
    }

    const result = await claudeService.sendMessage(
      modelId,
      message,
      systemPrompt,
      options || {}
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /messages/batch
 * Send multiple messages in batch
 */
router.post('/batch', async (req, res) => {
  try {
    const { modelId, messages, systemPrompt, options } = req.body;

    // Validate required fields
    if (!modelId) {
      return res.status(400).json({
        success: false,
        error: 'modelId is required'
      });
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'messages must be a non-empty array'
      });
    }

    // Validate model
    if (!isValidModel(modelId)) {
      return res.status(400).json({
        success: false,
        error: `Invalid or disabled model: ${modelId}`
      });
    }

    const result = await claudeService.batchMessages(
      modelId,
      messages,
      systemPrompt,
      options || {}
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /messages/stream
 * Stream a message response from Claude
 */
router.post('/stream', async (req, res) => {
  try {
    const { modelId, message, systemPrompt, options } = req.body;

    // Validate required fields
    if (!modelId) {
      return res.status(400).json({
        success: false,
        error: 'modelId is required'
      });
    }

    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'message is required'
      });
    }

    // Validate model
    if (!isValidModel(modelId)) {
      return res.status(400).json({
        success: false,
        error: `Invalid or disabled model: ${modelId}`
      });
    }

    const stream = await claudeService.sendMessageStream(
      modelId,
      message,
      systemPrompt,
      options || {}
    );

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    stream.data.pipe(res);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
