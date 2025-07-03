const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const db = require('../Database/db.cjs');

console.log('NODE_ENV:', process.env.NODE_ENV);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      enableRemoteModule: false,
      // Allow loading local resources in development
      webSecurity: process.env.NODE_ENV !== 'development' 
    },
  });

  // and load the index.html of the app.
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173'); // Vite dev server URL
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// IPC
ipcMain.handle('db-query', async (event, sql, params) => {
  try {
    const stmt = db.prepare(sql);
    // La corrección clave: Comprobar si `params` existe antes de usarlo.
    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      return params ? stmt.all(params) : stmt.all();
    } else {
      const info = params ? stmt.run(params) : stmt.run();
      return { changes: info.changes, lastInsertRowid: info.lastInsertRowid };
    }
  } catch (err) {
    console.error(`Error en db-query con SQL: ${sql}`, err);
    throw err;
  }
});
