import React from 'react';
import './Popup.css';

const Popup = ({ isOpen, onClose, title, message, type = 'info' }) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  const getTypeClass = () => {
    switch (type) {
      case 'success':
        return 'popup-success';
      case 'error':
        return 'popup-error';
      case 'warning':
        return 'popup-warning';
      default:
        return 'popup-info';
    }
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className={`popup ${getTypeClass()}`} onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <div className="popup-icon">{getIcon()}</div>
          <h3 className="popup-title">{title}</h3>
          <button className="popup-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="popup-body">
          <p className="popup-message">{message}</p>
        </div>
        <div className="popup-footer">
          <button className="popup-ok-btn" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
