import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, Send, X, Bot, User, Sparkles, ExternalLink, Star } from 'lucide-react';
import { API_BASE_URL, API_ENDPOINTS, QUICK_RESPONSES } from '../config/ai';
import toast from 'react-hot-toast';

const JewelryChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickResponses, setShowQuickResponses] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);



  // Handle sending message
  const handleSendMessage = async (message = inputMessage) => {
    if (!message.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: message,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setShowQuickResponses(false);

    try {
      const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.CHAT}`, {
        message: message,
        conversationHistory: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      });

      if (response.data.success) {
        const assistantMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: response.data.response,
          timestamp: new Date(),
          type: 'text',
          products: response.data.products || null
        };

        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(response.data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Sorry, I encountered an error. Please try again.');
      
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
        type: 'error'
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle quick response click
  const handleQuickResponse = (response) => {
    handleSendMessage(response);
  };



  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage();
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Clear conversation
  const clearConversation = () => {
    setMessages([]);
    setShowQuickResponses(true);
  };

  // Render message content
  const renderMessageContent = (message) => {
    if (message.type === 'products' && message.products) {
      return (
        <div className="space-y-3">
          <p className="text-black font-medium">{message.content}</p>
          <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto">
            {message.products.map((product) => (
              <div key={product.id} className="bg-white border border-luxury-silver rounded-lg p-3 hover:border-text-primary/30 transition-all duration-300 premium-shadow">
                <div className="flex items-center space-x-3">
                  {product.images && product.images[0] && (
                    <div className="relative">
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg border border-luxury-silver"
                      />
                      {product.featured && (
                        <div className="absolute -top-1 -right-1 bg-text-primary text-white text-xs px-1 py-0.5 rounded-full">
                          <Sparkles className="w-2 h-2" />
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-fraunces text-sm font-medium text-text-primary mb-1 truncate">{product.name}</h4>
                    <p className="text-xs text-luxury-charcoal/70 mb-1">
                      {product.category} • {product.metalType}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-fraunces font-medium text-text-primary">
                        ${product.price.toLocaleString()}
                      </span>
                      {product.rating > 0 && (
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-luxury-charcoal/70">{product.rating}</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-2 flex items-center space-x-2">
                      <a
                        href={`/product/${product.id}`}
                        className="btn-primary text-xs px-3 py-1 flex items-center space-x-1"
                      >
                        <span>View</span>
                        <ExternalLink className="w-2 h-2" />
                      </a>
                      {product.stock > 0 ? (
                        <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                          ✓
                        </span>
                      ) : (
                        <span className="text-xs text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full">
                          ✗
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className={`whitespace-pre-wrap ${message.role === 'user' ? 'text-white' : 'text-black'} text-md`}>
        {message.content}
      </div>
    );
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-text-primary hover:bg-red-800 text-white rounded-full p-4 premium-shadow-lg transition-all duration-300 z-50 group"
          aria-label="Open chatbot"
        >
          <Sparkles size={24} className="group-hover:animate-pulse" />
        </button>
      )}

      {/* Chatbot Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-end justify-end p-4">
          <div className="bg-white rounded-lg premium-shadow-xl w-full max-w-md h-[600px] flex flex-col border border-luxury-silver">
            {/* Header */}
            <div className="bg-gradient-to-r from-text-primary to-red-800 text-white p-4 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles size={20} />
                <h3 className="font-fraunces font-medium text-lg">Luxury Jewelry AI</h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={clearConversation}
                  className="text-white hover:text-primary-100 text-sm font-medium transition-colors duration-300"
                >
                  Clear
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-primary-100 transition-colors duration-300"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-luxury-pearl">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-text-primary to-red-800 text-white'
                        : 'bg-white text-black border border-luxury-silver'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.role === 'assistant' && (
                        <Sparkles size={16} className="mt-1 flex-shrink-0 text-text-primary" />
                      )}
                      {message.role === 'user' && (
                        <User size={16} className="mt-1 flex-shrink-0 text-white" />
                      )}
                      <div className="flex-1">
                        {renderMessageContent(message)}
                      </div>
                    </div>
                    <div className={`text-xs mt-2 ${
                      message.role === 'user' ? 'text-white/80' : 'text-black'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-luxury-silver rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Sparkles size={16} className="text-text-primary animate-pulse" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-text-primary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-text-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-text-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Responses */}
            {showQuickResponses && messages.length === 0 && (
              <div className="p-4 border-t border-luxury-silver bg-white">
                <p className="text-sm text-luxury-charcoal font-medium mb-3">Quick questions:</p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_RESPONSES.map((response, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickResponse(response)}
                      className="text-xs bg-luxury-silver hover:bg-text-primary hover:text-white px-3 py-2 rounded-full transition-all duration-300 font-medium"
                    >
                      {response}
                    </button>
                  ))}
                </div>
              </div>
            )}



            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-luxury-silver bg-white">
              <div className="flex space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about luxury jewelry..."
                  className="flex-1 premium-input text-sm"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-text-primary text-white p-4 rounded-lg hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  <Send size={20} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default JewelryChatbot;
