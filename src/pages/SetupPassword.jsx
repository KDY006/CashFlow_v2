import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export default function SetupPassword() {
  const { currentUser, setupPassword } = useAuth();
  const { showToast } = useData();
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      showToast('Mật khẩu mới phải có ít nhất 6 ký tự!', false);
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Mật khẩu xác nhận không trùng khớp!', false);
      return;
    }

    const res = setupPassword(oldPassword, newPassword);
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
        maxWidth: '440px', width: '100%', padding: '40px 36px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#ffffff', fontSize: '1.2rem'
          }}>
            <i className="bi bi-shield-lock-fill"></i>
          </div>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }}>CashFlow</span>
        </div>

        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
          Kích hoạt & Đổi mật khẩu
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '24px' }}>
          Chào mừng <b>{currentUser?.full_name}</b>. Để bảo mật tài khoản, vui lòng thiết lập mật khẩu cá nhân mới cho lần đăng nhập đầu tiên.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group-field">
            <label className="form-label-custom">MẬT KHẨU TẠM THỜI (TỪ EMAIL)</label>
            <input
              type="password"
              className="input-custom"
              placeholder="Nhập 123456..."
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group-field">
            <label className="form-label-custom">MẬT KHẨU MỚI</label>
            <input
              type="password"
              className="input-custom"
              placeholder="Tối thiểu 6 ký tự..."
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group-field" style={{ marginBottom: '28px' }}>
            <label className="form-label-custom">XÁC NHẬN MẬT KHẨU MỚI</label>
            <input
              type="password"
              className="input-custom"
              placeholder="Nhập lại mật khẩu mới..."
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-action-primary">
            <span>Xác nhận & Vào Dashboard</span>
            <i className="bi bi-arrow-right"></i>
          </button>
        </form>
      </div>
    </div>
  );
}
