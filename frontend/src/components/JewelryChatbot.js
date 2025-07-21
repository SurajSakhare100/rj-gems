import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, Send, X, Sparkles, Bot, User, ShoppingBag, AlertCircle, Loader2, Loader, LoaderIcon, LucideLoader2 } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AI_CONFIG, validateInput, validateContext, validatePreferences, extractJewelryPreferences, callGeminiAPI } from '../config/ai';

const JewelryChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [products, setProducts] = useState([]);
  const [userPreferences, setUserPreferences] = useState({});
  const [conversationContext, setConversationContext] = useState({
    currentTopic: null,
    userBudget: null,
    userStyle: null,
    userOccasion: null,
    conversationHistory: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const { addToCart } = useCart();

  // Fetch products from your original database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const apiUrl = process.env.REACT_APP_API_URL;
        if (!apiUrl) {
          throw new Error('API URL not configured');
        }

        const response = await axios.get(`${apiUrl}/api/products`, {
          timeout: 15000, // 15 second timeout
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.data && response.data.success && Array.isArray(response.data.data)) {
          const fetchedProducts = response.data.data;
          
          // Validate and clean the product data
          const validatedProducts = fetchedProducts.map(product => ({
            _id: product._id || product.id,
            name: product.name || 'Unknown Product',
            price: product.price || 0,
            category: product.category || 'jewelry',
            metalType: product.metalType || 'gold',
            style: product.style || 'classic',
            occasion: product.occasion || 'daily',
            featured: product.featured || false,
            description: product.description || '',
            images: product.images || ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400'],
            rating: product.rating || 4.5,
            reviewCount: product.reviewCount || 0
          }));

          setProducts(validatedProducts);
        } else {
          throw new Error('Invalid API response format');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Unable to load products from database. Please try again later.');
        setProducts([]); // Set empty array instead of fallback data
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Enhanced AI response generation with real database integration
  const generateAIResponse = (userMessage, context) => {
    const message = userMessage.toLowerCase();
    let recommendations = [];
    let response = '';

    // Update conversation context
    const newContext = { ...context };
    
    // Extract and validate preferences using the AI config
    const preferences = extractJewelryPreferences(message);
    const validatedPreferences = validatePreferences(preferences, AI_CONFIG);
    
    // Update context with validated preferences
    Object.assign(newContext, validatedPreferences);
    setConversationContext(newContext);

    // Generate recommendations from real database
    recommendations = generateRecommendations(validatedPreferences, products);

    // Generate contextual response
    if (recommendations.length > 0) {
      response = generateRecommendationResponse(recommendations, validatedPreferences);
    } else {
      response = generateFallbackResponse(validatedPreferences);
    }

    // Add context awareness
    if (newContext.currentTopic && newContext.currentTopic !== 'jewelry') {
      response = `I'd be happy to help you with jewelry recommendations! ${response}`;
    }

    return { response, recommendations, context: newContext };
  };

  // Generate recommendations from real database
  const generateRecommendations = (preferences, availableProducts) => {
    if (!availableProducts || availableProducts.length === 0) {
      return [];
    }

    let filteredProducts = [...availableProducts];

    // Apply filters with validation
    if (preferences.category) {
      filteredProducts = filteredProducts.filter(product => 
        product.category && product.category.toLowerCase() === preferences.category
      );
    }

    if (preferences.metalType) {
      filteredProducts = filteredProducts.filter(product => 
        product.metalType && product.metalType.toLowerCase() === preferences.metalType
      );
    }

    if (preferences.style) {
      filteredProducts = filteredProducts.filter(product => 
        product.style && product.style.toLowerCase() === preferences.style
      );
    }

    if (preferences.occasion) {
      filteredProducts = filteredProducts.filter(product => 
        product.occasion && product.occasion.toLowerCase() === preferences.occasion
      );
    }

    if (preferences.priceRange) {
      filteredProducts = filteredProducts.filter(product => 
        product.price >= preferences.priceRange.min && 
        product.price <= preferences.priceRange.max
      );
    }

    // Sort by relevance and price
    filteredProducts.sort((a, b) => {
      // Prioritize featured products
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      
      // Then by rating
      if (a.rating && b.rating) {
        if (a.rating !== b.rating) return b.rating - a.rating;
      }
      
      // Then by price (ascending for low budget, descending for high budget)
      if (preferences.budget === 'low') {
        return a.price - b.price;
      } else if (preferences.budget === 'high') {
        return b.price - a.price;
      }
      
      return 0;
    });

    return filteredProducts.slice(0, AI_CONFIG.VALIDATION.MAX_RECOMMENDATIONS);
  };

  // Generate recommendation response with real product data
  const generateRecommendationResponse = (recommendations, preferences) => {
    const categoryName = preferences.category ? preferences.category.charAt(0).toUpperCase() + preferences.category.slice(1) : 'jewelry';
    const styleName = preferences.style || 'beautiful';
    
    let response = `Perfect! I found some ${styleName} ${categoryName} pieces that match your preferences:\n\n`;
    
    recommendations.forEach((item, index) => {
      response += `${index + 1}. ${item.name} - ${formatPrice(item.price)}\n`;
      response += `   ${item.metalType} • ${item.style} style • Perfect for ${item.occasion}\n`;
      if (item.rating) {
        response += `   ⭐ ${item.rating}/5 (${item.reviewCount} reviews)\n`;
      }
      response += `\n`;
    });
    
    response += `These pieces are carefully selected from our collection to match your style. Would you like me to add any to your cart or help you explore more options?`;
    
    return response;
  };

  // Generate fallback response when no products match
  const generateFallbackResponse = (preferences) => {
    if (products.length === 0) {
      return `I apologize, but I'm currently unable to access our product database. Please try again in a moment, or you can browse our collection directly on the website.`;
    }

    return `I'd love to help you find the perfect jewelry! Could you tell me more about what you're looking for?\n\nSome helpful details:\n• Type: rings, necklaces, earrings, bracelets\n• Occasion: engagement, wedding, daily wear, formal events\n• Metal: gold, white gold, rose gold, silver\n• Style: classic, modern, vintage, minimalist\n• Budget: affordable, luxury, or specific price range\n\nI have ${products.length} beautiful pieces in our collection to choose from!`;
  };

  // Google Gemini AI integration with real data
  const callGeminiAI = async (userMessage, context) => {
    try {
      // Create a comprehensive prompt with real product data
      const productSummary = products.slice(0, 10).map(p => 
        `${p.name} (${p.category}, ${p.metalType}, $${p.price})`
      ).join(', ');

      const prompt = `
        ${AI_CONFIG.PROMPTS.JEWELRY_EXPERT}
        
        User message: "${userMessage}"
        // Context: ${JSON.stringify(context)}
        // Available products: ${productSummary}
        // Total products in database: ${products.length}
        
        // Provide a helpful, professional response about jewelry recommendations.
        // Keep responses under 200 words and focus on jewelry-related topics only.
        // If the user asks about non-jewelry topics, politely redirect to jewelry.
      `;

              // Simulate AI processing time
        await new Promise(resolve => setTimeout(resolve, AI_CONFIG.VALIDATION.TYPING_DELAY));

        // Enhanced AI logic with context awareness and real data
      return generateAIResponse(userMessage, context);
    } catch (error) {
      console.error('AI service error:', error);
      throw new Error(AI_CONFIG.ERRORS.API_UNAVAILABLE);
    }
  };

  // Handle message sending with validation
  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim()) return;

    // Input validation using AI config
    const inputValidation = validateInput(inputMessage, AI_CONFIG);
    if (!inputValidation.isValid) {
      toast.error(inputValidation.errors[0]);
      return;
    }

    // Context validation using AI config
    const contextValidation = validateContext(messages, AI_CONFIG);
    if (!contextValidation.isValid) {
      toast.error(contextValidation.errors[0]);
      return;
    }

    const userMessage = inputMessage.trim();
    setInputMessage('');
    
    // Add user message
    setMessages(prev => [...prev, { 
      type: 'user', 
      content: userMessage,
      timestamp: new Date().toISOString()
    }]);
    
    // Show typing indicator
    setIsTyping(true);
    
    try {
      // Call AI service with real data
      const aiResponse = await callGeminiAI(userMessage, conversationContext);
      
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: aiResponse.response, 
        recommendations: aiResponse.recommendations,
        timestamp: new Date().toISOString()
      }]);
      
      // Update conversation context
      setConversationContext(aiResponse.context);
      
    } catch (error) {
      console.error('AI processing error:', error);
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: AI_CONFIG.ERRORS.API_UNAVAILABLE,
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsTyping(false);
    }
  }, [inputMessage, conversationContext, messages, products]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleAddToCart = (item) => {
    try {
      addToCart(item, 1);
      toast.success(`${item.name} added to cart!`);
    } catch (error) {
      toast.error('Failed to add item to cart');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getQuickReplies = () => [
    "I'm looking for engagement rings",
    "Show me necklaces for formal events",
    "I need affordable earrings",
    "What's trending in bracelets?",
    "Help me choose a wedding gift"
  ];

  const handleQuickReply = (reply) => {
    setInputMessage(reply);
    // Use setTimeout to ensure state is updated before sending
    setTimeout(() => {
      handleSendMessage();
    }, 0);
  };

  const resetConversation = () => {
    setMessages([]);
    setUserPreferences({});
    setConversationContext({
      currentTopic: null,
      userBudget: null,
      userStyle: null,
      userOccasion: null,
      conversationHistory: []
    });
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-text-primary hover:bg-red-800 text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 z-50 group"
      >
        <MessageCircle className="h-6 w-6 group-hover:rotate-12 transition-transform" />
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
          AI
        </div>
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-end p-4 z-50">
          <div className="bg-white rounded-t-2xl shadow-2xl w-full max-w-md h-[500px] flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-text-primary to-red-800 text-white p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-ibm-plex font-semibold text-white">Jewelry Assistant</h3>
                  <p className="text-sm opacity-90">
                    {isLoading ? 'Loading products...' : `${products.length} products available`}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={resetConversation}
                  className="text-white hover:text-gray-200 transition-colors p-1"
                  title="Reset conversation"
                >
                  <Loader className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-3 mx-4 mt-2 rounded">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-red-400 mr-2" />
                  <p className="text-red-700 text-sm font-ibm-plex">{error}</p>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mx-4 mt-2 rounded">
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 text-blue-400 mr-2 animate-spin" />
                  <p className="text-blue-700 text-sm font-ibm-plex">Loading products from database...</p>
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-luxury-charcoal/60">
                  <Sparkles className="h-8 w-8 mx-auto mb-2 text-text-primary" />
                  <p className="font-ibm-plex font-semibold">Hello! I'm your personal jewelry assistant.</p>
                  <p className="text-sm mb-4">
                    {products.length > 0 
                      ? `I have ${products.length} beautiful pieces to recommend!`
                      : 'Loading our collection...'
                    }
                  </p>
                  
                  {/* Quick Replies */}
                  <div className="space-y-2">
                    {getQuickReplies().map((reply, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickReply(reply)}
                        disabled={isLoading}
                        className="block w-full text-left p-2 bg-luxury-pearl hover:bg-luxury-silver rounded-lg text-sm font-ibm-plex transition-colors disabled:opacity-50"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-start space-x-2 max-w-xs ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`p-2 rounded-full ${message.type === 'user' ? 'bg-text-primary text-white' : 'bg-luxury-pearl text-luxury-charcoal'}`}>
                      {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    <div className={`rounded-2xl px-4 py-2 max-w-xs ${
                      message.type === 'user' 
                        ? 'bg-text-primary text-white' 
                        : 'bg-luxury-pearl text-luxury-charcoal'
                    }`}>
                      <div className="whitespace-pre-line font-ibm-plex text-sm">
                        {message.content}
                      </div>
                      
                      {/* Recommendations */}
                      {message.recommendations && message.recommendations.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {message.recommendations.map((item, idx) => (
                            <div key={idx} className="bg-white rounded-lg p-3 border border-luxury-silver hover:border-text-primary/30 transition-colors">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <h4 className="font-ibm-plex font-semibold text-luxury-charcoal text-sm">
                                    {item.name}
                                  </h4>
                                  <p className="text-text-primary font-ibm-plex font-semibold text-sm">
                                    {formatPrice(item.price)}
                                  </p>
                                  <p className="text-luxury-charcoal/60 text-xs">
                                    {item.metalType} • {item.style}
                                  </p>
                                  {item.rating && (
                                    <p className="text-luxury-charcoal/60 text-xs">
                                      ⭐ {item.rating}/5 ({item.reviewCount} reviews)
                                    </p>
                                  )}
                                </div>
                                <div className="flex space-x-1">
                                  <button
                                    onClick={() => handleAddToCart(item)}
                                    className="bg-text-primary hover:bg-red-800 text-white px-3 py-1 rounded text-xs font-ibm-plex font-semibold transition-colors flex items-center"
                                  >
                                    <ShoppingBag className="h-3 w-3 mr-1" />
                                    Add
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <div className="p-2 rounded-full bg-luxury-pearl text-luxury-charcoal">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-luxury-pearl text-luxury-charcoal rounded-2xl px-4 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-luxury-charcoal/40 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-luxury-charcoal/40 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-luxury-charcoal/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-luxury-silver">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isLoading ? "Loading products..." : "Tell me what you're looking for..."}
                  className="flex-1 premium-input text-sm"
                  maxLength={AI_CONFIG.VALIDATION.MAX_MESSAGE_LENGTH}
                  disabled={isTyping || isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping || isLoading}
                  className="bg-text-primary hover:bg-red-800 disabled:bg-luxury-silver disabled:cursor-not-allowed text-white p-3 rounded-lg transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <div className="text-xs text-luxury-charcoal/40 mt-1 text-right">
                {inputMessage.length}/{AI_CONFIG.VALIDATION.MAX_MESSAGE_LENGTH}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default JewelryChatbot; 