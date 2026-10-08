import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export default function EmailModal({ isOpen, onClose, emailData }) {
  const { clearLastSentEmail } = useAuth();
  const { showToast } = useData();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !emailData) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(emailData.tempPassword);
    setCopied(true);
    showToast('Đã sao chép mật khẩu tạm thời vào clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleGoToLogin = () => {
    onClose();
    navigate('/login', {
      state: {
        email: emailData.to,
        password: emailData.tempPassword,
        fromEmail: true
      }
    });
  };

  const isRegister = emailData.type === 'register';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
    }}>
      <div style={{
        background: '#ffffff', borderRadius: '20px', maxWidth: '540px', width: '100%',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)', overflow: 'hidden',
        animation: 'fadeInUp 0.25s ease-out'
      }}>
        {/* Email Header Bar */}
        <div style={{
          background: '#0f172a', padding: '16px 20px', color: '#ffffff',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem'
            }}>
              <i className="bi bi-envelope-fill"></i>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Hộp thư Email (Mô phỏng)</div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Hệ thống gửi email tự động của CashFlow</div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent', border: 'none', color: '#94a3b8',
              fontSize: '1.2rem', cursor: 'pointer', padding: '4px'
            }}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Email Meta Details */}
        <div style={{
          padding: '16px 24px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0',
          fontSize: '0.85rem'
        }}>
          <div style={{ display: 'flex', marginBottom: '6px' }}>
            <span style={{ width: '80px', color: '#64748b', fontWeight: 600 }}>Từ:</span>
            <span style={{ fontWeight: 600, color: '#0f172a' }}>CashFlow Security &lt;no-reply@cashflow.vn&gt;</span>
          </div>
          <div style={{ display: 'flex', marginBottom: '6px' }}>
            <span style={{ width: '80px', color: '#64748b', fontWeight: 600 }}>Đến:</span>
            <span style={{ fontWeight: 600, color: '#2563eb' }}>{emailData.to}</span>
          </div>
          <div style={{ display: 'flex', marginBottom: '6px' }}>
            <span style={{ width: '80px', color: '#64748b', fontWeight: 600 }}>Thời gian:</span>
            <span style={{ color: '#475569' }}>{emailData.sentAt}</span>
          </div>
          <div style={{ display: 'flex' }}>
            <span style={{ width: '80px', color: '#64748b', fontWeight: 600 }}>Tiêu đề:</span>
            <span style={{ fontWeight: 700, color: '#0f172a' }}>
              {isRegister ? '[CashFlow] Kích hoạt tài khoản & Mật khẩu tạm thời' : '[CashFlow] Yêu cầu khôi phục mật khẩu'}
            </span>
          </div>
        </div>

        {/* Email Body Content */}
        <div style={{ padding: '24px', maxHeight: '420px', overflowY: 'auto' }}>
          <p style={{ fontSize: '0.95rem', color: '#334155', marginBottom: '14px' }}>
            Xin chào <b>{emailData.fullName || 'bạn'}</b>,
          </p>

          <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, marginBottom: '18px' }}>
            {isRegister
              ? 'Cảm ơn bạn đã đăng ký tài khoản tại CashFlow. Để đảm bảo an toàn, hệ thống đã khởi tạo ngẫu nhiên một mật khẩu tạm thời cho tài khoản của bạn:'
              : 'Bạn vừa yêu cầu cấp lại mật khẩu truy cập hệ thống CashFlow. Dưới đây là mật khẩu tạm thời mới được cấp:'}
          </p>

          {/* Registration Extra Details if any */}
          {isRegister && (emailData.dob || emailData.gender) && (
            <div style={{
              background: '#f1f5f9', borderRadius: '10px', padding: '10px 14px',
              fontSize: '0.82rem', color: '#475569', marginBottom: '18px'
            }}>
              <div>👤 <b>Họ và tên:</b> {emailData.fullName}</div>
              {emailData.dob && <div>🎂 <b>Ngày sinh:</b> {emailData.dob}</div>}
              {emailData.gender && <div>⚧ <b>Giới tính:</b> {emailData.gender}</div>}
            </div>
          )}

          {/* Highlight Password Box */}
          <div style={{
            background: '#ecfdf5', border: '2px dashed #10b981', borderRadius: '14px',
            padding: '16px 20px', textAlign: 'center', marginBottom: '20px'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase', marginBottom: '6px' }}>
              MẬT KHẨU TẠM THỜI CỦA BẠN
            </div>
            <div style={{
              fontSize: '1.8rem', fontWeight: 900, letterSpacing: '4px',
              color: '#065f46', fontFamily: 'monospace', marginBottom: '10px'
            }}>
              {emailData.tempPassword}
            </div>

            <button
              type="button"
              onClick={handleCopy}
              style={{
                background: '#ffffff', border: '1px solid #10b981', color: '#059669',
                padding: '6px 14px', borderRadius: '8px', fontSize: '0.82rem',
                fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px'
              }}
            >
              <i className={`bi ${copied ? 'bi-check2' : 'bi-clipboard'}`}></i>
              <span>{copied ? 'Đã sao chép' : 'Sao chép mật khẩu'}</span>
            </button>
          </div>

          <div style={{
            background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '10px',
            padding: '12px 14px', fontSize: '0.83rem', color: '#92400e', lineHeight: 1.5, marginBottom: '24px'
          }}>
            <i className="bi bi-shield-exclamation" style={{ marginRight: '6px', color: '#d97706' }}></i>
            <b>Lưu ý quan trọng:</b> Khi dùng mật khẩu tạm thời này để đăng nhập, hệ thống sẽ <b>bắt buộc bạn phải đổi sang mật khẩu cá nhân mới</b> trước khi truy cập ứng dụng.
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={handleGoToLogin}
              className="btn-action-primary"
              style={{ flex: 1, padding: '12px' }}
            >
              <span>Đăng nhập ngay</span>
              <i className="bi bi-box-arrow-in-right"></i>
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '12px 18px', borderRadius: '12px', border: '1px solid #cbd5e1',
                background: '#ffffff', color: '#475569', fontWeight: 700, cursor: 'pointer'
              }}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
