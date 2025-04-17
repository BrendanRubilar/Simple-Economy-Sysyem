import Database from 'better-sqlite3';

// Crear o conectar a la base de datos
const db = new Database('database.db', { verbose: console.log });

export default db;