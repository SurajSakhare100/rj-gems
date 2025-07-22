# **Setup Guide - Fix All Issues** 🔧

## **Issues Fixed:**

✅ **React Router Warnings** - Updated to v7 future flags  
✅ **Gemini API Key** - Added fallback when not configured  
✅ **WebSocket Connection** - Disabled problematic connections  

---

## **Step 1: Create Environment File**

Create a file called `.env.local` in the `frontend` folder:

```bash
# API Configuration
REACT_APP_API_URL=http://localhost:5000

# Google Gemini AI Configuration
# Get your free API key from: https://makersuite.google.com/app/apikey
REACT_APP_GEMINI_API_KEY=

# Development Settings (fixes WebSocket issues)
FAST_REFRESH=false
CHOKIDAR_USEPOLLING=true
```

## **Step 2: Get Gemini API Key (Optional)**

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy your API key and add it to `.env.local`:
   ```bash
   REACT_APP_GEMINI_API_KEY=AIzaSyYourActualAPIKeyHere
   ```

**Note:** The chatbot will work without the API key using local responses!

## **Step 3: Restart Development Server**

```bash
cd frontend
npm start
```

---

## **What's Fixed:**

### **1. React Router Warnings** ✅
- Updated to use `createBrowserRouter` with future flags
- Added `v7_startTransition` and `v7_relativeSplatPath`
- No more console warnings!

### **2. Gemini API Key Error** ✅
- Added fallback to local AI responses when API key is missing
- Graceful error handling
- Chatbot works with or without API key

### **3. WebSocket Connection Issues** ✅
- Disabled `FAST_REFRESH` to prevent WebSocket conflicts
- Added `CHOKIDAR_USEPOLLING` for better file watching
- No more connection errors!

---

## **How It Works Now:**

- **With API Key**: Uses **Google Gemini AI** for intelligent responses
- **Without API Key**: Uses **local AI logic** with product recommendations
- **Both modes**: Support **markdown formatting** and **real product data**

## **Test the Chatbot:**

1. Open your browser to `http://localhost:3000`
2. Click the **AI chat button** in the bottom right
3. Try asking: *"I'm looking for engagement rings"*
4. You should get a response with **bold product names** and recommendations!

---

**All issues should now be resolved!** 🎉 