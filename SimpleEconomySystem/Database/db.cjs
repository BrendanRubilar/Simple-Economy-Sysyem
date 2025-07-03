const path = require('path');
const Database = require('better-sqlite3');

// La base de datos se creará en el directorio raíz del proyecto
const dbPath = path.resolve(__dirname, '..', 'database.db');
const db = new Database(dbPath, { verbose: console.log });

// Activar WAL mode para mejor concurrencia
db.pragma('journal_mode = WAL');

// Crear tablas si no existen
const createTables = () => {
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
  db.exec(createClassesTable);
  db.exec(createStudentsTable);
};

// Insertar datos de ejemplo si las tablas están vacías
const seedData = () => {
  const count = db.prepare('SELECT COUNT(*) as count FROM classes').get().count;
  if (count === 0) {
    console.log('Base de datos vacía, insertando datos de ejemplo...');
    const insertClass = db.prepare('INSERT INTO classes (name) VALUES (?)');
    const insertStudent = db.prepare('INSERT INTO students (name, grade, coins, class_id) VALUES (?, ?, ?, ?)');

    db.transaction(() => {
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

// Ejecutar la inicialización
createTables();
seedData();

module.exports = db;
