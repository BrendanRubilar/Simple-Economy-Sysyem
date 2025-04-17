import db from './db.js';

// Insertar un usuario
export const insertUser = (name,grade,coins) => {
    const sql = `
        INSERT INTO users (name,grade,coins)
        VALUES (?,?,?)
    `;
    db.prepare(sql).run(name,grade,coins);
};

// Obtener todos los usuarios
export const getUsers = () => {
    const sql = `
        SELECT * FROM users
    `;
    return db.prepare(sql).all(); // Devuelve todos los usuarios
};

// Obtener un usuario por ID
export const getUser = (id) => {
    const sql = `
        SELECT * FROM users WHERE id = ?
    `;
    return db.prepare(sql).get(id); // Devuelve un solo usuario
};

// Obtener todas las clases con sus estudiantes
export const getClassesWithStudents = () => {
    const sqlClasses = `
        SELECT id, name AS className FROM classes
    `;
    const sqlStudents = `
        SELECT id, name, grade AS course, coins, class_id FROM students
    `;

    const classes = db.prepare(sqlClasses).all();
    const students = db.prepare(sqlStudents).all();

    // Asociar estudiantes con sus clases
    return classes.map((cls) => ({
        id: cls.id,
        name: cls.className,
        students: students.filter((student) => student.class_id === cls.id),
    }));
};

export const insertStudents = (students, classId) => {
    const sql = `
        INSERT INTO students (name, grade, coins, class_id)
        VALUES (?, ?, ?, ?)
    `;
    const stmt = db.prepare(sql);

    students.forEach((student) => {
        stmt.run(student.name, student.grade, student.coins, classId);
    });
};