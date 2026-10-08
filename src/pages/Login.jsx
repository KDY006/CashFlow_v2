import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import EmailModal from '../components/EmailModal';

export default function Login() {
  const { login, lastSentEmail } = useAuth();
  const { showToast } = useData();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(() => location.state?.email || 'nvduy180706@gmail.com');
  const [password, setPassword] = useState(() => location.state?.password || '123456');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [showEmailModal, setShowEmailModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const res = login(email, password);
    showToast(res.message, res.status);
    if (res.status) {
      if (res.user?.is_first_login === 1) {
        navigate('/setup-password');
      } else {
        navigate('/dashboard');
      }
    }
  };

  const fillDemoAccount = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexWrap: 'wrap',
      backgroundColor: '#0f1117', color: '#e2e8f0'
    }}>
      {/* Left Hero (Dark Brand Showcase) */}
      <div style={{
        flex: '1 1 500px', minHeight: '360px',
        padding: '60px 48px',
        background: 'linear-gradient(135deg, #0f1117 0%, #1a1f2e 50%, #0d1829 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* Glow Effects */}
        <div style={{
          position: 'absolute', width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
          top: '-100px', left: '-100px', pointerEvents: 'none'
        }}></div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '480px' }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '40px' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '14px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.35)'
            }}>
              <i className="bi bi-wallet2" style={{ fontSize: '1.4rem', color: '#ffffff' }}></i>
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.5px' }}>
              CashFlow
            </span>
          </div>

          <h1 style={{
            fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.2,
            color: '#f8fafc', letterSpacing: '-1px', marginBottom: '16px'
          }}>
            Làm chủ <span style={{ color: '#10b981' }}>Tài chính</span><br />
            với Trí tuệ Nhân tạo
          </h1>

          <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1.7, marginBottom: '36px' }}>
            Hệ thống quản lý chi tiêu thông minh, lập hũ ngân sách, theo dõi lịch thu chi và nhận lời khuyên tài chính cá nhân hóa từ AI.
          </p>

          {/* Feature Highlights */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '10px',
                background: 'rgba(16, 185, 129, 0.15)', color: '#10b981',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700
              }}>
                <i className="bi bi-robot"></i>
              </div>
              <span style={{ fontSize: '0.92rem', color: '#cbd5e1', fontWeight: 500 }}>
                Cố vấn tài chính Gemini AI phân tích dòng tiền chuyên sâu
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '10px',
                background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700
              }}>
                <i className="bi bi-magic"></i>
              </div>
              <span style={{ fontSize: '0.92rem', color: '#cbd5e1', fontWeight: 500 }}>
                Trích xuất giao dịch siêu tốc bằng câu nói tự nhiên
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '10px',
                background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700
              }}>
                <i className="bi bi-safe2"></i>
              </div>
              <span style={{ fontSize: '0.92rem', color: '#cbd5e1', fontWeight: 500 }}>
                Kiểm soát ngân sách thông minh và cảnh báo vượt hạn mức
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form (Clean White Container) */}
      <div style={{
        flex: '1 1 420px', background: '#ffffff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '48px 36px', color: '#0f172a'
      }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
              Đăng nhập
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
              Chào mừng trở lại với bảng điều khiển tài chính
            </p>
          </div>

          {/* Quick Demo Credentials Buttons */}
          <div style={{
            background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px',
            padding: '12px 14px', marginBottom: '20px'
          }}>
            <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
              Tài khoản mẫu dùng thử ngay:
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => fillDemoAccount('nvduy180706@gmail.com', '123456')}
                style={{
                  flex: 1, padding: '6px 10px', borderRadius: '8px',
                  border: '1px solid #10b981', background: '#ecfdf5',
                  color: '#059669', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer'
                }}
              >
                👤 Duy (Chính)
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('kdyforwork@gmail.com', '123456')}
                style={{
                  flex: 1, padding: '6px 10px', borderRadius: '8px',
                  border: '1px solid #cbd5e1', background: '#ffffff',
                  color: '#475569', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer'
                }}
              >
                👤 Quý (Phụ)
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
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

            <div className="form-group-field" style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label className="form-label-custom" style={{ margin: 0 }}>MẬT KHẨU</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      background: 'none', border: 'none', color: '#64748b',
                      fontSize: '0.78rem', cursor: 'pointer', padding: 0
                    }}
                  >
                    {showPassword ? 'Ẩn' : 'Hiện'}
                  </button>
                  <NavLink to="/forgot-password" style={{ fontSize: '0.78rem', fontWeight: 600, color: '#10b981' }}>
                    Quên mật khẩu?
                  </NavLink>
                </div>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                className="input-custom"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu..."
                required
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
              <input
                type="checkbox"
                id="rememberMe"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: '#10b981', cursor: 'pointer' }}
              />
              <label htmlFor="rememberMe" style={{ fontSize: '0.85rem', color: '#64748b', cursor: 'pointer' }}>
                Ghi nhớ đăng nhập
              </label>
            </div>

            <button type="submit" className="btn-action-primary" style={{ marginBottom: '20px' }}>
              <span>Đăng nhập ngay</span>
              <i className="bi bi-arrow-right"></i>
            </button>
          </form>

          {/* Email Notification Alert if an email was recently sent */}
          {lastSentEmail && (
            <div style={{
              background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '12px',
              padding: '10px 14px', marginBottom: '16px', display: 'flex',
              alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#065f46' }}>
                <i className="bi bi-envelope-check-fill" style={{ color: '#10b981', fontSize: '1rem' }}></i>
                <span>Thư gửi mật khẩu tới: <b>{lastSentEmail.to}</b></span>
              </div>
              <button
                type="button"
                onClick={() => setShowEmailModal(true)}
                style={{
                  background: '#10b981', color: '#ffffff', border: 'none',
                  borderRadius: '6px', padding: '4px 10px', fontWeight: 700,
                  fontSize: '0.75rem', cursor: 'pointer'
                }}
              >
                Mở hòm thư
              </button>
            </div>
          )}

          {location.state?.fromEmail && (
            <div style={{
              background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px',
              padding: '10px 14px', marginBottom: '16px', fontSize: '0.82rem',
              color: '#1d4ed8', lineHeight: 1.4
            }}>
              <i className="bi bi-info-circle-fill" style={{ marginRight: '6px' }}></i>
              Đã điền sẵn mật khẩu tạm thời từ email. Nhấn <b>Đăng nhập ngay</b> để sang bước thiết lập mật khẩu mới.
            </div>
          )}

          <div style={{ textAlign: 'center', fontSize: '0.88rem', color: '#64748b' }}>
            Chưa có tài khoản?{' '}
            <NavLink to="/register" style={{ fontWeight: 700, color: '#10b981' }}>
              Đăng ký ngay
            </NavLink>
          </div>
        </div>
      </div>

      <EmailModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        emailData={lastSentEmail}
      />
    </div>
  );
}
