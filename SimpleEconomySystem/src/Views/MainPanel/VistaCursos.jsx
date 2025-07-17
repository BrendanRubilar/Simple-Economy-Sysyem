import React, { useState, useEffect } from 'react';

const ClassCard = ({ cls, onSelectClass, isEditing, onDeleteClass, onUpdateClass }) => {
    const [name, setName] = useState(cls.name);

    useEffect(() => {
        setName(cls.name);
    }, [cls.name]);

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleBlur = () => {
        if (name !== cls.name) {
            onUpdateClass(cls.id, name);
        }
    };

    return (
        <div className={`card class-card ${isEditing ? 'editing' : ''}`}>
            {isEditing && (
                <button onClick={() => onDeleteClass(cls.id)} className="btn-delete-card">X</button>
            )}
            <div onClick={!isEditing ? () => onSelectClass(cls.id) : undefined}>
                {isEditing ? (
                    <input 
                        type="text" 
                        value={name} 
                        onChange={handleNameChange}
                        onBlur={handleBlur}
                        className="card-title-input"
                        onClick={(e) => e.stopPropagation()} // Evita que el click se propague
                    />
                ) : (
                    <h3>{cls.name}</h3>
                )}
                <p>
                    <strong>Estudiantes:</strong> {cls.students.length}
                </p>
            </div>
        </div>
    );
};


const VistaCursos = ({ classes, onSelectClass, isEditing, onDeleteClass, onUpdateClass }) => {
    if (!Array.isArray(classes)) {
        return <div>Cargando cursos...</div>;
    }

    return (
        <div className="cards-container">
            {classes.map((cls) => (
                <ClassCard 
                    key={cls.id}
                    cls={cls}
                    onSelectClass={onSelectClass}
                    isEditing={isEditing}
                    onDeleteClass={onDeleteClass}
                    onUpdateClass={onUpdateClass}
                />
            ))}
        </div>
    );
};

export default VistaCursos;