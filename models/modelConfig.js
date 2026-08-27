/**
 * Model Configuration for Claude AI Router
 * Includes all available Claude models with their specifications
 */

const MODELS = {
  // Claude 3 Series
  'claude-opus-5': {
    name: 'Claude Opus 5',
    provider: 'Anthropic',
    tier: 'Pro+',
    contextWindow: 200000,
    description: 'Most powerful at complex tasks',
    maxTokens: 4096,
    costPer1kInput: 0.003,
    costPer1kOutput: 0.015,
    enabled: true,
    fastMode: false
  },
  
  'claude-opus-4-8-fast': {
    name: 'Claude Opus 4.8 (fast mode)',
    provider: 'Anthropic',
    tier: 'Pro+',
    contextWindow: 200000,
    description: 'Fast mode for quick responses',
    maxTokens: 4096,
    costPer1kInput: 0.0015,
    costPer1kOutput: 0.0075,
    enabled: true,
    fastMode: true
  },

  'claude-opus-4-8': {
    name: 'Claude Opus 4.8',
    provider: 'Anthropic',
    tier: 'Pro+',
    contextWindow: 200000,
    description: 'Advanced model for complex reasoning and analysis',
    maxTokens: 4096,
    costPer1kInput: 0.003,
    costPer1kOutput: 0.015,
    enabled: true,
    fastMode: false
  },

  'claude-opus-4-7': {
    name: 'Claude Opus 4.7',
    provider: 'Anthropic',
    tier: 'Pro+',
    contextWindow: 200000,
    description: 'Previous generation Opus model',
    maxTokens: 4096,
    costPer1kInput: 0.003,
    costPer1kOutput: 0.015,
    enabled: true,
    fastMode: false
  },

  'claude-opus-4-6': {
    name: 'Claude Opus 4.6',
    provider: 'Anthropic',
    tier: 'Max',
    contextWindow: 200000,
    description: 'Enterprise model with extended context',
    maxTokens: 4096,
    costPer1kInput: 0.006,
    costPer1kOutput: 0.030,
    enabled: true,
    fastMode: false
  },

  'claude-haiku-3': {
    name: 'Claude Haiku 3',
    provider: 'Anthropic',
    tier: 'Free',
    contextWindow: 200000,
    description: 'Fast and compact model',
    maxTokens: 1024,
    costPer1kInput: 0.00025,
    costPer1kOutput: 0.00125,
    enabled: true,
    fastMode: false
  },

  'claude-sonnet-4': {
    name: 'Claude Sonnet 4',
    provider: 'Anthropic',
    tier: 'Standard',
    contextWindow: 200000,
    description: 'Balanced performance and speed',
    maxTokens: 4096,
    costPer1kInput: 0.003,
    costPer1kOutput: 0.015,
    enabled: true,
    fastMode: false
  }
};

/**
 * Get all available models
 */
function getAllModels() {
  return MODELS;
}

/**
 * Get enabled models only
 */
function getEnabledModels() {
  return Object.values(MODELS).filter(model => model.enabled);
}

/**
 * Get model by ID
 */
function getModelById(modelId) {
  return MODELS[modelId] || null;
}

/**
 * Get default model
 */
function getDefaultModel() {
  return MODELS['claude-opus-4-8'];
}

/**
 * Validate if model exists and is enabled
 */
function isValidModel(modelId) {
  const model = MODELS[modelId];
  return model && model.enabled;
}

module.exports = {
  MODELS,
  getAllModels,
  getEnabledModels,
  getModelById,
  getDefaultModel,
  isValidModel
};
