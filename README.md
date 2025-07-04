# TEMPO - Chrome Extension

> **Your rhythm for focus** - A minimalist clock and bookmarks extension for new tab pages

![TEMPO Preview](https://img.shields.io/badge/Chrome-Extension-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)
![Version](https://img.shields.io/badge/Version-1.0.0-brightgreen?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

## 🎯 What is TEMPO?

TEMPO is a **scientifically-designed** new tab extension that helps you maintain your productive rhythm. Based on cognitive psychology research, it provides exactly what you need and nothing more:

- **⏰ Large, elegant clock** - Time awareness without distraction
- **📚 Smart bookmarks** - Quick access via left-hover sidebar
- **🧠 Minimal cognitive load** - Clean design that supports focus

## ✨ Features

### 🎨 **Minimalist Design**

- **70vh clock display** - Prominent time visibility
- **Soft color palette** - Easy on the eyes (#1a1a1e background)
- **JetBrains Mono font** - Fixed-width digits prevent layout shifts
- **No animations** - Except smooth sidebar transitions

### 📖 **Smart Bookmarks**

- **Progressive disclosure** - Hidden until needed (hover left edge)
- **Robust favicon loading** - 6-source fallback system
- **Real Chrome bookmarks** - Syncs with your actual bookmarks
- **Fast access** - 150ms hover delay, 300ms hide delay

### ⚡ **Performance Optimized**

- **Local fonts** - No external font requests, instant loading
- **DOM optimization** - Only updates when time changes
- **Favicon caching** - Smart caching for faster loads
- **Production ready** - No console logs, optimized for deployment

## 🚀 Installation

### From Chrome Web Store (Coming Soon)

1. Visit the Chrome Web Store
2. Search for "TEMPO"
3. Click "Add to Chrome"

### Manual Installation (Developer Mode)

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (top right toggle)
4. Click "Load unpacked"
5. Select the `new-tab` folder
6. TEMPO will replace your new tab page

## 🎵 How to Use

### **Clock**

- Opens automatically on new tab
- Shows current time in 24-hour format
- Displays day and date below

### **Bookmarks**

- **Hover left edge** of screen to reveal sidebar
- **Click any bookmark** to open in new tab
- **Move mouse away** to hide sidebar
- Works with your existing Chrome bookmarks

## 🧠 The Science Behind TEMPO

TEMPO is built on **cognitive psychology research**:

### **Cognitive Load Theory**

- **Single primary element** (clock) reduces decision fatigue
- **Progressive disclosure** hides complexity until needed
- **Minimal visual elements** prevent attention fragmentation

### **Attention Research**

- **No competing elements** - Clock dominates visual hierarchy
- **Calm color palette** - Reduces cortisol and eye strain
- **Predictable interactions** - Hover patterns feel natural

### **Digital Minimalism**

- **Intentional design** - Every element serves a purpose
- **No feature bloat** - Deliberately excludes distracting widgets
- **Focus enhancement** - Supports flow state maintenance

## 🛠️ Technical Details

### **Architecture**

```
TEMPO/
├── manifest.json          # Extension configuration
├── newtab.html            # Main HTML
├── src/
│   ├── css/              # Modular stylesheets
│   │   ├── base.css      # Reset & base styles
│   │   ├── layout.css    # Positioning & layout
│   │   ├── clock.css     # Clock-specific styles
│   │   ├── theme.css     # Color definitions
│   │   └── bookmarks.css # Bookmark sidebar styles
│   └── js/               # ES6 modules
│       ├── main.js       # App initialization
│       ├── Clock.js      # Clock functionality
│       ├── BookmarkManager.js    # Bookmark handling
│       ├── BookmarkSidebar.js    # Sidebar interface
│       ├── FaviconLoader.js      # Robust favicon loading
│       ├── TimeFormatter.js      # Time utilities
│       ├── DateFormatter.js      # Date utilities
│       └── background.js         # Chrome API access
```

### **Browser Compatibility**

- **Chrome 88+** (ES6 modules support)
- **Edge 88+**
- **Firefox 89+** (with ES6 modules enabled)

### **Permissions**

- `bookmarks` - Access your Chrome bookmarks
- `storage` - Cache favicon data locally

## 🔧 Development

### **Debug Console**

Access the global `tempoApp` object:

```javascript
// Get current state
tempoApp.getState();

// Access clock directly
tempoApp.clock.getCurrentState();
```

### **Local Storage**

- Bookmarks cached as `tempoBookmarks`
- Favicon cache in memory (session-based)

## 🎨 Customization

TEMPO is designed to be perfect as-is, but developers can modify:

### **Colors** (`src/css/theme.css`)

```css
:root {
  --bg-primary: #1a1a1e; /* Background */
  --text-clock-start: #f0f0f0; /* Clock gradient start */
  --text-clock-end: #d0d0d0; /* Clock gradient end */
}
```

### **Timing** (`src/js/BookmarkSidebar.js`)

```javascript
this.HOVER_DELAY = 150; // Hover trigger delay
this.HIDE_DELAY = 300; // Hide delay
```

## 🤝 Contributing

TEMPO follows the principle of **intentional minimalism**. Before suggesting features:

1. **Does it support focus?** - No distracting elements
2. **Is it scientifically justified?** - Based on research
3. **Does it maintain simplicity?** - Avoid feature creep

### **What We DON'T Want**

- Weather widgets
- To-do lists
- News feeds
- Background images
- Social media integration
- Complex customization options

## 📄 License

MIT License - Feel free to modify and distribute.

## 🙏 Acknowledgments

- **Cognitive Load Theory** research by John Sweller
- **Progressive Disclosure** principles from UX research
- **Digital Minimalism** concepts by Cal Newport
- **JetBrains Mono** font for beautiful typography

---

**TEMPO** - Find your rhythm for focus 🎵
