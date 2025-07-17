import React, { useState } from 'react';

const AddClassModal = ({ onClose, onSave }) => {
    const [className, setClassName] = useState('');

    const handleSave = () => {
        if (className.trim()) {
            onSave(className.trim());
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Añadir Nuevo Curso</h2>
                <input
                    type="text"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    placeholder="Nombre del curso"
                    className="modal-input"
                />
                <div className="modal-actions">
                    <button onClick={onClose} className="btn btn-cancel">
                        Cancelar
                    </button>
                    <button onClick={handleSave} className="btn btn-save">
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddClassModal;