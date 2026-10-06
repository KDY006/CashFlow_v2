import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export default function Profile() {
  const { currentUser, updateProfile, changePassword, deleteAccount } = useAuth();
  const { resetToDemoData, showToast } = useData();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('info'); // 'info' | 'security' | 'advanced'

  // Profile info state
  const [fullName, setFullName] = useState(currentUser?.full_name || '');
  const [avatarPreview, setAvatarPreview] = useState(currentUser?.avatar_url || '');

  // Password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Delete account state
  const [deletePass, setDeletePass] = useState('');

  const handleAvatarFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('Ảnh không được vượt quá 2MB!', false);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      showToast('Vui lòng nhập họ và tên!', false);
      return;
    }
    const res = updateProfile({ fullName, avatarUrl: avatarPreview });
    showToast(res.message, res.status);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      showToast('Mật khẩu mới phải có ít nhất 6 ký tự!', false);
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Mật khẩu xác nhận không khớp!', false);
      return;
    }
    const res = changePassword(oldPassword, newPassword);
    showToast(res.message, res.status);
    if (res.status) {
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const handleDeleteAccount = (e) => {
    e.preventDefault();
    if (window.confirm('CẢNH BÁO: Hành động này sẽ xóa vĩnh viễn tài khoản và toàn bộ dữ liệu của bạn. Bạn có chắc không?')) {
      const res = deleteAccount(deletePass);
      showToast(res.message, res.status);
      if (res.status) {
        navigate('/login');
      }
    }
  };

  const displayAvatar = avatarPreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || 'User')}&background=10b981&color=fff&size=256`;

  return (
    <div className="main-content-container">
      <div className="page-header-row">
        <h2 className="page-title">
          <i className="bi bi-person-badge text-primary"></i>
          <span>Hồ Sơ Cá Nhân</span>
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {/* Left Side: User Card */}
        <div className="card-box" style={{ textAlign: 'center', padding: '36px 20px', height: 'fit-content' }}>
          <div style={{ position: 'relative', width: '130px', height: '130px', margin: '0 auto 20px' }}>
            <img
              src={displayAvatar}
              alt="Avatar"
              style={{
                width: '100%', height: '100%', borderRadius: '50%',
                objectFit: 'cover', border: '4px solid #ffffff',
                boxShadow: '0 8px 20px rgba(0,0,0,0.08)'
              }}
            />
            <div style={{
              position: 'absolute', bottom: '4px', right: '4px',
              width: '30px', height: '30px', borderRadius: '50%',
              backgroundColor: '#10b981', color: '#ffffff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid #ffffff', fontSize: '0.9rem'
            }}>
              <i className="bi bi-check-lg"></i>
            </div>
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
            {currentUser?.full_name}
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '24px' }}>
            {currentUser?.email}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 14px', borderRadius: '12px', background: '#f8fafc'
            }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b' }}>VAI TRÒ</span>
              <span style={{
                fontSize: '0.75rem', fontWeight: 700, padding: '2px 10px',
                borderRadius: '12px', backgroundColor: '#eff6ff', color: '#2563eb'
              }}>
                Hội viên VIP
              </span>
            </div>

            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 14px', borderRadius: '12px', background: '#f8fafc'
            }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b' }}>NGÀY THAM GIA</span>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b' }}>
                {currentUser?.created_at?.slice(0, 10) || '28/04/2026'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Tab Forms */}
        <div className="card-box" style={{ padding: '24px' }}>
          {/* Subtabs */}
          <div className="pill-tab-group" style={{ marginBottom: '24px' }}>
            <button
              type="button"
              className={`pill-tab-btn ${activeTab === 'info' ? 'active' : ''}`}
              onClick={() => setActiveTab('info')}
            >
              <i className="bi bi-card-text"></i>
              <span>Thông tin cá nhân</span>
            </button>
            <button
              type="button"
              className={`pill-tab-btn ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <i className="bi bi-shield-lock-fill"></i>
              <span>Đổi mật khẩu</span>
            </button>
            <button
              type="button"
              className={`pill-tab-btn ${activeTab === 'advanced' ? 'active' : ''}`}
              onClick={() => setActiveTab('advanced')}
              style={{ color: activeTab === 'advanced' ? '#dc2626' : undefined }}
            >
              <i className="bi bi-gear-fill"></i>
              <span>Nâng cao</span>
            </button>
          </div>

          {/* TAB 1: INFO */}
          {activeTab === 'info' && (
            <form onSubmit={handleUpdateProfile}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <label style={{ cursor: 'pointer', display: 'inline-block' }}>
                  <img
                    src={displayAvatar}
                    alt="Preview"
                    style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #e2e8f0' }}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarFile}
                    style={{ display: 'none' }}
                  />
                  <div style={{ fontSize: '0.8rem', color: '#3b82f6', fontWeight: 600, marginTop: '6px' }}>
                    <i className="bi bi-camera-fill" style={{ marginRight: '4px' }}></i>
                    Thay đổi ảnh đại diện
                  </div>
                </label>
              </div>

              <div className="form-group-field">
                <label className="form-label-custom">ĐỊA CHỈ EMAIL</label>
                <input
                  type="email"
                  className="input-custom"
                  value={currentUser?.email || ''}
                  disabled
                  style={{ opacity: 0.7, cursor: 'not-allowed' }}
                />
                <span style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '4px', display: 'block' }}>
                  Email dùng để định danh đăng nhập, không thể thay đổi.
                </span>
              </div>

              <div className="form-group-field" style={{ marginBottom: '28px' }}>
                <label className="form-label-custom">HỌ VÀ TÊN</label>
                <input
                  type="text"
                  className="input-custom"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-action-primary">
                <span>Cập nhật thông tin</span>
              </button>
            </form>
          )}

          {/* TAB 2: CHANGE PASSWORD */}
          {activeTab === 'security' && (
            <form onSubmit={handleChangePassword}>
              <div className="form-group-field">
                <label className="form-label-custom">MẬT KHẨU HIỆN TẠI</label>
                <input
                  type="password"
                  className="input-custom"
                  placeholder="Nhập mật khẩu cũ (VD: 123456)..."
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
                <span>Lưu mật khẩu mới</span>
              </button>
            </form>
          )}

          {/* TAB 3: ADVANCED */}
          {activeTab === 'advanced' && (
            <div>
              <div style={{
                padding: '16px', borderRadius: '14px', background: '#ecfdf5',
                border: '1px solid #a7f3d0', marginBottom: '24px'
              }}>
                <h4 style={{ fontWeight: 800, fontSize: '0.95rem', color: '#065f46', marginBottom: '4px' }}>
                  <i className="bi bi-arrow-clockwise" style={{ marginRight: '6px' }}></i>
                  Khôi phục dữ liệu mẫu
                </h4>
                <p style={{ fontSize: '0.82rem', color: '#047857', marginBottom: '12px' }}>
                  Nạp lại toàn bộ giao dịch, hũ ngân sách và các câu phân tích AI theo đúng báo cáo đồ án gốc.
                </p>
                <button
                  type="button"
                  className="btn-action-primary"
                  style={{ width: 'auto', padding: '8px 20px', fontSize: '0.85rem' }}
                  onClick={resetToDemoData}
                >
                  Nạp lại Data mẫu
                </button>
              </div>

              <div style={{
                padding: '16px', borderRadius: '14px', background: '#fef2f2',
                border: '1px solid #fecaca'
              }}>
                <h4 style={{ fontWeight: 800, fontSize: '0.95rem', color: '#991b1b', marginBottom: '4px' }}>
                  <i className="bi bi-exclamation-triangle-fill" style={{ marginRight: '6px' }}></i>
                  Khu vực nguy hiểm: Xóa tài khoản
                </h4>
                <p style={{ fontSize: '0.82rem', color: '#b91c1c', marginBottom: '12px' }}>
                  Thao tác này sẽ xóa toàn bộ lịch sử chi tiêu của bạn khỏi trình duyệt.
                </p>

                <form onSubmit={handleDeleteAccount}>
                  <div className="form-group-field" style={{ marginBottom: '12px' }}>
                    <input
                      type="password"
                      className="input-custom"
                      placeholder="Nhập mật khẩu xác nhận..."
                      value={deletePass}
                      onChange={(e) => setDeletePass(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-action-primary"
                    style={{ background: '#dc2626', width: 'auto', padding: '8px 20px', fontSize: '0.85rem' }}
                  >
                    Xóa tài khoản vĩnh viễn
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
