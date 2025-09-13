import React from 'react';
import './ConfirmationPopup.css';

const ConfirmationPopup = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel' 
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <div className="confirmation-popup-overlay" onClick={onClose}>
      <div className="confirmation-popup" onClick={(e) => e.stopPropagation()}>
        <div className="confirmation-popup-header">
          <div className="confirmation-popup-icon">⚠️</div>
          <h3 className="confirmation-popup-title">{title}</h3>
          <button className="confirmation-popup-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="confirmation-popup-body">
          <p className="confirmation-popup-message">{message}</p>
        </div>
        <div className="confirmation-popup-footer">
          <button className="confirmation-popup-cancel-btn" onClick={onClose}>
            {cancelText}
          </button>
          <button className="confirmation-popup-confirm-btn" onClick={handleConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopup;
