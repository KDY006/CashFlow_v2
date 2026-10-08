import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USERS, generateRandomTempPassword } from '../data/seedData';

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

  // Lưu trữ email giả lập vừa được gửi (để hiển thị hòm thư mô phỏng cho người dùng)
  const [lastSentEmail, setLastSentEmail] = useState(() => {
    const saved = sessionStorage.getItem('cashflow_last_email');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null;
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

  useEffect(() => {
    if (lastSentEmail) {
      sessionStorage.setItem('cashflow_last_email', JSON.stringify(lastSentEmail));
    } else {
      sessionStorage.removeItem('cashflow_last_email');
    }
  }, [lastSentEmail]);

  const login = (email, password) => {
    const found = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!found) {
      return { status: false, message: 'Tài khoản email này chưa được đăng ký trong hệ thống!' };
    }
    if (found.password !== password) {
      return { status: false, message: 'Mật khẩu đăng nhập không chính xác.' };
    }
    setCurrentUser(found);
    return { status: true, message: 'Đăng nhập thành công!', user: found };
  };

  const register = ({ fullName, dob, gender, email }) => {
    const cleanEmail = email.trim().toLowerCase();
    const exist = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (exist) {
      return { status: false, message: 'Địa chỉ email này đã tồn tại trong hệ thống.' };
    }

    // Tạo mật khẩu ngẫu nhiên tạm thời (6 ký tự)
    const tempPassword = generateRandomTempPassword(6);

    const newUser = {
      id: Date.now(),
      full_name: fullName.trim(),
      dob: dob || '',
      gender: gender || 'Nam',
      email: cleanEmail,
      avatar_url: '',
      password: tempPassword,
      is_first_login: 1, // BẮT BUỘC ĐỔI MẬT KHẨU LẦN ĐẦU
      created_at: new Date().toISOString()
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('cashflow_users', JSON.stringify(updatedUsers));

    const emailMsg = {
      to: cleanEmail,
      fullName: fullName.trim(),
      dob: dob || '',
      gender: gender || 'Nam',
      tempPassword,
      type: 'register',
      sentAt: new Date().toLocaleTimeString('vi-VN') + ' ' + new Date().toLocaleDateString('vi-VN')
    };
    setLastSentEmail(emailMsg);

    return { 
      status: true, 
      message: 'Đăng ký thành công! Mật khẩu tạm thời đã được tạo và gửi tới email của bạn.',
      tempPassword,
      user: newUser,
      emailMessage: emailMsg
    };
  };

  const forgotPassword = (email) => {
    const cleanEmail = email.trim().toLowerCase();
    const found = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!found) {
      return { status: false, message: 'Địa chỉ email không tồn tại trong hệ thống!' };
    }

    const tempPassword = generateRandomTempPassword(6);
    const updatedUser = { ...found, password: tempPassword, is_first_login: 1 };
    
    setUsers(prev => prev.map(u => u.id === found.id ? updatedUser : u));
    if (currentUser?.id === found.id) {
      setCurrentUser(updatedUser);
    }

    const emailMsg = {
      to: cleanEmail,
      fullName: found.full_name,
      dob: found.dob || '',
      gender: found.gender || 'Nam',
      tempPassword,
      type: 'forgot_password',
      sentAt: new Date().toLocaleTimeString('vi-VN') + ' ' + new Date().toLocaleDateString('vi-VN')
    };
    setLastSentEmail(emailMsg);

    return {
      status: true,
      message: 'Mật khẩu tạm thời mới đã được gửi tới email của bạn!',
      tempPassword,
      emailMessage: emailMsg
    };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateProfile = ({ fullName, dob, gender, avatarUrl }) => {
    if (!currentUser) return { status: false, message: 'Chưa đăng nhập' };
    const updated = {
      ...currentUser,
      full_name: fullName.trim(),
      dob: dob !== undefined ? dob : currentUser.dob,
      gender: gender !== undefined ? gender : currentUser.gender,
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
    if (!currentUser) return { status: false, message: 'Chưa đăng nhập' };
    if (currentUser.password !== oldPassword) {
      return { status: false, message: 'Mật khẩu tạm thời từ email không chính xác!' };
    }
    const updated = { ...currentUser, password: newPassword, is_first_login: 0 };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u));
    return { status: true, message: 'Thiết lập mật khẩu mới thành công! Chào mừng bạn gia nhập CashFlow.' };
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

  const clearLastSentEmail = () => {
    setLastSentEmail(null);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      users,
      lastSentEmail,
      login,
      register,
      forgotPassword,
      logout,
      updateProfile,
      changePassword,
      setupPassword,
      deleteAccount,
      switchDemoAccount,
      clearLastSentEmail
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
