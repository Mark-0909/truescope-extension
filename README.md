# TrueScope Chrome Extension

**TrueScope** is a Chrome extension that analyzes news articles for bias and credibility. The extension displays a side panel with detailed analysis of the current article.

## Project Overview

- **Technology Stack**: React 19, Vite, Tailwind CSS
- **Manifest Version**: 3
- **Key Features**: Real-time bias detection, credibility scoring, side panel integration

---

## Development Setup - Loading the Extension in Chrome Developer Mode

This is the first step - testing your extension locally before publishing to the Chrome Web Store.

### **Step 1: Start the Development Server**

1. Open terminal and navigate to the project:
   ```bash
   cd c:\Users\orcul\truescope-extension
   ```

2. Install dependencies (if not already done):
   ```bash
   npm install
   ```

3. Start the development server with hot reload:
   ```bash
   npm run dev
   ```

   This will:
   - Compile your extension
   - Create a `dist` folder
   - Watch for file changes and automatically rebuild
   - Show a message like "CRXJS: Load dist as unpacked extension"

4. **Alternative**: If you prefer a one-time build without watching:
   ```bash
   npm run build
   ```

### **Step 2: Open Chrome in Developer Mode**

1. Open Google Chrome
2. Go to `chrome://extensions/`
3. In the top-right corner, toggle **"Developer mode"** ON
4. You should now see three new buttons: **"Load unpacked"**, **"Pack extension"**, and **"Update"**

### **Step 3: Load Your Extension**

1. Click the **"Load unpacked"** button
2. Navigate to your project's `dist` folder:
   ```
   c:\Users\orcul\truescope-extension\dist
   ```
3. Select the `dist` folder and click **"Select Folder"**
4. Your TrueScope extension should now appear in the extensions list!

### **Step 4: Test Your Extension**

1. Click the extension icon in Chrome's toolbar
2. The side panel should open showing your analysis interface
3. Visit any news article website to test functionality
4. Open Chrome DevTools (F12) and check the Console for any errors

### **Step 5: Hot Reload During Development**

Since you're running `npm run dev`, changes automatically rebuild:

1. Edit your code in the `src/` folder (e.g., [src/components/Popup.jsx](src/components/Popup.jsx))
2. Vite automatically rebuilds the `dist` folder
3. Go to `chrome://extensions/`
4. Click the **refresh icon** on the TrueScope extension card
5. Your changes appear instantly!

**Pro Tip**: Keep the terminal running with `npm run dev` throughout your development session. You'll see rebuild messages every time you save a file.

### **Step 6: Remove Extension**

When you're done testing:
1. Go to `chrome://extensions/`
2. Click the **"Remove"** button on the TrueScope card
