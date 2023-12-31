'use client';

import React, { Dispatch, SetStateAction, createContext, useContext, useState, useEffect } from 'react';

// AuthContext の型定義
interface AuthContextType {
  auth: { token: string | null; isAuthenticated: boolean; user: any };
  setAuth: Dispatch<SetStateAction<{ token: string | null; isAuthenticated: boolean; user: any }>>;
  login: (token: string, user: any) => void;
  logout: () => void;
}

// AuthContext のデフォルト値を適切なオブジェクトで定義
const defaultAuthContextValue: AuthContextType = {
  auth: { token: null, isAuthenticated: false, user: null },
  setAuth: () => {},
  login: () => {},
  logout: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthContextValue);

async function fetchUserInfo(token: string) {
  try {
    const response = await fetch('http://localhost:4000/api/v1/user_info', {
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error('ユーザー情報の取得に失敗しました');
    }
    const data = await response.json();
    return data; // ユーザー情報を返す
  } catch (error) {
    console.error('エラー:', error);
    return null;
  }
}

const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const { setAuth } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserInfo(token).then(userInfo => {
        if (userInfo) {
          setAuth({ token, isAuthenticated: true, user: userInfo });
        }
      });
    }
  }, [setAuth]);

  return children;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<{ token: string | null; isAuthenticated: boolean; user: any }>({
    token: null,
    isAuthenticated: false,
    user: null,
  });

  const login = (token: string, user: any) => {
    setAuth({ token, isAuthenticated: true, user }); // 'user' プロパティを使用
    localStorage.setItem('token', token);
    console.log(token, user);
  };

  // ログアウトする関数
  const logout = async () => {
    const token = localStorage.getItem('token'); // トークンをローカルストレージから取得
    if (token) {
      await fetch('http://localhost:4000/api/v1/authentication', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    }
    
    // ローカルストレージからトークンを削除し、アプリ状態を更新
    setAuth({ token: null, isAuthenticated: false, user: null });
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, login, logout }}>
      <AuthInitializer>{children}</AuthInitializer>
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
