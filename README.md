[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
# Claude Router API

A powerful Node.js/Express API for routing requests to Claude AI models, with first-class support for **Claude Opus 4.8** and other advanced Claude models.

## Features

✨ **Claude Opus 4.8 Support** - Latest advanced model for complex reasoning  
🚀 **Multiple Model Support** - Access all Claude models from one API  
📊 **Model Management** - List, filter, and query available models  
💬 **Message Routing** - Send, batch, and stream messages  
🔐 **API Key Management** - Secure configuration via environment variables  
🎯 **Model Selection** - Easy model switching for different tasks  
⚡ **Performance Optimized** - Fast responses with streaming support  

## Supported Models

### Available Models

| Model ID | Name | Tier | Context | Fast Mode |
|----------|------|------|---------|----------|
| `claude-opus-5` | Claude Opus 5 | Pro+ | 200K | ❌ |
| `claude-opus-4-8` | Claude Opus 4.8 | Pro+ | 200K | ❌ |
| `claude-opus-4-8-fast` | Claude Opus 4.8 (fast) | Pro+ | 200K | ✅ |
| `claude-opus-4-7` | Claude Opus 4.7 | Pro+ | 200K | ❌ |
| `claude-opus-4-6` | Claude Opus 4.6 | Max | 200K | ❌ |
| `claude-haiku-3` | Claude Haiku 3 | Free | 200K | ❌ |
| `claude-sonnet-4` | Claude Sonnet 4 | Standard | 200K | ❌ |

## Installation

### Prerequisites
- Node.js 14+ 
- npm or yarn
- Claude API Key from [Anthropic](https://www.anthropic.com)

### Setup

```bash
# Clone the repository
git clone https://github.com/mksunandmoon01-glitch/claude-router-api.git
cd claude-router-api

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Add your Claude API key to .env
# CLAUDE_API_KEY=your_api_key_here

# Start the server
npm start

# For development with auto-reload
npm run dev
```

## API Documentation

### Base URL
```
http://localhost:3000/api
```

### Endpoints

#### 1. Health Check
```
GET /health
```
**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "apiVersion": "1.0.0"
}
```

#### 2. List All Models
```
GET /api/models
```
**Response:**
```json
{
  "success": true,
  "total": 7,
  "models": [
    {
      "id": "claude-opus-4-8",
      "name": "Claude Opus 4.8",
      "tier": "Pro+",
      "contextWindow": 200000,
      "enabled": true,
      "fastMode": false
    },
    ...
  ]
}
```

#### 3. List Enabled Models
```
GET /api/models/enabled
```
**Response:**
```json
{
  "success": true,
  "total": 7,
  "models": [...]
}
```

#### 4. Get Model Details
```
GET /api/models/:modelId
```
**Example:**
```
GET /api/models/claude-opus-4-8
```
**Response:**
```json
{
  "success": true,
  "id": "claude-opus-4-8",
  "name": "Claude Opus 4.8",
  "provider": "Anthropic",
  "tier": "Pro+",
  "contextWindow": 200000,
  "description": "Advanced model for complex reasoning and analysis",
  "enabled": true
}
```

#### 5. Send Message
```
POST /api/messages/send
```
**Request Body:**
```json
{
  "modelId": "claude-opus-4-8",
  "message": "What is machine learning?",
  "systemPrompt": "You are a helpful AI assistant.",
  "options": {
    "temperature": 0.7,
    "maxTokens": 2048
  }
}
```
**Response:**
```json
{
  "success": true,
  "model": "claude-opus-4-8",
  "message": "Machine learning is...",
  "usage": {
    "input_tokens": 50,
    "output_tokens": 150
  },
  "stopReason": "end_turn"
}
```

#### 6. Batch Messages
```
POST /api/messages/batch
```
**Request Body:**
```json
{
  "modelId": "claude-opus-4-8",
  "messages": [
    "What is AI?",
    "Explain machine learning",
    "What is deep learning?"
  ],
  "systemPrompt": "You are a helpful assistant."
}
```
**Response:**
```json
{
  "success": true,
  "results": [
    {"success": true, "message": "..."},
    {"success": true, "message": "..."},
    {"success": true, "message": "..."}
  ],
  "totalProcessed": 3
}
```

#### 7. Stream Message
```
POST /api/messages/stream
```
**Request Body:**
```json
{
  "modelId": "claude-opus-4-8",
  "message": "Write a short story about AI"
}
```
**Response:** Server-Sent Events stream

#### 8. Filter Models by Tier
```
GET /api/models/by-tier/:tier
```
**Example:**
```
GET /api/models/by-tier/Pro+
```

## Usage Examples

### JavaScript/Node.js

```javascript
const axios = require('axios');

const API_URL = 'http://localhost:3000/api';

// Send a message to Claude Opus 4.8
async function sendMessage() {
  try {
    const response = await axios.post(`${API_URL}/messages/send`, {
      modelId: 'claude-opus-4-8',
      message: 'Hello Claude! What can you do?',
      options: {
        temperature: 0.5
      }
    });
    console.log(response.data.message);
  } catch (error) {
    console.error('Error:', error.response.data);
  }
}

// List all models
async function listModels() {
  try {
    const response = await axios.get(`${API_URL}/models`);
    response.data.models.forEach(model => {
      console.log(`${model.id} - ${model.name} (${model.tier})`);
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

sendMessage();
listModels();
```

### cURL

```bash
# List all models
curl http://localhost:3000/api/models

# Get Claude Opus 4.8 details
curl http://localhost:3000/api/models/claude-opus-4-8

# Send a message
curl -X POST http://localhost:3000/api/messages/send \
  -H "Content-Type: application/json" \
  -d '{
    "modelId": "claude-opus-4-8",
    "message": "What is the capital of France?"
  }'

# List enabled models
curl http://localhost:3000/api/models/enabled
```

## Configuration

### Environment Variables

```env
# Claude API Configuration
CLAUDE_API_KEY=your_claude_api_key_here
CLAUDE_API_BASE_URL=https://api.anthropic.com/v1

# Server Configuration
PORT=3000
NODE_ENV=development

# Model Configuration
DEFAULT_MODEL=claude-opus-4-8
```

## Project Structure

```
claude-router-api/
├── server.js                 # Main Express server
├── package.json             # Project dependencies
├── .env.example             # Environment template
├── .gitignore              # Git ignore rules
├── models/
│   └── modelConfig.js       # Model definitions & utilities
├── services/
│   └── claudeService.js     # Claude API service
└── routes/
    ├── models.js            # Model management routes
    └── messages.js          # Message routing endpoints
```

## Error Handling

The API returns standardized error responses:

```json
{
  "success": false,
  "error": "Invalid or disabled model: claude-opus-4-9"
}
```

Common error codes:
- `400` - Bad request (missing fields, invalid model)
- `404` - Not found (model doesn't exist)
- `500` - Server error

## Development

### Running Tests
```bash
npm test
```

### Code Style
```bash
npm run lint
```

### Building for Production
```bash
npm run build
```

## Performance Tips

1. **Use Claude Opus 4.8 Fast Mode** for quick responses: `claude-opus-4-8-fast`
2. **Stream long responses** using `/api/messages/stream`
3. **Batch similar requests** with `/api/messages/batch`
4. **Cache model information** locally to reduce API calls
5. **Set appropriate temperature** (0-1) for your use case

## API Rate Limits

The API respects Anthropic's rate limits. For current limits, check the [Anthropic documentation](https://docs.anthropic.com).

## Security Notes

- Never commit `.env` files with API keys
- Use environment variables for all sensitive configuration
- Validate and sanitize all user inputs
- Use HTTPS in production
- Implement rate limiting for production deployments

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

- 📖 [Anthropic Documentation](https://docs.anthropic.com)
- 🐛 [Report Issues](https://github.com/mksunandmoon01-glitch/claude-router-api/issues)
- 💬 [Discussions](https://github.com/mksunandmoon01-glitch/claude-router-api/discussions)

## Changelog

### Version 1.0.0
- ✅ Initial release
- ✅ Claude Opus 4.8 support
- ✅ Model selection API
- ✅ Message routing
- ✅ Batch processing
- ✅ Stream support

---

**Built with ❤️ for AI enthusiasts**
