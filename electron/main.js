const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const fs = require('fs');

// Store data file path
const userDataPath = app.getPath('userData');
const storePath = path.join(userDataPath, 'store.json');

// Initialize store
let store = {};

// Load store from file
function loadStore() {
  try {
    if (fs.existsSync(storePath)) {
      const data = fs.readFileSync(storePath, 'utf8');
      store = JSON.parse(data);
      console.log('Store loaded successfully');
    } else {
      console.log('No existing store found, starting fresh');
    }
  } catch (error) {
    console.error('Error loading store:', error);
    store = {};
  }
}

// Save store to file
function saveStore() {
  try {
    fs.writeFileSync(storePath, JSON.stringify(store, null, 2), 'utf8');
    console.log('Store saved successfully');
  } catch (error) {
    console.error('Error saving store:', error);
  }
}

// IPC handlers for store operations
ipcMain.handle('store-get', (event, key) => {
  return store[key];
});

ipcMain.handle('store-set', (event, key, value) => {
  store[key] = value;
  saveStore();
  return true;
});

ipcMain.handle('store-delete', (event, key) => {
  delete store[key];
  saveStore();
  return true;
});

ipcMain.handle('store-has', (event, key) => {
  return key in store;
});

function createWindow() {
  // Load store when app starts
  loadStore();

  // Create the browser window
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../public/favicon.ico'),
    backgroundColor: '#1a1a1a',
    autoHideMenuBar: true,
  });

  // Load the app
  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  // Open DevTools in development mode
  if (isDev) {
    win.webContents.openDevTools();
  }
}

// When Electron is ready, create window
app.whenReady().then(createWindow);

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Re-create window on macOS when dock icon is clicked
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Save store before quitting
app.on('before-quit', () => {
  saveStore();
});