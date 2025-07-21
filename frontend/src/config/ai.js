// AI Configuration and Validation Rules
export const AI_CONFIG = {
  // Google Gemini API Configuration
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
  
  // Validation Rules
  VALIDATION: {
    MAX_MESSAGE_LENGTH: 500,
    MAX_CONVERSATION_LENGTH: 50,
    MAX_RECOMMENDATIONS: 3,
    TYPING_DELAY: 2000, // milliseconds
    API_TIMEOUT: 10000, // milliseconds
  },
  
  // Allowed Values for Validation
  ALLOWED_VALUES: {
    CATEGORIES: ['rings', 'necklaces', 'earrings', 'bracelets'],
    METALS: ['gold', 'white gold', 'rose gold', 'platinum', 'sterling silver'],
    STYLES: ['classic', 'modern', 'vintage', 'minimalist', 'luxury', 'elegant'],
    OCCASIONS: ['engagement', 'wedding', 'anniversary', 'daily', 'formal', 'casual', 'gift'],
    BUDGETS: ['low', 'medium', 'high'],
  },
  
  // Content Filtering
  CONTENT_FILTER: {
    INAPPROPRIATE_WORDS: ['spam', 'scam', 'hack', 'virus', 'malware', 'phishing'],
    JEWELRY_KEYWORDS: [
      'ring', 'necklace', 'earring', 'bracelet', 'jewelry', 'diamond', 
      'gold', 'silver', 'engagement', 'wedding', 'gem', 'stone', 'precious',
      'luxury', 'fashion', 'accessory', 'ornament', 'adornment'
    ],
    MIN_JEWELRY_CONTEXT_RATIO: 0.3, // 30% of recent messages should be jewelry-related
  },
  
  // AI Prompt Templates
  PROMPTS: {
    JEWELRY_EXPERT: `You are a luxury jewelry expert assistant for RJ Gems. 
    Your role is to help customers find the perfect jewelry pieces.
    
    Guidelines:
    - Keep responses under 200 words
    - Focus only on jewelry-related topics
    - Be professional and helpful
    - If asked about non-jewelry topics, politely redirect to jewelry
    - Use the customer's preferences to make personalized recommendations
    - Always maintain a luxury, premium tone
    
    Available product categories: rings, necklaces, earrings, bracelets
    Available metals: gold, white gold, rose gold, platinum, sterling silver
    Available styles: classic, modern, vintage, minimalist, luxury, elegant
    Available occasions: engagement, wedding, anniversary, daily, formal, casual, gift`,
    
    RECOMMENDATION: `Based on the user's preferences and our available products, 
    provide personalized jewelry recommendations. Consider:
    - Category preference
    - Metal type preference  
    - Style preference
    - Occasion
    - Budget range
    - Previous conversation context`,
    
    CONTEXT_AWARE: `Maintain conversation context and build upon previous interactions.
    Remember user preferences and provide consistent recommendations.
    If the conversation drifts away from jewelry, gently guide it back.`
  },
  
  // Error Messages
  ERRORS: {
    API_UNAVAILABLE: 'AI service temporarily unavailable. Please try again later.',
    INVALID_INPUT: 'Please provide a valid message.',
    TOO_LONG: 'Message too long. Please keep it under 500 characters.',
    INAPPROPRIATE_CONTENT: 'Message contains inappropriate content.',
    CONTEXT_DRIFT: 'Please keep the conversation focused on jewelry recommendations.',
    CONVERSATION_LIMIT: 'Conversation too long. Please start a new conversation.',
    VALIDATION_FAILED: 'Input validation failed. Please check your message.',
  },
  
  // Success Messages
  SUCCESS: {
    PRODUCT_ADDED: 'Product added to cart successfully!',
    RECOMMENDATION_GENERATED: 'Personalized recommendations generated.',
    CONTEXT_UPDATED: 'Preferences updated successfully.',
  }
};

// Validation Functions
export const validateInput = (input, config = AI_CONFIG) => {
  const errors = [];

  // Check for empty or whitespace-only input
  if (!input || !input.trim()) {
    errors.push(config.ERRORS.INVALID_INPUT);
    return { isValid: false, errors };
  }

  // Check message length
  if (input.length > config.VALIDATION.MAX_MESSAGE_LENGTH) {
    errors.push(config.ERRORS.TOO_LONG);
  }

  // Check for inappropriate content
  const lowerInput = input.toLowerCase();
  if (config.CONTENT_FILTER.INAPPROPRIATE_WORDS.some(word => lowerInput.includes(word))) {
    errors.push(config.ERRORS.INAPPROPRIATE_CONTENT);
  }

  // Check for excessive repetition
  const words = input.split(' ');
  const uniqueWords = new Set(words);
  if (words.length > 10 && uniqueWords.size / words.length < 0.3) {
    errors.push('Message contains too much repetition');
  }

  return { isValid: errors.length === 0, errors };
};

export const validateContext = (messages, config = AI_CONFIG) => {
  const errors = [];

  // Check conversation length
  if (messages.length > config.VALIDATION.MAX_CONVERSATION_LENGTH) {
    errors.push(config.ERRORS.CONVERSATION_LIMIT);
  }

  // Check for context drift
  const recentMessages = messages.slice(-5);
  const hasJewelryContext = recentMessages.some(msg => 
    config.CONTENT_FILTER.JEWELRY_KEYWORDS.some(word => 
      msg.content.toLowerCase().includes(word)
    )
  );

  if (messages.length > 10 && !hasJewelryContext) {
    errors.push(config.ERRORS.CONTEXT_DRIFT);
  }

  return { isValid: errors.length === 0, errors };
};

