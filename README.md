# Jewelry E-commerce Platform with AI Chatbot

A modern jewelry e-commerce platform featuring an AI-powered chatbot with database access using Google Gemini AI.

## 🚀 Features

- **AI Chatbot**: Powered by Google Gemini AI with database access
- **Product Management**: Full CRUD operations for jewelry products
- **Smart Recommendations**: AI-driven product suggestions
- **Real-time Search**: Database-powered product search with filters
- **Modern UI**: Built with React, Tailwind CSS, and Lucide icons
- **Responsive Design**: Mobile-first approach
- **Shopping Cart**: Persistent cart functionality

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Google Gemini AI** for chatbot functionality
- **CORS** and security middleware

### Frontend
- **React 19** with modern hooks
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Hot Toast** for notifications
- **Axios** for API calls

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud)
- Google Gemini API key

## 🔧 Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd demo
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:
```bash
cp env.example .env
```

Update the `.env` file with your configuration:
```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/jewelry-store

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Google Gemini AI API Key
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file:
```bash
cp env.example .env.local
```

Update the `.env.local` file:
```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000

# Google Gemini AI API Key
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here

# Environment
REACT_APP_ENV=development
```

### 4. Get Google Gemini API Key (Free)

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key (free tier)
4. Copy the key and add it to both `.env` files
5. The chatbot uses the free `gemini-1.5-flash` model

### 5. Database Setup

Start MongoDB (if using local):
```bash
# macOS with Homebrew
brew services start mongodb-community

# Windows
net start MongoDB

# Linux
sudo systemctl start mongod
```

Or use MongoDB Atlas (cloud):
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a cluster
3. Get your connection string
4. Update `MONGODB_URI` in backend `.env`

### 6. Seed the Database

```bash
cd backend
npm run seed
```

### 7. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🤖 Chatbot Features

### AI-Powered Conversations
- Natural language processing with Gemini AI
- Context-aware responses
- Conversation history tracking

### Database Integration
- Real-time product search
- Smart product recommendations
- Filter-based queries

### User Experience
- Quick response buttons
- Product filtering options
- Real-time product display
- Loading states and error handling

### Supported Queries
- Product recommendations
- Jewelry care advice
- Metal and stone information
- Sizing guidance
- Gift suggestions
- Price inquiries

## 📁 Project Structure

```
demo/
├── backend/
│   ├── routes/
│   │   ├── chatbot.js      # AI chatbot endpoints
│   │   ├── products.js     # Product management
│   │   └── cart.js         # Shopping cart
│   ├── models/
│   │   └── Product.js      # Product schema
│   ├── data/
│   │   └── seedData.js     # Database seeding
│   └── server.js           # Express server
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── JewelryChatbot.js  # Main chatbot component
│   │   ├── config/
│   │   │   └── ai.js       # AI configuration
│   │   └── App.js          # Main app component
│   └── package.json
└── README.md
```

## 🔌 API Endpoints

### Chatbot Endpoints
- `POST /api/chatbot/chat` - Send message to AI chatbot
- `GET /api/chatbot/search` - Search products with filters
- `POST /api/chatbot/recommendations` - Get AI recommendations

### Product Endpoints
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get specific product
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Cart Endpoints
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove item from cart

## 🎯 Usage Examples

### Chatbot Interactions

1. **Product Search**: "Show me engagement rings under $1000"
2. **Care Advice**: "How do I clean gold jewelry?"
3. **Recommendations**: "I need a gift for my anniversary"
4. **Technical Questions**: "What's the difference between 14k and 18k gold?"

### Filter Usage
- Category: Rings, Necklaces, Earrings, Bracelets
- Metal Type: 14k Gold, Sterling Silver, Rose Gold, White Gold, Platinum
- Price Range: Min/Max price filters
- Occasion: Engagement, Wedding, Anniversary, Birthday, Everyday

## 🔒 Security Features

- CORS protection
- Rate limiting
- Input validation
- Error handling
- Environment variable protection

## 🚀 Deployment

### Backend Deployment (Vercel/Heroku)
1. Set environment variables
2. Deploy to your preferred platform
3. Update frontend API URL

### Frontend Deployment (Vercel/Netlify)
1. Set environment variables
2. Build and deploy
3. Configure API URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the documentation
2. Review existing issues
3. Create a new issue with details

## 🔄 Updates

- **v1.0.0**: Initial release with AI chatbot
- **v1.1.0**: Added database integration
- **v1.2.0**: Enhanced UI and user experience
