const path = require('path');
const Database = require('better-sqlite3');
let db;

// La función ahora acepta la ruta como argumento
function initDatabase(dbPath) {
    if (db) {
        return db;
    }

    try {
        // Usa la ruta que le pasaron para crear/abrir la BD
        db = new Database(dbPath, { verbose: console.log });
        db.pragma('journal_mode = WAL');

        // Llama a las funciones para configurar la BD
        createTables(db);
        seedData(db);

    } catch (error) {
        console.error('Failed to initialize the database:', error);
        throw error;
    }
    return db;
}

function getDb() {
    if (!db) {
        throw new Error('Database has not been initialized. Call initDatabase first.');
    }
    return db;
}

// --- Funciones de configuración (aceptan 'db' como parámetro) ---

const createTables = (dbInstance) => {
  const createClassesTable = `
    CREATE TABLE IF NOT EXISTS classes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );
  `;
  const createStudentsTable = `
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      grade TEXT,
      coins INTEGER DEFAULT 0,
      class_id INTEGER,
      FOREIGN KEY (class_id) REFERENCES classes (id) ON DELETE CASCADE
    );
  `;
  dbInstance.exec(createClassesTable);
  dbInstance.exec(createStudentsTable);
};

const seedData = (dbInstance) => {
  const count = dbInstance.prepare('SELECT COUNT(*) as count FROM classes').get().count;
  if (count === 0) {
    console.log('Base de datos vacía, insertando datos de ejemplo...');
    const insertClass = dbInstance.prepare('INSERT INTO classes (name) VALUES (?)');
    const insertStudent = dbInstance.prepare('INSERT INTO students (name, grade, coins, class_id) VALUES (?, ?, ?, ?)');

    dbInstance.transaction(() => {
      const classAId = insertClass.run('Clase A - 5º Primaria').lastInsertRowid;
      const classBId = insertClass.run('Clase B - 6º Primaria').lastInsertRowid;

      insertStudent.run('Juan Pérez', '5ºA', 10, classAId);
      insertStudent.run('Ana Gómez', '5ºA', 5, classAId);
      insertStudent.run('Carlos Sánchez', '5ºA', 15, classAId);

      insertStudent.run('Luis Rodríguez', '6ºB', 8, classBId);
      insertStudent.run('María Fernández', '6ºB', 12, classBId);
    })();
    
    console.log('Datos de ejemplo insertados.');
  } else {
    console.log('La base de datos ya contiene datos.');
  }
};

module.exports = { initDatabase, getDb };
