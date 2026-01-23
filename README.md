# TrueScope Chrome Extension

**TrueScope** is a Chrome extension that analyzes news articles for bias and credibility. The extension displays a side panel with detailed analysis of the current article.

## Project Overview

- **Technology Stack**: React 19, Vite, Tailwind CSS
- **Manifest Version**: 3
- **Key Features**: Real-time bias detection, credibility scoring, side panel integration

---

## Development Setup - Loading the Extension in Chrome Developer Mode

This is the first step - testing your extension locally before publishing to the Chrome Web Store.

### **Step 1: Build the Extension**

1. Open terminal and navigate to the project:
   ```bash
   cd c:\Users\orcul\truescope-extension
   ```

2. Install dependencies (if not already done):
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. This creates a `dist` folder with all compiled files

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

### **Step 5: Reload During Development**

1. After making changes, rebuild:
   ```bash
   npm run build
   ```

2. Go back to `chrome://extensions/`
3. Click the **refresh icon** on the TrueScope extension card
4. Your changes will be loaded in Chrome

### **Step 6: Remove Extension**

When you're done testing:
1. Go to `chrome://extensions/`
2. Click the **"Remove"** button on the TrueScope card
