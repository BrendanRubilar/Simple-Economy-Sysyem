import React from 'react';

const VistaCursos = ({ classes, onSelectClass }) => {
    return (
        <div className="cards-container">
            {classes.map((cls) => (
                <div
                    key={cls.id}
                    onClick={() => onSelectClass(cls.id)}
                    className="card class-card"
                >
                    <h3>{cls.name}</h3>
                    <p>
                        <strong>Estudiantes:</strong> {cls.students.length}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default VistaCursos;