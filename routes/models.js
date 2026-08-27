/**
 * Model Routes
 * Endpoints for listing and managing available models
 */

const express = require('express');
const router = express.Router();
const { getAllModels, getEnabledModels, getModelById } = require('../models/modelConfig');

/**
 * GET /models
 * List all available models
 */
router.get('/', (req, res) => {
  try {
    const allModels = getAllModels();
    const modelsArray = Object.entries(allModels).map(([id, model]) => ({
      id,
      ...model
    }));

    res.json({
      success: true,
      total: modelsArray.length,
      models: modelsArray
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /models/enabled
 * List only enabled models
 */
router.get('/enabled', (req, res) => {
  try {
    const enabledModels = getEnabledModels();

    res.json({
      success: true,
      total: enabledModels.length,
      models: enabledModels
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /models/:modelId
 * Get details for a specific model
 */
router.get('/:modelId', (req, res) => {
  try {
    const { modelId } = req.params;
    const model = getModelById(modelId);

    if (!model) {
      return res.status(404).json({
        success: false,
        error: `Model '${modelId}' not found`
      });
    }

    res.json({
      success: true,
      id: modelId,
      ...model
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /models/by-tier/:tier
 * Get models by tier (Free, Standard, Pro+, Max)
 */
router.get('/by-tier/:tier', (req, res) => {
  try {
    const { tier } = req.params;
    const allModels = getAllModels();
    const filtered = Object.entries(allModels)
      .filter(([_, model]) => model.tier === tier)
      .map(([id, model]) => ({
        id,
        ...model
      }));

    if (filtered.length === 0) {
      return res.status(404).json({
        success: false,
        error: `No models found for tier: ${tier}`
      });
    }

    res.json({
      success: true,
      tier,
      total: filtered.length,
      models: filtered
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
