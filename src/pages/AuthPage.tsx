import React, { useState, useEffect } from 'react';
import '../styles/login.css';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../features/Auth/LoginForm';
import { RegisterForm } from '../features/Auth/RegisterForm';
import { useAppSelector } from '../app/hooks';
import { selectIsAuthenticated } from '../features/Auth/authSelectors';

export const AuthPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/start');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="auth-page">
      {isRegister ? <RegisterForm /> : <LoginForm />}
      <button
        className="btn btn-link"
        onClick={() => setIsRegister(!isRegister)}
      >
        {isRegister
          ? 'Уже есть аккаунт? Войти'
          : 'Нет аккаунта? Зарегистрироваться'}
      </button>
    </div>
  );
};
