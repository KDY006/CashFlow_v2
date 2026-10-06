import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export default function Register() {
  const { register } = useAuth();
  const { showToast } = useData();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreeTerms) {
      showToast('Vui lòng đồng ý với điều khoản sử dụng!', false);
      return;
    }
    const res = register(fullName, email);
    showToast(res.message, res.status);
    if (res.status) {
      navigate('/login');
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
        {/* Brand */}
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
          Tạo tài khoản mới
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '24px' }}>
          Bắt đầu hành trình quản lý tài chính thông minh ngay hôm nay
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group-field">
            <label className="form-label-custom">HỌ VÀ TÊN</label>
            <input
              type="text"
              className="input-custom"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nguyễn Văn A"
              required
            />
          </div>

          <div className="form-group-field">
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

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '24px' }}>
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: '#10b981', marginTop: '3px', cursor: 'pointer' }}
            />
            <label htmlFor="terms" style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.4, cursor: 'pointer' }}>
              Tôi đồng ý với các Điều khoản dịch vụ và Chính sách bảo mật của CashFlow.
            </label>
          </div>

          <button type="submit" className="btn-action-primary" style={{ marginBottom: '20px' }}>
            <span>Đăng ký tài khoản</span>
            <i className="bi bi-arrow-right"></i>
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '0.88rem', color: '#64748b' }}>
          Đã có tài khoản?{' '}
          <NavLink to="/login" style={{ fontWeight: 700, color: '#10b981' }}>
            Đăng nhập
          </NavLink>
        </div>
      </div>
    </div>
  );
}
