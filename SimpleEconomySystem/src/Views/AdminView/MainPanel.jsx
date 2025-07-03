import React, { useState, useEffect } from 'react';
import './MainPanel.css'; // Importamos el nuevo archivo CSS

const MainPanel = () => {
    const [classes, setClasses] = useState([]); // Clases y estudiantes
    const [selectedClass, setSelectedClass] = useState(null); // Clase seleccionada

    // Cargar datos desde SQLite a través de IPC
    const loadData = async () => {
        try {
            const classesResult = await window.electronAPI.dbQuery('SELECT id, name FROM classes');
            const studentsResult = await window.electronAPI.dbQuery('SELECT id, name, grade AS course, coins, class_id FROM students');

            // Combina los estudiantes en sus respectivas clases
            const classesWithStudents = classesResult.map((cls) => ({
                ...cls,
                students: studentsResult.filter((student) => student.class_id === cls.id),
            }));

            setClasses(classesWithStudents);
        } catch (error) {
            console.error('Error al cargar datos desde la base de datos:', error);
        }
    };

    useEffect(() => {
        loadData();
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
    const addCoin = async (studentId) => {
        try {
            // 1. Actualizar la base de datos
            await window.electronAPI.dbQuery('UPDATE students SET coins = coins + 1 WHERE id = ?', [studentId]);

            // 2. Crear el nuevo estado actualizado
            const newClasses = classes.map((cls) => {
                if (cls.id !== selectedClass.id) return cls;
                const newStudents = cls.students.map((student) => 
                    student.id === studentId ? { ...student, coins: student.coins + 1 } : student
                );
                return { ...cls, students: newStudents };
            });

            // 3. Actualizar ambos estados para forzar el re-render
            setClasses(newClasses);
            setSelectedClass(newClasses.find(cls => cls.id === selectedClass.id));

        } catch (error) {
            console.error('Error al sumar moneda:', error);
        }
    };

    // Función para restar monedas a un estudiante
    const subtractCoin = async (studentId) => {
        try {
            // 1. Actualizar la base de datos
            await window.electronAPI.dbQuery('UPDATE students SET coins = MAX(0, coins - 1) WHERE id = ?', [studentId]);

            // 2. Crear el nuevo estado actualizado
            const newClasses = classes.map((cls) => {
                if (cls.id !== selectedClass.id) return cls;
                const newStudents = cls.students.map((student) =>
                    student.id === studentId ? { ...student, coins: Math.max(0, student.coins - 1) } : student
                );
                return { ...cls, students: newStudents };
            });

            // 3. Actualizar ambos estados
            setClasses(newClasses);
            setSelectedClass(newClasses.find(cls => cls.id === selectedClass.id));

        } catch (error) {
            console.error('Error al restar moneda:', error);
        }
    };

    return (
        <div className="main-panel-container">
            <h1 className="main-panel-header">Panel de Administración</h1>
            {selectedClass ? (
                // Vista de estudiantes dentro de una clase
                <div>
                    <button onClick={goBack} className="btn btn-back">
                        Volver a las clases
                    </button>
                    <h2 className="students-view-header">{selectedClass.name}</h2>
                    <div className="cards-container">
                        {selectedClass.students.map((student) => (
                            <div key={student.id} className="card student-card">
                                <h3>{student.name}</h3>
                                <p>
                                    <strong>Curso:</strong> {student.course}
                                </p>
                                <p>
                                    <strong>Monedas:</strong> {student.coins}
                                </p>
                                <div className="coin-controls">
                                    <button onClick={() => addCoin(student.id)} className="btn btn-add">
                                        +1 Moneda
                                    </button>
                                    <button onClick={() => subtractCoin(student.id)} className="btn btn-subtract">
                                        -1 Moneda
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                // Vista de clases
                <div className="cards-container">
                    {classes.map((cls) => (
                        <div
                            key={cls.id}
                            onClick={() => selectClass(cls.id)}
                            className="card class-card"
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