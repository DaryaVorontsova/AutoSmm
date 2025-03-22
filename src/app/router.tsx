import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { StartPage } from '../pages/StartPage';
import { ChatPage } from '../pages/ChatPage';
import { AuthPage } from '../pages/AuthPage';
import { NotFoundPage } from '../pages/NotFoundPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/start" />} />
      <Route path="/start" element={<StartPage />} />
      <Route path="/chat/:id" element={<ChatPage />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
