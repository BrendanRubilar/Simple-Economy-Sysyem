const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { initDatabase, getDb } = require('../Database/db.cjs'); // Importamos las funciones

// --- Lógica para la ruta de la base de datos ---
const dbName = 'database.db';

// 1. Obtener la ruta segura para los datos del usuario.
//    Ej: C:\Users\brend\AppData\Roaming\Simple Economy System
const userDataPath = app.getPath('userData');

// 2. Crear la ruta completa al archivo de la base de datos.
const dbPath = path.join(userDataPath, dbName);

// 3. Inicializar la base de datos pasándole la ruta correcta.
try {
    console.log(`Database path: ${dbPath}`);
    initDatabase(dbPath);
} catch (error) {
    console.error("CRITICAL: Could not initialize database. Exiting.", error);
    app.quit();
}

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
app.whenReady().then(() => {
    ipcMain.handle('db-query', async (event, sql, params) => {
        try {
            const db = getDb();
            
            // Si los parámetros no se proporcionan, usamos un array vacío.
            const executionParams = params || [];

            const stmt = db.prepare(sql);
            if (sql.trim().toUpperCase().startsWith('SELECT')) {
                // Pasamos el array de parámetros asegurado.
                return stmt.all(executionParams);
            } else {
                // Pasamos el array de parámetros asegurado.
                const info = stmt.run(executionParams);
                return { changes: info.changes, lastInsertRowid: info.lastInsertRowid };
            }
        } catch (error) {
            console.error('DB Query Error:', error.message, 'SQL:', sql, 'Params:', params);
            throw error;
        }
    });

    createWindow();

    app.on('activate', () => {
      // On OS X it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });

// In this file you can include the rest of your app's specific main
// code. You can also put them in separate files and import them here.
