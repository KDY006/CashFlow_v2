import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export default function ForgotPassword() {
  const { users } = useAuth();
  const { showToast } = useData();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setIsSent(true);
      showToast(`Đã gửi liên kết khôi phục tới ${email}!`);
    } else {
      showToast('Không tìm thấy tài khoản với email này!', false);
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
          Nhập địa chỉ email đăng ký để nhận liên kết đặt lại mật khẩu mới.
        </p>

        {isSent ? (
          <div style={{
            background: '#ecfdf5', border: '1px solid #a7f3d0',
            borderRadius: '16px', padding: '20px', textAlign: 'center', marginBottom: '24px'
          }}>
            <i className="bi bi-check-circle-fill" style={{ fontSize: '2.5rem', color: '#10b981', display: 'block', marginBottom: '8px' }}></i>
            <h4 style={{ fontWeight: 800, color: '#065f46', marginBottom: '4px' }}>Kiểm tra hòm thư của bạn</h4>
            <p style={{ fontSize: '0.82rem', color: '#047857', marginBottom: '16px' }}>
              Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu tới <b>{email}</b>.
            </p>
            <button
              type="button"
              className="btn-action-primary"
              onClick={() => navigate('/login')}
            >
              Quay về Đăng nhập
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group-field" style={{ marginBottom: '24px' }}>
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

            <button type="submit" className="btn-action-primary" style={{ marginBottom: '20px' }}>
              <span>Gửi liên kết khôi phục</span>
              <i className="bi bi-send"></i>
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', fontSize: '0.88rem', color: '#64748b' }}>
          Nhớ lại mật khẩu?{' '}
          <NavLink to="/login" style={{ fontWeight: 700, color: '#10b981' }}>
            Đăng nhập ngay
          </NavLink>
        </div>
      </div>
    </div>
  );
}
