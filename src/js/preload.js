const { contextBridge, ipcRenderer } = require('electron');
const openssl = require('openssl-nodejs');

contextBridge.exposeInMainWorld('electronAPI', {
    redirect: (page) => ipcRenderer.send('redirect', page),
    openssl: openssl
});
