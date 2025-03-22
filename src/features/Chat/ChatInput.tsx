import React, { useState, useRef } from 'react';
import useSpeechToText from '../../hooks/useSpeechToText';

interface ChatInputProps {
  onSend: (message: string, command: number) => void;
  isSendingDisabled: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  isSendingDisabled,
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechToText({ continuous: true });

  const minRows = 1;
  const maxRows = 8;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    adjustTextareaRows();
  };

  const adjustTextareaRows = () => {
    if (textareaRef.current) {
      textareaRef.current.rows = minRows;

      const lineHeight = parseInt(
        getComputedStyle(textareaRef.current).lineHeight,
        10,
      );
      const rows = Math.min(
        maxRows,
        Math.ceil(textareaRef.current.scrollHeight / lineHeight),
      );

      textareaRef.current.rows = rows;
    }
  };

  const handleSend = () => {
    if (message.trim()) {
      onSend(message, 0);
      setMessage('');
      adjustTextareaRows();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isSendingDisabled) {
      e.preventDefault();
      handleSend();
    }
  };

  const startStopListening = () => {
    if (isListening) {
      stopVoiceInput();
    } else {
      startListening();
    }
  };

  const stopVoiceInput = () => {
    setMessage(prev => prev + (prev.trim().length ? ' ' : '') + transcript);
    stopListening();
    resetTranscript();
    adjustTextareaRows();
  };

  const displayedMessage = isListening
    ? message + (transcript ? ' ' + transcript : '')
    : message;

  return (
    <div className="chat-input-wrapper">
      <div className="chat-input-container shadow-lg p-3 rounded-4">
        <div className="d-flex flex-row justify-content-between align-items-center gap-2 w-100">
          <textarea
            ref={textareaRef}
            className="form-control"
            placeholder="Хочу пост на тему..."
            value={displayedMessage}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            style={{
              resize: 'none',
              overflowY:
                message.split('\n').length > maxRows ? 'auto' : 'hidden',
            }}
            disabled={isListening}
          />
          <button
            className={`btn ${isListening ? 'btn-primary' : 'btn-light'} mic-button rounded-circle`}
            onClick={startStopListening}
          >
            <i className="bi bi-mic"></i>
          </button>
        </div>
        <div className="d-flex flex-row justify-content-start gap-2 w-100">
          <button className="btn btn-dark" onClick={() => onSend('', 1)}>
            Сделай сам
          </button>
          <button className="btn btn-dark" onClick={() => onSend('', 2)}>
            План развития
          </button>
        </div>
      </div>
      <button
        className="btn btn-primary send-button rounded-circle"
        onClick={handleSend}
        disabled={isSendingDisabled}
      >
        <i className="bi bi-send"></i>
      </button>
    </div>
  );
};
