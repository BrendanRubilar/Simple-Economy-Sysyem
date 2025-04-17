import React, { useState, useEffect } from 'react';
import Database from 'better-sqlite3';

const MainPanel = () => {
    const [classes, setClasses] = useState([]); // Clases y estudiantes
    const [selectedClass, setSelectedClass] = useState(null); // Clase seleccionada

    // Cargar datos desde SQLite
    useEffect(() => {
        const loadClassesFromDatabase = () => {
            // Conectar a la base de datos
            const db = new Database('c:/Users/brend/Desktop/Simple-Economy-Sysyem/SimpleEconomySystem/Database/database.db', { verbose: console.log });

            // Consultar las clases
            const sqlClasses = `SELECT id, name AS className FROM classes`;
            const sqlStudents = `SELECT id, name, grade AS course, coins, class_id FROM students`;

            const classes = db.prepare(sqlClasses).all();
            const students = db.prepare(sqlStudents).all();

            // Asociar estudiantes con sus clases
            const data = classes.map((cls) => ({
                id: cls.id,
                name: cls.className,
                students: students.filter((student) => student.class_id === cls.id),
            }));

            setClasses(data);
            db.close(); // Cerrar la conexión a la base de datos
        };

        loadClassesFromDatabase();
    }, []);

    // Función para seleccionar una clase
    const selectClass = (classId) => {
        const selected = classes.find((cls) => cls.id === classId);
        setSelectedClass(selected);
    };

    // Función para volver a la vista de clases
    const goBack = () => {
        setSelectedClass(null);
    };

    // Función para sumar monedas a un estudiante
    const addCoin = (studentId) => {
        setClasses((prevClasses) =>
            prevClasses.map((cls) =>
                cls.id === selectedClass.id
                    ? {
                          ...cls,
                          students: cls.students.map((student) =>
                              student.id === studentId
                                  ? { ...student, coins: student.coins + 1 }
                                  : student
                          ),
                      }
                    : cls
            )
        );
    };

    // Función para restar monedas a un estudiante
    const subtractCoin = (studentId) => {
        setClasses((prevClasses) =>
            prevClasses.map((cls) =>
                cls.id === selectedClass.id
                    ? {
                          ...cls,
                          students: cls.students.map((student) =>
                              student.id === studentId && student.coins > 0
                                  ? { ...student, coins: student.coins - 1 }
                                  : student
                          ),
                      }
                    : cls
            )
        );
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{ textAlign: 'center' }}>Panel de Administración</h1>
            {selectedClass ? (
                // Vista de estudiantes dentro de una clase
                <div>
                    <button
                        onClick={goBack}
                        style={{
                            marginBottom: '20px',
                            padding: '10px 15px',
                            backgroundColor: '#007BFF',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                    >
                        Volver a las clases
                    </button>
                    <h2 style={{ textAlign: 'center' }}>{selectedClass.name}</h2>
                    <div
                        style={{
                            display: 'flex',
                            gap: '20px',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                        }}
                    >
                        {selectedClass.students.map((student) => (
                            <div
                                key={student.id}
                                style={{
                                    border: '1px solid #ccc',
                                    borderRadius: '8px',
                                    padding: '15px',
                                    width: '250px',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                }}
                            >
                                <h3>{student.name}</h3>
                                <p>
                                    <strong>Curso:</strong> {student.course}
                                </p>
                                <p>
                                    <strong>Monedas:</strong> {student.coins}
                                </p>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginTop: '10px',
                                    }}
                                >
                                    <button
                                        onClick={() => addCoin(student.id)}
                                        style={{
                                            backgroundColor: '#4CAF50',
                                            color: 'white',
                                            border: 'none',
                                            padding: '8px 12px',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        +1 Moneda
                                    </button>
                                    <button
                                        onClick={() => subtractCoin(student.id)}
                                        style={{
                                            backgroundColor: '#f44336',
                                            color: 'white',
                                            border: 'none',
                                            padding: '8px 12px',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        -1 Moneda
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                // Vista de clases
                <div
                    style={{
                        display: 'flex',
                        gap: '20px',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                    }}
                >
                    {classes.map((cls) => (
                        <div
                            key={cls.id}
                            onClick={() => selectClass(cls.id)}
                            style={{
                                border: '1px solid #ccc',
                                borderRadius: '8px',
                                padding: '15px',
                                width: '250px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            }}
                        >
                            <h3>{cls.name}</h3>
                            <p>
                                <strong>Estudiantes:</strong> {cls.students.length}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MainPanel;