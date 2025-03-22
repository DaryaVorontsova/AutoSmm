import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { selectUsername } from '../features/Auth/authSelectors';
import { useAppDispatch } from '../app/hooks';
import { logout } from '../features/Auth/authSlice';
import { ConfirmModal } from './ConfirmModal';

export const Header: React.FC = () => {
  const userName = useAppSelector(selectUsername);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <>
      <header className="header d-flex align-items-center justify-content-between px-4 py-4 border-bottom position-relative">
        <div className="invisible">Привет, {userName}!</div>

        <div className="d-flex align-items-center justify-content-center position-absolute start-50 translate-middle-x">
          <h1 className="mb-0 me-2">AutoSMM</h1>
          <img src="/src/assets/vk.svg" alt="vk icon" width="40" />
        </div>

        <div className="d-flex align-items-center">
          <span className="me-3 fw-semibold">Привет, {userName}!</span>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => setShowLogoutModal(true)}
          >
            Выйти
          </button>
        </div>
      </header>

      <ConfirmModal
        show={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Выход из аккаунта"
        body="Вы уверены, что хотите выйти из аккаунта?"
        onConfirm={handleLogout}
        loading={false}
      />
    </>
  );
};
