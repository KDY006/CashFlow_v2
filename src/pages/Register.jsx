import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import EmailModal from '../components/EmailModal';

export default function Register() {
  const { register } = useAuth();
  const { showToast } = useData();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Nam');
  const [email, setEmail] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Email simulation modal state
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [sentEmailData, setSentEmailData] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!agreeTerms) {
      showToast('Vui lòng đồng ý với điều khoản sử dụng!', false);
      return;
    }

    if (!dob) {
      showToast('Vui lòng chọn ngày tháng năm sinh!', false);
      return;
    }

    const res = register({ fullName, dob, gender, email });
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
        maxWidth: '480px', width: '100%', padding: '36px 32px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
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

        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
          Đăng ký tài khoản
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.86rem', marginBottom: '22px' }}>
          Nhập thông tin cá nhân. Mật khẩu tạm thời sẽ được tạo ngẫu nhiên và gửi qua email.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Họ và tên */}
          <div className="form-group-field" style={{ marginBottom: '14px' }}>
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

          {/* Ngày sinh & Giới tính cùng một hàng */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div className="form-group-field" style={{ margin: 0 }}>
              <label className="form-label-custom">NGÀY SINH</label>
              <input
                type="date"
                className="input-custom"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
              />
            </div>

            <div className="form-group-field" style={{ margin: 0 }}>
              <label className="form-label-custom">GIỚI TÍNH</label>
              <select
                className="input-custom"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                style={{ cursor: 'pointer' }}
                required
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
          </div>

          {/* Email */}
          <div className="form-group-field" style={{ marginBottom: '14px' }}>
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

          {/* Note về mật khẩu ngẫu nhiên qua email */}
          <div style={{
            background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px',
            padding: '12px 14px', marginBottom: '18px', fontSize: '0.82rem', color: '#166534',
            lineHeight: 1.5, display: 'flex', gap: '10px'
          }}>
            <i className="bi bi-shield-lock-fill" style={{ fontSize: '1.1rem', color: '#10b981', flexShrink: 0, marginTop: '2px' }}></i>
            <div>
              <b>Mật khẩu ngẫu nhiên bảo mật:</b> Hệ thống sẽ tự động tạo mật khẩu tạm thời gửi tới Email của bạn. Bạn sẽ đăng nhập bằng mật khẩu này và bắt buộc đổi mật khẩu mới ở lần truy cập đầu tiên.
            </div>
          </div>

          {/* Checkbox điều khoản */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '20px' }}>
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

          <button type="submit" className="btn-action-primary" style={{ marginBottom: '18px' }}>
            <span>Đăng ký & Nhận mật khẩu qua Email</span>
            <i className="bi bi-envelope-check"></i>
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '0.88rem', color: '#64748b' }}>
          Đã có tài khoản?{' '}
          <NavLink to="/login" style={{ fontWeight: 700, color: '#10b981' }}>
            Đăng nhập
          </NavLink>
        </div>
      </div>

      {/* Email Inbox Simulator Modal */}
      <EmailModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        emailData={sentEmailData}
      />
    </div>
  );
}
