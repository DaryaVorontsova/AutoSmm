import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/notFound.css';

export const NotFoundPage = () => {
  return (
    <div className="not-found-container">
      <h1>🛑 Ошибка 404</h1>
      <p>Кажется, этот маршрут не существует...</p>
      <p>Я бы придумал что-то, но тут даже мне не хватает идей! 🤯</p>
      <Link to="/start" className="btn btn-primary">
        Вернуться к боту
      </Link>
    </div>
  );
};
