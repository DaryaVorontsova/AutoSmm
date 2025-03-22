import React, { useEffect, useState } from 'react';
import type { myFormData } from './types';
import { Loading } from '../../components/Loading';
import { Error } from '../../components/Error';

import useSpeechToText from '../../hooks/useSpeechToText';

interface NoLinkFormProps {
  onSubmit: (data: myFormData) => void;
  loading: boolean;
  error: string | null;
}

export const NoLinkForm: React.FC<NoLinkFormProps> = ({
  onSubmit,
  loading,
  error,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
  });
  const [localError, setLocalError] = useState(error);

  useEffect(() => {
    setLocalError(error);
  }, [error]);

  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechToText({ continuous: true });

  const startStopListening = () => {
    if (isListening) {
      stopVoiceInput();
    } else {
      startListening();
    }
  };

  const stopVoiceInput = () => {
    setFormData(prev => ({
      ...prev,
      description:
        prev.description +
        (prev.description.trim().length ? ' ' : '') +
        transcript,
    }));
    stopListening();
    resetTranscript();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;

    setLocalError('');

    setFormData(prevState => ({ ...prevState, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormData({ name: '', category: '', description: '' });
    onSubmit(formData);
  };

  const displayedDescription = isListening
    ? formData.description + (transcript ? ' ' + transcript : '')
    : formData.description;

  return (
    <form
      onSubmit={handleSubmit}
      className="d-flex flex-column align-items-center mt-4"
    >
      <div className="w-50">
        <div className="d-flex flex-column align-items-start">
          <label className="pb-1" htmlFor="name">
            Название
          </label>
          <div className="mb-3 d-flex align-items-center gap-2 w-100">
            <input
              id="name"
              type="text"
              className="form-control"
              placeholder="ИИ в инж обр"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="d-flex flex-column align-items-start">
          <label className="pb-1" htmlFor="theme">
            Тематика
          </label>
          <div className="mb-3 d-flex align-items-center gap-2 w-100">
            <input
              id="category"
              type="text"
              className="form-control"
              placeholder="Сообщество об ИИ"
              required
              value={formData.category}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="d-flex flex-column align-items-start">
          <label className="pb-1" htmlFor="description">
            Описание
          </label>
          <div className="d-flex align-items-center gap-2 w-100">
            <textarea
              id="description"
              className="form-control"
              placeholder="В моем сообществе будет..."
              rows={5}
              disabled={isListening}
              value={displayedDescription}
              onChange={handleChange}
            ></textarea>

            {isListening ? (
              <button
                className="btn btn-primary mic-button rounded-circle"
                onClick={() => startStopListening()}
              >
                <i className="bi bi-mic"></i>
              </button>
            ) : (
              <button
                className="btn btn-light mic-button rounded-circle"
                onClick={() => startStopListening()}
              >
                <i className="bi bi-mic"></i>
              </button>
            )}
          </div>
        </div>
      </div>
      <button type="submit" className="btn btn-primary mt-3" disabled={loading}>
        {loading ? 'Отправка...' : 'Отправить'}
      </button>
      {loading && <Loading />}
      {localError && <Error message={localError} />}
    </form>
  );
};
