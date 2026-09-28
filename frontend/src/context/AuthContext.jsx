import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

export const DEMO_USERS = {
  TEACHER: {
    id: 'demo-teacher-01',
    email: 'teacher@apex.edu',
    first_name: 'Dr. Robert',
    last_name: 'Vance',
    role: 'TEACHER',
    department: 'Computer Science',
    identifier: 'EMP-9021',
    status: 'ACTIVE',
  },
  STUDENT: {
    id: 'demo-student-01',
    email: 'alex.wright@student.apex.edu',
    first_name: 'Alexander',
    last_name: 'Wright',
    role: 'STUDENT',
    department: 'Computer Science',
    identifier: '2026-CS-001',
    status: 'ACTIVE',
  },
  ADMIN: {
    id: 'demo-admin-01',
    email: 'admin@apex.edu',
    first_name: 'System',
    last_name: 'Administrator',
    role: 'ADMIN',
    department: 'Academic Affairs',
    identifier: 'ADM-0001',
    status: 'ACTIVE',
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('demo_user_session');
    return saved ? JSON.parse(saved) : DEMO_USERS.TEACHER;
  });

  const [token, setToken] = useState(() => localStorage.getItem('demo_token') || 'demo_jwt_token_active');

  const login = async (email, password) => {
    let matchedUser = DEMO_USERS.TEACHER;

    if (email.toLowerCase().includes('student')) {
      matchedUser = DEMO_USERS.STUDENT;
    } else if (email.toLowerCase().includes('admin')) {
      matchedUser = DEMO_USERS.ADMIN;
    } else {
      matchedUser = {
        id: `user-${Date.now()}`,
        email,
        first_name: email.split('@')[0].toUpperCase(),
        last_name: 'User',
        role: 'TEACHER',
        department: 'Computer Science',
        identifier: 'EMP-1000',
        status: 'ACTIVE',
      };
    }

    const mockToken = `demo_token_${Date.now()}`;
    localStorage.setItem('demo_token', mockToken);
    localStorage.setItem('demo_user_session', JSON.stringify(matchedUser));

    setUser(matchedUser);
    setToken(mockToken);

    return { success: true, user: matchedUser };
  };

  const logout = useCallback(() => {
    localStorage.removeItem('demo_token');
    localStorage.removeItem('demo_user_session');
    setUser(null);
    setToken(null);
  }, []);

  const value = {
    user,
    role: user?.role || 'TEACHER',
    token,
    isAuthenticated: !!user,
    isLoading: false,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
