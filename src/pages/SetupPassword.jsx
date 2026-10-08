import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export default function SetupPassword() {
  const { currentUser, setupPassword, lastSentEmail } = useAuth();
  const { showToast } = useData();
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      showToast('Vui lòng đăng nhập bằng mật khẩu tạm thời từ email!', false);
      navigate('/login');
    } else if (currentUser.is_first_login !== 1) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

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

  if (!currentUser) return null;

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
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
          Thiết lập mật khẩu mới 🔐
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '20px', lineHeight: 1.5 }}>
          Chào mừng <b>{currentUser?.full_name}</b>! Để bảo mật tài khoản, bạn <b>bắt buộc phải đổi sang mật khẩu cá nhân mới</b> cho lần đăng nhập đầu tiên.
        </p>

        {lastSentEmail?.to === currentUser?.email && (
          <div style={{
            background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '12px',
            padding: '10px 14px', marginBottom: '18px', fontSize: '0.82rem',
            color: '#065f46', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <span>Mật khẩu từ thư gửi gần nhất: <b style={{ fontFamily: 'monospace' }}>{lastSentEmail.tempPassword}</b></span>
            <button
              type="button"
              onClick={() => setOldPassword(lastSentEmail.tempPassword)}
              style={{
                background: '#10b981', color: '#fff', border: 'none',
                borderRadius: '6px', padding: '3px 8px', fontSize: '0.72rem',
                fontWeight: 700, cursor: 'pointer'
              }}
            >
              Tự điền
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Mật khẩu tạm thời */}
          <div className="form-group-field">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label className="form-label-custom" style={{ margin: 0, color: '#dc2626' }}>
                MẬT KHẨU TẠM THỜI (TỪ EMAIL)
              </label>
              <button
                type="button"
                onClick={() => setShowOldPass(!showOldPass)}
                style={{
                  background: 'none', border: 'none', color: '#64748b',
                  fontSize: '0.78rem', cursor: 'pointer', padding: 0
                }}
              >
                {showOldPass ? 'Ẩn' : 'Hiện'}
              </button>
            </div>
            <input
              type={showOldPass ? 'text' : 'password'}
              className="input-custom"
              placeholder="Nhập mã từ email..."
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              autoFocus
            />
          </div>

          {/* Mật khẩu mới */}
          <div className="form-group-field">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label className="form-label-custom" style={{ margin: 0 }}>MẬT KHẨU MỚI</label>
              <button
                type="button"
                onClick={() => setShowNewPass(!showNewPass)}
                style={{
                  background: 'none', border: 'none', color: '#64748b',
                  fontSize: '0.78rem', cursor: 'pointer', padding: 0
                }}
              >
                {showNewPass ? 'Ẩn' : 'Hiện'}
              </button>
            </div>
            <input
              type={showNewPass ? 'text' : 'password'}
              className="input-custom"
              placeholder="Tối thiểu 6 ký tự..."
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          {/* Xác nhận mật khẩu mới */}
          <div className="form-group-field" style={{ marginBottom: '28px' }}>
            <label className="form-label-custom">XÁC NHẬN MẬT KHẨU MỚI</label>
            <input
              type={showNewPass ? 'text' : 'password'}
              className="input-custom"
              placeholder="Nhập lại mật khẩu mới..."
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button type="submit" className="btn-action-primary">
            <span>Xác nhận & Vào Bảng Điều Khiển</span>
            <i className="bi bi-arrow-right"></i>
          </button>
        </form>
      </div>
    </div>
  );
}
