import React, { useState, useEffect } from 'react';

const StudentCard = ({ student, isEditing, onDelete, onUpdate, onAddCoin, onSubtractCoin }) => {
    const [name, setName] = useState(student.name);

    useEffect(() => {
        setName(student.name);
    }, [student.name]);

    const handleNameChange = (e) => setName(e.target.value);
    const handleBlur = () => {
        if (name !== student.name) {
            onUpdate(student.id, name);
        }
    };

    return (
        <div className={`card student-card ${isEditing ? 'editing' : ''}`}>
            {isEditing && (
                <button onClick={() => onDelete(student.id)} className="btn-delete-card">X</button>
            )}
            {isEditing ? (
                <input
                    type="text"
                    value={name}
                    onChange={handleNameChange}
                    onBlur={handleBlur}
                    className="card-title-input"
                />
            ) : (
                <h3>{student.name}</h3>
            )}
            <p><strong>Curso:</strong> {student.course}</p>
            <p><strong>Monedas:</strong> {student.coins}</p>
            {!isEditing && (
                <div className="coin-controls">
                    <button onClick={() => onAddCoin(student.id)} className="btn btn-add">+1 Moneda</button>
                    <button onClick={() => onSubtractCoin(student.id)} className="btn btn-subtract">-1 Moneda</button>
                </div>
            )}
        </div>
    );
};

const DetalleCurso = ({ selectedClass, onGoBack, onAddCoin, onSubtractCoin, isEditing, onDeleteStudent, onUpdateStudent, onAddStudent }) => {
    return (
        <div className="detail-view-container">
            <button onClick={onGoBack} className="btn btn-back">
                Volver a las clases
            </button>
            <h2 className="students-view-header">{selectedClass.name}</h2>
            
            {isEditing && (
                <div className="detail-edit-actions">
                    <button onClick={onAddStudent} className="btn btn-add-student">+ Añadir Alumno</button>
                    <button className="btn btn-upload-file">Cargar desde Archivo</button>
                </div>
            )}

            <div className="cards-container">
                {selectedClass.students.map((student) => (
                    <StudentCard 
                        key={student.id}
                        student={student}
                        isEditing={isEditing}
                        onDelete={onDeleteStudent}
                        onUpdate={onUpdateStudent}
                        onAddCoin={onAddCoin}
                        onSubtractCoin={onSubtractCoin}
                    />
                ))}
            </div>
        </div>
    );
};

export default DetalleCurso;