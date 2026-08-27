/**
 * Claude AI Service
 * Handles communication with Claude API
 */

const axios = require('axios');
const { getModelById, isValidModel } = require('../models/modelConfig');

class ClaudeService {
  constructor(apiKey, baseUrl) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl || 'https://api.anthropic.com/v1';
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      }
    });
  }

  /**
   * Send a message to Claude
   */
  async sendMessage(modelId, message, systemPrompt = null, options = {}) {
    try {
      // Validate model
      if (!isValidModel(modelId)) {
        throw new Error(`Invalid or disabled model: ${modelId}`);
      }

      const model = getModelById(modelId);
      const maxTokens = options.maxTokens || model.maxTokens;

      const payload = {
        model: modelId,
        max_tokens: maxTokens,
        messages: [
          {
            role: 'user',
            content: message
          }
        ]
      };

      // Add system prompt if provided
      if (systemPrompt) {
        payload.system = systemPrompt;
      }

      // Add optional parameters
      if (options.temperature !== undefined) {
        payload.temperature = options.temperature;
      }
      if (options.topP !== undefined) {
        payload.top_p = options.topP;
      }
      if (options.topK !== undefined) {
        payload.top_k = options.topK;
      }

      const response = await this.client.post('/messages', payload);

      return {
        success: true,
        model: modelId,
        message: response.data.content[0].text,
        usage: response.data.usage,
        stopReason: response.data.stop_reason
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        details: error.response?.data || null
      };
    }
  }

  /**
   * Send a streaming message to Claude
   */
  async sendMessageStream(modelId, message, systemPrompt = null, options = {}) {
    try {
      if (!isValidModel(modelId)) {
        throw new Error(`Invalid or disabled model: ${modelId}`);
      }

      const model = getModelById(modelId);
      const maxTokens = options.maxTokens || model.maxTokens;

      const payload = {
        model: modelId,
        max_tokens: maxTokens,
        stream: true,
        messages: [
          {
            role: 'user',
            content: message
          }
        ]
      };

      if (systemPrompt) {
        payload.system = systemPrompt;
      }

      if (options.temperature !== undefined) {
        payload.temperature = options.temperature;
      }

      return await this.client.post('/messages', payload, {
        responseType: 'stream'
      });
    } catch (error) {
      throw new Error(`Streaming error: ${error.message}`);
    }
  }

  /**
   * Batch process multiple messages
   */
  async batchMessages(modelId, messages, systemPrompt = null, options = {}) {
    try {
      if (!isValidModel(modelId)) {
        throw new Error(`Invalid or disabled model: ${modelId}`);
      }

      const results = [];
      for (const message of messages) {
        const result = await this.sendMessage(modelId, message, systemPrompt, options);
        results.push(result);
      }

      return {
        success: true,
        results,
        totalProcessed: results.length
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get model information
   */
  getModelInfo(modelId) {
    const model = getModelById(modelId);
    if (!model) {
      return null;
    }
    return {
      ...model,
      id: modelId,
      enabled: isValidModel(modelId)
    };
  }
}

module.exports = ClaudeService;
