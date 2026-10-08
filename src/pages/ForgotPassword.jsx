import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import EmailModal from '../components/EmailModal';

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const { showToast } = useData();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [sentEmailData, setSentEmailData] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const res = forgotPassword(email);
    showToast(res.message, res.status);
    if (res.status) {
      setSentEmailData(res.emailMessage);
      setShowEmailModal(true);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: '#0f1117', padding: '24px'
    }}>
      <div style={{
        background: '#ffffff', borderRadius: '24px',
        maxWidth: '440px', width: '100%', padding: '40px 36px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#ffffff', fontSize: '1.2rem'
          }}>
            <i className="bi bi-wallet2"></i>
          </div>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }}>CashFlow</span>
        </div>

        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
          Quên mật khẩu?
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '24px' }}>
          Nhập địa chỉ email đăng ký để nhận mật khẩu tạm thời ngẫu nhiên qua email.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group-field" style={{ marginBottom: '20px' }}>
            <label className="form-label-custom">ĐỊA CHỈ EMAIL</label>
            <input
              type="email"
              className="input-custom"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
            />
          </div>

          <div style={{
            background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px',
            padding: '12px', marginBottom: '24px', fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5
          }}>
            <i className="bi bi-info-circle" style={{ marginRight: '6px', color: '#3b82f6' }}></i>
            Hệ thống sẽ cấp lại một mật khẩu tạm thời ngẫu nhiên và gửi tới hòm thư của bạn. Bạn sẽ đăng nhập và thiết lập lại mật khẩu mới.
          </div>

          <button type="submit" className="btn-action-primary" style={{ marginBottom: '20px' }}>
            <span>Gửi mật khẩu qua Email</span>
            <i className="bi bi-send"></i>
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '0.88rem', color: '#64748b' }}>
          Nhớ lại mật khẩu?{' '}
          <NavLink to="/login" style={{ fontWeight: 700, color: '#10b981' }}>
            Đăng nhập ngay
          </NavLink>
        </div>
      </div>

      <EmailModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        emailData={sentEmailData}
      />
    </div>
  );
}
