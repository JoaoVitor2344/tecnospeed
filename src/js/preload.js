const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
    redirect: (page) => ipcRenderer.send('redirect', page)
})