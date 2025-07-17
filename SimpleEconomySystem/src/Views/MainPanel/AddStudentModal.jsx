// src/Views/MainPanel/AddStudentModal.jsx
import React, { useState } from 'react';

const AddStudentModal = ({ onClose, onSave }) => {
    const [studentName, setStudentName] = useState('');

    const handleSave = () => {
        if (studentName.trim()) {
            onSave(studentName.trim());
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Añadir Nuevo Alumno</h2>
                <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Nombre del alumno"
                    className="modal-input"
                    autoFocus
                />
                <div className="modal-actions">
                    <button onClick={onClose} className="btn btn-cancel">Cancelar</button>
                    <button onClick={handleSave} className="btn btn-save">Guardar</button>
                </div>
            </div>
        </div>
    );
};

export default AddStudentModal;