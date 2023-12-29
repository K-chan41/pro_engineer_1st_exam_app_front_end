'use client';

import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: null,
    isAuthenticated: false,
    user: null,
  });

  // アクセストークンを設定する関数
  const login = (token, user) => {
    setAuth({ token, isAuthenticated: true, user }); // ユーザー情報を状態に追加
    localStorage.setItem('token', token);
    // トークンをLocalStorageに保存
    localStorage.setItem('token', token);
  };

  // ログアウトする関数
  const logout = () => {
    setAuth({ token: null, isAuthenticated: false });
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
