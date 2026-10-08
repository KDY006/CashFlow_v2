import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export default function Register() {
  const { register, currentUser } = useAuth();
  const { showToast } = useData();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!agreeTerms) {
      showToast('Vui lòng đồng ý với điều khoản sử dụng!', false);
      return;
    }

    if (password.length < 6) {
      showToast('Mật khẩu phải có ít nhất 6 ký tự!', false);
      return;
    }

    if (password !== confirmPassword) {
      showToast('Mật khẩu xác nhận không trùng khớp!', false);
      return;
    }

    const res = register(fullName, email, password);
    showToast(res.message, res.status);
    if (res.status) {
      navigate('/dashboard');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: '#0f1117', padding: '24px'
    }}>
      <div style={{
        background: '#ffffff', borderRadius: '24px',
        maxWidth: '460px', width: '100%', padding: '40px 36px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
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
          Bắt đầu hành trình quản lý tài chính thông minh theo thời gian thực
        </p>

        {currentUser && (
          <div style={{
            background: '#f0fdf4', border: '1px solid #bbf7d0',
            borderRadius: '12px', padding: '10px 14px', marginBottom: '18px',
            fontSize: '0.82rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '8px'
          }}>
            <i className="bi bi-info-circle-fill"></i>
            <span>Đang đăng nhập bằng <b>{currentUser.full_name}</b>. Tạo tài khoản mới sẽ tự động chuyển đổi sang tài khoản mới.</span>
          </div>
        )}

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

          <div className="form-group-field">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label className="form-label-custom" style={{ margin: 0 }}>MẬT KHẨU</label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  background: 'none', border: 'none', color: '#64748b',
                  fontSize: '0.78rem', cursor: 'pointer', padding: 0
                }}
              >
                {showPassword ? 'Ẩn' : 'Hiện'} mật khẩu
              </button>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              className="input-custom"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tối thiểu 6 ký tự..."
              required
              minLength={6}
            />
          </div>

          <div className="form-group-field">
            <label className="form-label-custom">XÁC NHẬN MẬT KHẨU</label>
            <input
              type={showPassword ? 'text' : 'password'}
              className="input-custom"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu..."
              required
              minLength={6}
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
            <span>Đăng ký & Bắt đầu ngay</span>
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
