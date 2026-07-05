const { app, BrowserWindow, Menu, globalShortcut, Tray } = require('electron');
const path = require('path');

let mainWindow = null;
let tray = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920, height: 1080,
    frame: false, fullscreen: true, kiosk: true,
    backgroundColor: '#0a0a1a',
    icon: path.join(__dirname, 'build', 'icon.ico'),
    webPreferences: { nodeIntegration: false, contextIsolation: true }
  });
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  mainWindow.on('closed', () => { mainWindow = null; });
  mainWindow.on('ready-to-show', () => { mainWindow.show(); });
}

function createTray() {
  tray = new Tray(path.join(__dirname, 'build', 'icon.ico'));
  tray.setToolTip('RQBBOX OS 1');
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: 'RQBBOX OS 1', enabled: false },
    { type: 'separator' },
    { label: 'Toggle Fullscreen', click: () => { if (mainWindow) mainWindow.setFullScreen(!mainWindow.isFullScreen()); } },
    { label: 'DevTools', click: () => { if (mainWindow) mainWindow.webContents.toggleDevTools(); } },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() }
  ]));
  tray.on('double-click', () => { if (mainWindow) { mainWindow.show(); mainWindow.focus(); } });
}

const lock = app.requestSingleInstanceLock();
if (!lock) { app.quit(); } else {
  app.on('second-instance', () => { if (mainWindow) { mainWindow.show(); mainWindow.focus(); } });
}

app.whenReady().then(() => {
  createWindow(); createTray();
  globalShortcut.register('F11', () => { if (mainWindow) mainWindow.setFullScreen(!mainWindow.isFullScreen()); });
  globalShortcut.register('Escape', () => { if (mainWindow && mainWindow.isFullScreen()) mainWindow.setFullScreen(false); });
});

app.on('window-all-closed', () => app.quit());
app.on('will-quit', () => globalShortcut.unregisterAll());
