const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
    let mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    ipcMain.on('redirect', (event, page) => {
        mainWindow.loadFile(path.join(__dirname, `../${page}`));
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    mainWindow.loadFile(path.join(__dirname, '../index.html'));
}

app.whenReady().then(createWindow);

app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

try {
    require('electron-reloader')(module)
} catch (_) { }
