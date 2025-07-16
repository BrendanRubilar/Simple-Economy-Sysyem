import React from 'react';

const DetalleCurso = ({ selectedClass, onGoBack, onAddCoin, onSubtractCoin }) => {
    return (
        <div>
            <button onClick={onGoBack} className="btn btn-back">
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
                            <button onClick={() => onAddCoin(student.id)} className="btn btn-add">
                                +1 Moneda
                            </button>
                            <button onClick={() => onSubtractCoin(student.id)} className="btn btn-subtract">
                                -1 Moneda
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DetalleCurso;