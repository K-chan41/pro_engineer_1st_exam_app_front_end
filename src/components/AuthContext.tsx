'use client';

import React, { Dispatch, SetStateAction, createContext, useContext, useState, useEffect } from 'react';
import { notifications } from '@mantine/notifications';

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
    const response = await fetch('https://pro-engineer-1st-exam-app-api-d4afe40512f5.herokuapp.com/api/v1/user_info', {
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
        // console.log(userInfo);
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
    try {
      const response = await fetch('https://pro-engineer-1st-exam-app-api-d4afe40512f5.herokuapp.com/api/v1/authentication', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // ローカルストレージからトークンを削除し、アプリ状態を更新
        setAuth({ token: null, isAuthenticated: false, user: null });
        localStorage.removeItem('token');
        // ログアウト成功の通知
        notifications.show({
          title: '成功',
          message: 'ログアウトしました',
          color: 'green',
        });
      } else {
        // サーバー側のエラーレスポンスをハンドル
        const errorData = await response.json();
        notifications.show({
          title: '失敗',
          message: errorData.error || 'ログアウトに失敗しました',
          color: 'red',
        });
      }
    } catch (error) {
      // 通信エラーをハンドル
      console.error('エラーが発生しました', error);
      notifications.show({
        title: 'エラー',
        message: '通信エラーが発生しました',
        color: 'red',
      });
    }
  }
};

  return (
    <AuthContext.Provider value={{ auth, setAuth, login, logout }}>
      <AuthInitializer>{children}</AuthInitializer>
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
