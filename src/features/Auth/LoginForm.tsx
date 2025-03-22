import React, { useState } from 'react';
import '../../styles/login.css';
import { ShowPasswordButton } from '../../components/ShowPasswordButton';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectAuthError, selectAuthLoading } from './authSelectors';
import { loginUser } from './authThunks';
import { Loading } from '../../components/Loading';
import { Error } from '../../components/Error';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const errorAuth = useAppSelector(selectAuthError);
  const loading = useAppSelector(selectAuthLoading);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { type, value, checked } = e.target;

    switch (type) {
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'checkbox':
        setRememberMe(checked);
        break;
      default:
        break;
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (password.length < 6) {
      setError('Пароль должен содержать не менее 6 символов');

      return;
    }

    setError(null);
    dispatch(loginUser({ email, password, rememberMe }));
  };

  return (
    <div className="login-container d-flex justify-content-center align-items-center py-2 bg-body-tertiary">
      <div className="form-signin w-100 m-auto">
        <form className="form" onSubmit={handleSubmit}>
          <h1 className="h3 mb-3 fw-normal">Войти</h1>
          <div>
            <div className="form-floating">
              <input
                type="email"
                className="form-control"
                id="floatingInput"
                placeholder="name@example.com"
                onChange={handleChange}
                required
              />
              <label htmlFor="floatingInput">Введите email адрес</label>
            </div>
            <div className="form-floating position-relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                id="floatingPassword"
                placeholder="Password"
                onChange={handleChange}
                required
              />
              <label htmlFor="floatingPassword">Введите пароль</label>
              <ShowPasswordButton
                toggleShowPassword={() => setShowPassword(!showPassword)}
                showPassword={showPassword}
              />
            </div>
          </div>

          <div className="form-check text-start my-3">
            <input
              className="form-check-input"
              type="checkbox"
              value="remember-me"
              id="flexCheckDefault"
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="flexCheckDefault">
              Запомнить меня
            </label>
          </div>
          <div className="d-flex justify-content-center align-items-center">
            {loading && <Loading />}
          </div>
          {error && <Error message={error} />}
          {errorAuth && <Error message={errorAuth} />}
          <button className="btn btn-primary w-100 py-2" type="submit">
            Войти
          </button>
        </form>
      </div>
    </div>
  );
};
