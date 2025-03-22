import React, { useEffect, useState } from 'react';
import { Error } from '../../components/Error';
import { Loading } from '../../components/Loading';

interface LinkFormProps {
  onSubmit: (link?: string) => void;
  loading: boolean;
  error: string | null;
}

export const LinkForm: React.FC<LinkFormProps> = ({
  onSubmit,
  loading,
  error,
}) => {
  const [link, setLink] = useState('');
  const [localError, setLocalError] = useState(error);

  useEffect(() => {
    setLocalError(error);
  }, [error]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (link.trim() === '') {
      alert('Пожалуйста, вставьте ссылку');

      return;
    }

    setLink('');
    onSubmit(link);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 d-flex justify-content-center flex-column align-items-center"
    >
      <div className="mb-3 w-50">
        <label
          htmlFor="linkInput"
          className="form-label d-flex justify-content-start"
        >
          Cсылка
        </label>
        <div className="d-flex justify-content-center">
          <input
            type="text"
            id="linkInput"
            className="form-control w-100"
            placeholder="https://vk.example.com"
            value={link}
            onChange={e => {
              setLink(e.target.value);
              setLocalError('');
            }}
            disabled={loading}
          />
          <button
            type="submit"
            className="btn btn-primary ms-2"
            disabled={loading}
          >
            {loading ? 'Отправка...' : 'Отправить'}
          </button>
        </div>
        {loading && <Loading />}
        {error && <Error message={localError} />}
      </div>
    </form>
  );
};
