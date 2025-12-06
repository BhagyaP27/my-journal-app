const { contextBridge, ipcRenderer } = require('electron');

// Expose storage API to the renderer process
contextBridge.exposeInMainWorld('electronStore', {
  get: (key) => ipcRenderer.invoke('store-get', key),
  set: (key, value) => ipcRenderer.invoke('store-set', key, value),
  delete: (key) => ipcRenderer.invoke('store-delete', key),
  has: (key) => ipcRenderer.invoke('store-has', key)
});