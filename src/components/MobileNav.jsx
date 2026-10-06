import React from 'react';
import { NavLink } from 'react-router-dom';

export default function MobileNav({ onOpenAddModal }) {
  const navItems = [
    { to: '/dashboard', icon: 'bi-house-door-fill', label: 'Tổng quan' },
    { to: '/calendar', icon: 'bi-calendar3', label: 'Lịch tháng' },
    { to: '/transactions', icon: 'bi-cash-stack', label: 'Giao dịch' },
    { to: '/budgets', icon: 'bi-bullseye', label: 'Ngân sách' },
    { to: '/ai', icon: 'bi-robot', label: 'Cố vấn AI' }
  ];

  return (
    <nav className="mobile-bottom-nav">
      {/* 2 items bên trái */}
      <NavLink 
        to={navItems[0].to} 
        className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
      >
        <i className={`bi ${navItems[0].icon}`}></i>
        <span>{navItems[0].label}</span>
      </NavLink>

      <NavLink 
        to={navItems[1].to} 
        className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
      >
        <i className={`bi ${navItems[1].icon}`}></i>
        <span>{navItems[1].label}</span>
      </NavLink>

      {/* Floating Action Button ở giữa */}
      <div className="fab-mobile-container">
        <button 
          type="button" 
          className="fab-mobile-btn" 
          onClick={onOpenAddModal}
          title="Thêm giao dịch"
        >
          <i className="bi bi-plus-lg"></i>
        </button>
      </div>

      {/* 3 items bên phải */}
      <NavLink 
        to={navItems[2].to} 
        className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
      >
        <i className={`bi ${navItems[2].icon}`}></i>
        <span>{navItems[2].label}</span>
      </NavLink>

      <NavLink 
        to={navItems[3].to} 
        className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
      >
        <i className={`bi ${navItems[3].icon}`}></i>
        <span>{navItems[3].label}</span>
      </NavLink>

      <NavLink 
        to={navItems[4].to} 
        className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
      >
        <i className={`bi ${navItems[4].icon}`}></i>
        <span>{navItems[4].label}</span>
      </NavLink>
    </nav>
  );
}
