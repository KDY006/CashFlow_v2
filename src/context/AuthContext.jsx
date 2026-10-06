import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USERS } from '../data/seedData';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('cashflow_users');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const savedCurrent = localStorage.getItem('cashflow_current_user');
    if (savedCurrent) {
      try { return JSON.parse(savedCurrent); } catch (e) {}
    }
    // Mặc định đăng nhập tài khoản chính để trải nghiệm ngay lập tức
    return INITIAL_USERS[0];
  });

  useEffect(() => {
    localStorage.setItem('cashflow_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('cashflow_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('cashflow_current_user');
    }
  }, [currentUser]);

  const login = (email, password) => {
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      return { status: false, message: 'Tài khoản email này chưa được đăng ký trong hệ thống!' };
    }
    if (found.password !== password) {
      return { status: false, message: 'Mật khẩu đăng nhập không chính xác.' };
    }
    setCurrentUser(found);
    return { status: true, message: 'Đăng nhập thành công!', user: found };
  };

  const register = (fullName, email) => {
    const exist = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (exist) {
      return { status: false, message: 'Địa chỉ email này đã tồn tại trong hệ thống.' };
    }
    const newUser = {
      id: Date.now(),
      full_name: fullName.trim(),
      email: email.trim().toLowerCase(),
      avatar_url: '',
      password: '123456', // Mật khẩu mặc định gửi qua email
      is_first_login: 1,
      created_at: new Date().toISOString()
    };
    setUsers(prev => [...prev, newUser]);
    return { status: true, message: 'Đăng ký thành công! Mật khẩu mặc định là 123456.' };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateProfile = ({ fullName, avatarUrl }) => {
    if (!currentUser) return { status: false, message: 'Chưa đăng nhập' };
    const updated = {
      ...currentUser,
      full_name: fullName.trim(),
      avatar_url: avatarUrl !== undefined ? avatarUrl : currentUser.avatar_url
    };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u));
    return { status: true, message: 'Cập nhật thông tin hồ sơ thành công!' };
  };

  const changePassword = (oldPassword, newPassword) => {
    if (!currentUser) return { status: false, message: 'Chưa đăng nhập' };
    if (currentUser.password !== oldPassword) {
      return { status: false, message: 'Mật khẩu hiện tại không đúng!' };
    }
    const updated = { ...currentUser, password: newPassword, is_first_login: 0 };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u));
    return { status: true, message: 'Đổi mật khẩu thành công!' };
  };

  const setupPassword = (oldPassword, newPassword) => {
    return changePassword(oldPassword, newPassword);
  };

  const deleteAccount = (password) => {
    if (!currentUser) return { status: false, message: 'Chưa đăng nhập' };
    if (currentUser.password !== password) {
      return { status: false, message: 'Mật khẩu xác nhận không đúng!' };
    }
    setUsers(prev => prev.filter(u => u.id !== currentUser.id));
    setCurrentUser(null);
    return { status: true, message: 'Tài khoản đã được xóa vĩnh viễn.' };
  };

  const switchDemoAccount = (email) => {
    const u = users.find(x => x.email === email);
    if (u) setCurrentUser(u);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      users,
      login,
      register,
      logout,
      updateProfile,
      changePassword,
      setupPassword,
      deleteAccount,
      switchDemoAccount
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
