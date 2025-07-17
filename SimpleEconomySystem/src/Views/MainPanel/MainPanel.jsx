import React, { useState, useEffect } from 'react';
import './MainPanel.css';
import VistaCursos from './VistaCursos.jsx'; 
import DetalleCurso from './DetalleCurso.jsx';
import AddClassModal from './AddClassModal.jsx';
import AddStudentModal from './AddStudentModal.jsx';

const MainPanel = () => {
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false); // 2. Nuevo estado para el modal
    const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);

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

            // --- ¡AQUÍ ESTÁ LA SOLUCIÓN! ---
            // Si hay una clase seleccionada, la actualizamos con los nuevos datos.
            if (selectedClass) {
                const updatedSelectedClass = classesWithStudents.find(
                    (cls) => cls.id === selectedClass.id
                );
                setSelectedClass(updatedSelectedClass);
            }
            
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

    // 3. La función de guardado que se pasará al modal
    const handleSaveNewClass = async (name) => {
        try {
            await window.electronAPI.dbQuery('INSERT INTO classes (name) VALUES (?)', [name]);
            loadData(); // Recargamos los datos
            setIsAddModalOpen(false); // Cerramos el modal
        } catch (error) {
            console.error('Error al agregar clase:', error);
            alert('No se pudo agregar la clase. Es posible que el nombre ya exista.');
        }
    };

    // Nueva función para guardar el alumno desde el modal
    const handleSaveNewStudent = async (name) => {
        if (!selectedClass) return;
        try {
            await window.electronAPI.dbQuery(
                'INSERT INTO students (name, grade, class_id) VALUES (?, ?, ?)',
                [name, selectedClass.name, selectedClass.id]
            );
            loadData(); // Recargamos para ver al nuevo alumno
            setIsAddStudentModalOpen(false); // Cerramos el modal
        } catch (error) {
            console.error('Error al agregar alumno:', error);
            alert('No se pudo agregar al alumno.');
        }
    };

    // Función para manejar la eliminación de una clase
    const handleDeleteClass = async (classId) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta clase y todos sus alumnos?')) {
            try {
                await window.electronAPI.dbQuery('DELETE FROM classes WHERE id = ?', [classId]);
                loadData(); // Recargamos los datos.
            } catch (error) {
                console.error('Error al eliminar clase:', error);
            }
        }
    };

    // Función para manejar la actualización del nombre de una clase
    const handleUpdateClassName = async (classId, newName) => {
        if (!newName) return;
        try {
            await window.electronAPI.dbQuery('UPDATE classes SET name = ? WHERE id = ?', [newName, classId]);
            loadData(); // Recargamos los datos.
        } catch (error) {
            console.error('Error al actualizar nombre de clase:', error);
            alert('No se pudo actualizar el nombre de la clase. Es posible que el nuevo nombre ya exista.');
        }
    };

    // --- Funciones para la gestión de estudiantes ---
    const handleAddStudent = () => {
        setIsAddStudentModalOpen(true);
    };

    const handleDeleteStudent = async (studentId) => {
        if (window.confirm('¿Seguro que quieres eliminar a este alumno?')) {
            await window.electronAPI.dbQuery('DELETE FROM students WHERE id = ?', [studentId]);
            loadData(); // Recargar
        }
    };

    const handleUpdateStudentName = async (studentId, newName) => {
        if (newName) {
            await window.electronAPI.dbQuery('UPDATE students SET name = ? WHERE id = ?', [newName, studentId]);
            loadData(); // Recargar
        }
    };

    return (
        <div className="main-panel-container">
            {/* Botón de engranaje/cierre posicionado en la esquina */}
            <button onClick={() => setIsEditing(!isEditing)} className="btn-edit-gear">
                {isEditing ? (
                    // Icono de "X" para cerrar
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                ) : (
                    // Icono de engranaje
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V15a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                )}
            </button>
            
            {/* Modales */}
            {isAddModalOpen && (
                <AddClassModal 
                    onClose={() => setIsAddModalOpen(false)}
                    onSave={handleSaveNewClass}
                />
            )}
            {isAddStudentModalOpen && (
                <AddStudentModal
                    onClose={() => setIsAddStudentModalOpen(false)}
                    onSave={handleSaveNewStudent}
                />
            )}

            <h1 className="main-panel-header">Panel de Administración</h1>

            {selectedClass ? (
                <DetalleCurso 
                    selectedClass={selectedClass}
                    onGoBack={goBack}
                    onAddCoin={addCoin}
                    onSubtractCoin={subtractCoin}
                    // Pasamos las nuevas props para el modo edición
                    isEditing={isEditing}
                    onAddStudent={handleAddStudent}
                    onDeleteStudent={handleDeleteStudent}
                    onUpdateStudent={handleUpdateStudentName}
                />
            ) : (
                <>
                    {isEditing && (
                        // 5. El botón ahora abre el modal
                        <button onClick={() => setIsAddModalOpen(true)} className="btn btn-add-class">
                            + Añadir Nuevo Curso
                        </button>
                    )}
                    <VistaCursos 
                        classes={classes}
                        onSelectClass={selectClass}
                        isEditing={isEditing}
                        onDeleteClass={handleDeleteClass}
                        onUpdateClass={handleUpdateClassName}
                    />
                </>
            )}

            {/* Firma de la aplicación */}
            <div className="app-signature">
                <a href="https://github.com/BrendanRubilar" target="_blank" rel="noopener noreferrer">
                    https://github.com/BrendanRubilar
                </a>
            </div>
        </div>
    );
};

export default MainPanel;