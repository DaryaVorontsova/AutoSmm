import React, { useState } from 'react';
import '../../styles/login.css';
import { ShowPasswordButton } from '../../components/ShowPasswordButton';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { registerUser } from './authThunks';
import { selectAuthError, selectAuthLoading } from './authSelectors';
import { Loading } from '../../components/Loading';
import { Error } from '../../components/Error';

export const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectAuthLoading);
  const errorAuth = useAppSelector(selectAuthError);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setError(null);

    switch (name) {
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'passwordConfirm':
        setConfirmPassword(value);
        break;
      case 'username':
        setUsername(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (password.length < 6) {
      setError('Пароль должен быть не менее 6 символов');

      return;
    }

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');

      return;
    }

    setError(null);
    dispatch(registerUser({ username, email, password }));
    // eslint-disable-next-line no-console
    console.log('Регистрация успешна:', { username, email, password });
  };

  return (
    <div className="login-container d-flex justify-content-center align-items-center py-2 bg-body-tertiary">
      <div className="form-signin w-100 m-auto">
        <form className="form" onSubmit={handleSubmit}>
          <h1 className="h3 mb-3 fw-normal">Регистрация</h1>
          <div>
            <div className="form-floating">
              <input
                type="text"
                name="username"
                className="form-control"
                id="floatingName"
                placeholder="Иван Иванов"
                onChange={handleChange}
                required
              />
              <label htmlFor="floatingName">Введите имя</label>
            </div>
            <div className="form-floating">
              <input
                type="email"
                className="form-control"
                name="email"
                id="floatingEmail"
                placeholder="name@example.com"
                onChange={handleChange}
                required
              />
              <label htmlFor="floatingEmail">Введите email адрес</label>
            </div>
            <div className="form-floating position-relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                name="password"
                id="floatingPassword"
                placeholder="Пароль"
                onChange={handleChange}
                required
              />
              <label htmlFor="floatingPassword">Введите пароль</label>
              <ShowPasswordButton
                toggleShowPassword={() => setShowPassword(!showPassword)}
                showPassword={showPassword}
              />
            </div>
            <div className="form-floating position-relative">
              <input
                type="password"
                className="form-control"
                name="passwordConfirm"
                id="floatingConfirm"
                placeholder="Подтвердите пароль"
                onChange={handleChange}
                required
              />
              <label htmlFor="floatingConfirm">Подтвердите пароль</label>
              <ShowPasswordButton
                toggleShowPassword={() =>
                  setShowPasswordConfirm(!showPasswordConfirm)
                }
                showPassword={showPasswordConfirm}
              />
            </div>
          </div>
          <div className="d-flex justify-content-center align-items-center">
            {loading && <Loading />}
          </div>
          {error && <Error message={error} />}
          {errorAuth && <Error message={errorAuth} />}
          <button className="btn btn-primary w-100 py-2" type="submit">
            Зарегистрироваться
          </button>
        </form>
      </div>
    </div>
  );
};
