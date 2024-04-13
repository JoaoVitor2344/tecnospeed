const { app, BrowserWindow, ipcMain } = require('electron/main');
const path = require('node:path');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });
    
    // Redicionar para outra página
    ipcMain.on('redirect', (event, page) => {
        mainWindow.loadFile(path.join(__dirname, `../${page}`));
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    mainWindow.loadFile(path.join(__dirname, '../index.html'));
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

try {
    require('electron-reloader')(module)
} catch (_) { }
