CREATE TABLE IF NOT EXISTS classes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    grade TEXT NOT NULL,
    coins INTEGER DEFAULT 0,
    class_id INTEGER NOT NULL,
    FOREIGN KEY (class_id) REFERENCES classes (id)
);

DROP TABLE IF EXISTS classes;
DROP TABLE IF EXISTS students;

INSERT INTO classes (name) VALUES ('Primero Medio B');

-- Asegúrate de que la clase "Segundo Medio A" ya exista
INSERT INTO classes (name) VALUES ('Segundo Medio A');
SELECT id FROM classes WHERE name = 'Segundo Medio B';
-- Obtener el ID de la clase "Segundo Medio A"
-- Supongamos que el ID es 1