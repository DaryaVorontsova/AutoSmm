import React, { useState, useEffect, useRef } from 'react';
import { SideBar } from '../features/Chat/SideBar';
import { ChatInput } from '../features/Chat/ChatInput';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  selectGroupById,
  selectGroupsLoading,
  selectGroupsError,
} from '../features/Groups/groupsSelectors';
import { selectToken } from '../features/Auth/authSelectors';
import { fetchGroups } from '../features/Groups/groupsThunks';
import { WS_URL } from '../shared/api/link';
import { marked } from 'marked';
import '../styles/chat.css';

interface Message {
  text: string;
  sender: 'user' | 'bot';
  isBlinking?: boolean;
}

export const ChatPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const loadingGroup = useAppSelector(selectGroupsLoading);
  const errorGroup = useAppSelector(selectGroupsError);
  const group =
    useAppSelector(state => selectGroupById(state, Number(id))) || null;
  const token = useAppSelector(selectToken);

  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const blinkingMessages = [
    '🤔 Думаю над ответом...',
    '⌛ Анализирую твой запрос...',
    '🔍 Ищу лучшую формулировку...',
    '💡 Генерирую идею...',
    '✍️ Подбираю точные слова...',
    '📖 Перепроверяю факты...',
    '🧠 Использую все свои знания...',
    '🎯 Формирую оптимальный ответ...',
  ];
  const blinkIndexRef = useRef<number>(0);
  const blinkingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const renderer = new marked.Renderer();

  renderer.heading = ({ tokens, depth }) => {
    const level = Math.min(depth + 2, 6);

    return `<h${level}>${tokens.map(t => t.raw).join('')}</h${level}>`;
  };

  const markedOptions = { renderer, breaks: true };

  useEffect(() => {
    dispatch(fetchGroups());
  }, [dispatch]);

  useEffect(() => {
    if (!id || !token) {
      return;
    }

    const socketUrl = `${WS_URL}/${id}?token=${token}`;
    const ws = new WebSocket(socketUrl);

    setSocket(ws);

    ws.onopen = () => {
      // eslint-disable-next-line no-console
      console.log('✅ WebSocket соединение установлено');
    };

    ws.onmessage = event => {
      const messageText = event.data;

      if (blinkingIntervalRef.current) {
        clearInterval(blinkingIntervalRef.current);
        blinkingIntervalRef.current = null;
      }

      typeBotMessage(messageText);
    };

    ws.onerror = error => {
      // eslint-disable-next-line no-console
      console.error('⚠️ Ошибка WebSocket:', error);
    };

    return () => {
      ws.close();
    };
  }, [id, token]);

  const sendMessage = (text: string, command: number) => {
    if ((!text.trim() && command === 0) || isTyping) {
      return;
    }

    let textUser: string = '';

    if (command === 0) {
      textUser = text;
    } else {
      textUser = 'Хочу магию';
    }

    const userMessage: Message = { text: textUser, sender: 'user' };

    setMessages(prev => [...prev, userMessage]);

    setMessages(prev => [
      ...prev,
      { text: blinkingMessages[0], sender: 'bot', isBlinking: true },
    ]);
    setIsTyping(true);
    blinkIndexRef.current = 0;

    blinkingIntervalRef.current = setInterval(() => {
      blinkIndexRef.current =
        (blinkIndexRef.current + 1) % blinkingMessages.length;
      setMessages(prevMessages => {
        const lastMessage = prevMessages[prevMessages.length - 1];

        if (lastMessage && lastMessage.sender === 'bot') {
          return [
            ...prevMessages.slice(0, -1),
            { ...lastMessage, text: blinkingMessages[blinkIndexRef.current] },
          ];
        }

        return prevMessages;
      });
    }, 3000);

    if (socket && socket.readyState === WebSocket.OPEN) {
      if (command === 0) {
        socket.send(text);
      } else if (command === 1) {
        socket.send('auto_idea');
      } else if (command === 2) {
        socket.send('growth_plan');
      }
    } else {
      // eslint-disable-next-line no-console
      console.error('⚠️ WebSocket не подключён');
    }
  };

  const typeBotMessage = (fullText: string) => {
    let currentText = '';
    let index = 0;

    setMessages(prevMessages => {
      return prevMessages.map(msg =>
        msg.isBlinking ? { ...msg, isBlinking: false } : msg,
      );
    });

    const interval = setInterval(() => {
      if (index < fullText.length) {
        currentText += fullText[index];
        index++;

        setMessages(prevMessages => {
          const lastMessage = prevMessages[prevMessages.length - 1];

          if (
            lastMessage &&
            lastMessage.sender === 'bot' &&
            !lastMessage.isBlinking
          ) {
            return [
              ...prevMessages.slice(0, -1),
              { ...lastMessage, text: currentText },
            ];
          }

          return prevMessages;
        });
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 10);
  };

  return (
    <div className="chat-layout">
      <SideBar group={group} loading={loadingGroup} error={errorGroup} />
      <div className="chat-content">
        <div className="header-fixed d-flex justify-content-center">
          <div className="d-flex align-items-center justify-content-center">
            <h1 className="mb-0 me-2">AutoSMM</h1>
            <img src="/src/assets/vk.svg" alt="vk icon" width="40" />
          </div>
        </div>
        <div className="chat-body">
          {messages.length === 0 ? (
            <div className="empty-message d-flex flex-column justify-content-center align-items-center">
              <h3>Добро пожаловать в AutoSMM!</h3>
              <p>
                Я твой личный помощник в создании крутых постов!
                <br />
                Напиши мне тему, а я сгенерирую текст, который покорит соцсети!
                <br />
                Давай начнем?
              </p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.sender} ${msg.isBlinking ? 'bot-message' : ''}`}
                dangerouslySetInnerHTML={{
                  __html: marked(msg.text, markedOptions),
                }}
              />
            ))
          )}
        </div>

        <ChatInput onSend={sendMessage} isSendingDisabled={isTyping} />
      </div>
    </div>
  );
};
