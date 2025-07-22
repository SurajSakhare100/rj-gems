import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

// Chatbot configuration (using free tier)
export const chatbotConfig = {
  model: 'gemini-1.5-flash',
  temperature: 0.7,
  maxTokens: 1000,
  topP: 0.8,
  topK: 40,
};

// Initialize the model
export const getModel = () => {
  return genAI.getGenerativeModel({ 
    model: chatbotConfig.model,
    generationConfig: {
      temperature: chatbotConfig.temperature,
      maxOutputTokens: chatbotConfig.maxTokens,
      topP: chatbotConfig.topP,
      topK: chatbotConfig.topK,
    },
  });
};

// API endpoints
export const API_ENDPOINTS = {
  CHAT: '/api/chatbot/chat',
  SEARCH: '/api/chatbot/search',
  RECOMMENDATIONS: '/api/chatbot/recommendations',
};

// Base API URL
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Chatbot system prompt
export const SYSTEM_PROMPT = `You are a helpful AI assistant for a luxury jewelry e-commerce store. You can help customers with:

1. Product recommendations based on preferences, budget, and occasions
2. Jewelry care and maintenance advice
3. Information about different metals, stones, and jewelry types
4. Sizing and fitting guidance
5. Gift suggestions for different occasions
6. Answering questions about our products and services

Always be helpful, professional, and provide accurate information about jewelry. Keep responses concise but informative.`;

// Quick response templates
export const QUICK_RESPONSES = [
  "Show me luxury engagement rings",
  "I need a special gift for my anniversary",
  "What's the best metal for everyday wear?",
  "How do I care for gold jewelry?",
  "Recommend something under $1000",
];

// Product categories for quick filtering
export const PRODUCT_CATEGORIES = [
  { value: 'rings', label: 'Rings' },
  { value: 'necklaces', label: 'Necklaces' },
  { value: 'earrings', label: 'Earrings' },
  { value: 'bracelets', label: 'Bracelets' },
];

// Metal types for filtering
export const METAL_TYPES = [
  { value: '14k Gold', label: '14k Gold' },
  { value: 'Sterling Silver', label: 'Sterling Silver' },
  { value: 'Rose Gold', label: 'Rose Gold' },
  { value: 'White Gold', label: 'White Gold' },
  { value: 'Platinum', label: 'Platinum' },
];

// Occasions for recommendations
export const OCCASIONS = [
  { value: 'engagement', label: 'Engagement' },
  { value: 'wedding', label: 'Wedding' },
  { value: 'anniversary', label: 'Anniversary' },
  { value: 'birthday', label: 'Birthday' },
  { value: 'everyday', label: 'Everyday Wear' },
  { value: 'gift', label: 'Gift' },
];

const aiConfig = {
  getModel,
  chatbotConfig,
  API_ENDPOINTS,
  API_BASE_URL,
  SYSTEM_PROMPT,
  QUICK_RESPONSES,
  PRODUCT_CATEGORIES,
  METAL_TYPES,
  OCCASIONS,
};

export default aiConfig;
