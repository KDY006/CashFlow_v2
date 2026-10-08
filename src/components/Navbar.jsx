import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export default function Navbar({ onOpenAddModal }) {
  const { currentUser, logout, switchDemoAccount } = useAuth();
  const { resetToDemoData } = useData();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { to: '/dashboard', icon: 'bi-house-door-fill', label: 'Tổng quan' },
    { to: '/calendar', icon: 'bi-calendar3', label: 'Lịch tháng' },
    { to: '/transactions', icon: 'bi-cash-stack', label: 'Giao dịch' },
    { to: '/budgets', icon: 'bi-bullseye', label: 'Danh mục & Ngân sách' },
    { to: '/ai', icon: 'bi-robot', label: 'Cố vấn AI' }
  ];

  const avatarSrc = currentUser?.avatar_url 
    ? currentUser.avatar_url 
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.full_name || 'Khách')}&background=10b981&color=fff`;

  return (
    <header className="app-navbar">
      <div className="nav-container">
        {/* Brand Logo */}
        <NavLink to="/dashboard" className="brand-link">
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'var(--primary-gradient)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#ffffff', fontSize: '1.2rem', boxShadow: 'var(--primary-glow)'
          }}>
            <i className="bi bi-wallet2"></i>
          </div>
          <span className="brand-title-accent">CashFlow</span>
        </NavLink>

        {/* Desktop Links */}
        <nav className="desktop-nav-links">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-item-btn ${isActive ? 'active' : ''}`}
            >
              <i className={`bi ${item.icon}`}></i>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Actions & User Menu */}
        <div className="nav-right-actions">
          <button 
            type="button" 
            className="btn-add-global"
            onClick={onOpenAddModal}
            title="Thêm giao dịch mới"
          >
            <i className="bi bi-plus-lg"></i>
            <span style={{ display: 'none' }} className="d-lg-inline">Thêm giao dịch</span>
          </button>

          {/* User dropdown */}
          <div className="user-dropdown-wrapper" style={{ position: 'relative' }} ref={dropdownRef}>
            <button 
              type="button" 
              className="user-menu-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <img src={avatarSrc} alt="Avatar" className="header-avatar-img" />
              <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>
                {currentUser?.full_name || 'Tài khoản'}
              </span>
              <i className="bi bi-chevron-down" style={{ fontSize: '0.75rem', color: '#64748b' }}></i>
            </button>

            {dropdownOpen && (
              <div className="user-dropdown-panel">
                <div style={{ padding: '8px 12px 10px', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{currentUser?.full_name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', wordBreak: 'break-all' }}>{currentUser?.email}</div>
                </div>

                <div style={{ padding: '4px 0' }}>
                  <button 
                    type="button" 
                    className="dropdown-link"
                    onClick={() => { setDropdownOpen(false); navigate('/profile'); }}
                  >
                    <i className="bi bi-person-circle" style={{ color: '#3b82f6' }}></i>
                    <span>Hồ sơ cá nhân</span>
                  </button>

                  <button 
                    type="button" 
                    className="dropdown-link"
                    onClick={() => {
                      setDropdownOpen(false);
                      const targetEmail = currentUser?.email === 'nvduy180706@gmail.com' ? 'kdyforwork@gmail.com' : 'nvduy180706@gmail.com';
                      switchDemoAccount(targetEmail);
                    }}
                    title="Chuyển đổi giữa 2 tài khoản demo của đồ án"
                  >
                    <i className="bi bi-arrow-left-right" style={{ color: '#8b5cf6' }}></i>
                    <span>Đổi tài khoản demo</span>
                  </button>

                  <button 
                    type="button" 
                    className="dropdown-link"
                    onClick={() => { setDropdownOpen(false); resetToDemoData(); }}
                    title="Khôi phục số liệu gốc theo đồ án"
                  >
                    <i className="bi bi-arrow-clockwise" style={{ color: '#10b981' }}></i>
                    <span>Nạp lại Data mẫu</span>
                  </button>

                  <div style={{ height: '1px', background: '#f1f5f9', margin: '4px 0' }}></div>

                  <button 
                    type="button" 
                    className="dropdown-link text-danger"
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                      navigate('/login');
                    }}
                  >
                    <i className="bi bi-box-arrow-right"></i>
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
