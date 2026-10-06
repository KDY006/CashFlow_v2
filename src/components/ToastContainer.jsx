import React from 'react';
import { useData } from '../context/DataContext';

export default function ToastContainer() {
  const { toasts } = useData();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-fixed-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast-item ${t.type}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className={`bi ${t.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'}`} style={{ fontSize: '1.1rem' }}></i>
            <span>{t.message}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
