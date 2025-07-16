import React, { useState, useEffect } from 'react';
import './MainPanel.css';
import VistaCursos from './VistaCursos.jsx'; 
import DetalleCurso from './DetalleCurso.jsx';

const MainPanel = () => {
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);

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
                <DetalleCurso 
                    selectedClass={selectedClass}
                    onGoBack={goBack}
                    onAddCoin={addCoin}
                    onSubtractCoin={subtractCoin}
                />
            ) : (
                <VistaCursos 
                    classes={classes}
                    onSelectClass={selectClass}
                />
            )}
        </div>
    );
};

export default MainPanel;