export const validatePreferences = (preferences, config = AI_CONFIG) => {
  const validated = {};

  if (preferences.category && config.ALLOWED_VALUES.CATEGORIES.includes(preferences.category)) {
    validated.category = preferences.category;
  }

  if (preferences.metalType && config.ALLOWED_VALUES.METALS.includes(preferences.metalType)) {
    validated.metalType = preferences.metalType;
  }

  if (preferences.style && config.ALLOWED_VALUES.STYLES.includes(preferences.style)) {
    validated.style = preferences.style;
  }

  if (preferences.occasion && config.ALLOWED_VALUES.OCCASIONS.includes(preferences.occasion)) {
    validated.occasion = preferences.occasion;
  }

  if (preferences.budget && config.ALLOWED_VALUES.BUDGETS.includes(preferences.budget)) {
    validated.budget = preferences.budget;
    validated.priceRange = preferences.priceRange;
  }

  return validated;
};

// Gemini AI API Functions
export const callGeminiAPI = async (prompt, apiKey = AI_CONFIG.GEMINI_API_KEY) => {
  if (!apiKey) {
    throw new Error('Gemini API key not configured');
  }

  try {
    const response = await fetch(AI_CONFIG.GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      }),
      timeout: AI_CONFIG.VALIDATION.API_TIMEOUT
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error(AI_CONFIG.ERRORS.API_UNAVAILABLE);
  }
};

// Utility Functions
export const extractJewelryPreferences = (message) => {
  const preferences = {
    category: null,
    metalType: null,
    style: null,
    occasion: null,
    budget: null,
    priceRange: null
  };

  const lowerMessage = message.toLowerCase();

  // Category extraction
  if (lowerMessage.includes('ring') || lowerMessage.includes('engagement') || lowerMessage.includes('wedding') || lowerMessage.includes('proposal')) {
    preferences.category = 'rings';
  } else if (lowerMessage.includes('necklace') || lowerMessage.includes('pendant') || lowerMessage.includes('chain')) {
    preferences.category = 'necklaces';
  } else if (lowerMessage.includes('earring') || lowerMessage.includes('stud') || lowerMessage.includes('hoop')) {
    preferences.category = 'earrings';
  } else if (lowerMessage.includes('bracelet') || lowerMessage.includes('bangle') || lowerMessage.includes('cuff')) {
    preferences.category = 'bracelets';
  }

  // Metal type extraction
  if (lowerMessage.includes('gold') && !lowerMessage.includes('white') && !lowerMessage.includes('rose')) {
    preferences.metalType = 'gold';
  } else if (lowerMessage.includes('white gold') || lowerMessage.includes('platinum')) {
    preferences.metalType = 'white gold';
  } else if (lowerMessage.includes('rose gold') || lowerMessage.includes('pink gold')) {
    preferences.metalType = 'rose gold';
  } else if (lowerMessage.includes('silver') || lowerMessage.includes('sterling')) {
    preferences.metalType = 'sterling silver';
  }

  // Style extraction
  if (lowerMessage.includes('classic') || lowerMessage.includes('traditional') || lowerMessage.includes('timeless')) {
    preferences.style = 'classic';
  } else if (lowerMessage.includes('modern') || lowerMessage.includes('contemporary') || lowerMessage.includes('trendy')) {
    preferences.style = 'modern';
  } else if (lowerMessage.includes('vintage') || lowerMessage.includes('antique') || lowerMessage.includes('retro')) {
    preferences.style = 'vintage';
  } else if (lowerMessage.includes('minimalist') || lowerMessage.includes('simple') || lowerMessage.includes('clean')) {
    preferences.style = 'minimalist';
  }

  // Occasion extraction
  if (lowerMessage.includes('engagement') || lowerMessage.includes('propose') || lowerMessage.includes('proposal')) {
    preferences.occasion = 'engagement';
  } else if (lowerMessage.includes('wedding') || lowerMessage.includes('marriage') || lowerMessage.includes('ceremony')) {
    preferences.occasion = 'wedding';
  } else if (lowerMessage.includes('anniversary') || lowerMessage.includes('celebration') || lowerMessage.includes('milestone')) {
    preferences.occasion = 'anniversary';
  } else if (lowerMessage.includes('daily') || lowerMessage.includes('everyday') || lowerMessage.includes('casual')) {
    preferences.occasion = 'daily';
  } else if (lowerMessage.includes('formal') || lowerMessage.includes('party') || lowerMessage.includes('event')) {
    preferences.occasion = 'formal';
  }

  // Budget extraction
  if (lowerMessage.includes('budget') || lowerMessage.includes('affordable') || lowerMessage.includes('cheap') || lowerMessage.includes('inexpensive')) {
    preferences.budget = 'low';
    preferences.priceRange = { min: 0, max: 1000 };
  } else if (lowerMessage.includes('luxury') || lowerMessage.includes('premium') || lowerMessage.includes('expensive') || lowerMessage.includes('high-end')) {
    preferences.budget = 'high';
    preferences.priceRange = { min: 1000, max: 10000 };
  } else if (lowerMessage.includes('mid') || lowerMessage.includes('moderate')) {
    preferences.budget = 'medium';
    preferences.priceRange = { min: 500, max: 2000 };
  }

  return preferences;
};

export default AI_CONFIG; 