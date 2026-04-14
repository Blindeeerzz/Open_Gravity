import { useState, useRef, useEffect } from 'react';
import './Chat.css';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

interface ChatProps {
  onBack: () => void;
}

function Chat({ onBack }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      text: 'Bienvenido a Hecate Serveis. Soy Lilith, Agente Principal y CEO Operativa en línea. ¿En qué nivel ejecutivo o corporativo te puedo asistir hoy?',
      sender: 'bot'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Generar un ID de sesion unico para el navegador del usuario si no existe
  const [sessionId] = useState(() => {
    return 'web_' + Math.random().toString(36).substring(2, 10);
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Llamar al backend de Express en Node
      // En desarrollo apuntamos al localhost:3000, en producción usamos URL relativa
      const HOST = window.location.hostname === 'localhost' ? 'http://localhost:3000' : '';
      
      const response = await fetch(`${HOST}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: userMessage.text,
          sessionId: sessionId
        }),
      });

      if (!response.ok) {
        throw new Error('Network response failed');
      }

      const data = await response.json();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: 'bot'
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Error fetching chat response:', error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: '❌ Error de red temporal. Los servidores de Hecate no respondieron.',
        sender: 'bot'
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <button className="back-button" onClick={onBack} title="Volver al Lobby">
          ◀ Volver
        </button>
        <div className="header-info">
          <h1>HECATE SERVEIS</h1>
          <p><span className="status-dot"></span> Sistemas IA En Línea</p>
        </div>
      </div>

      <div className="messages-area">
        {messages.map(msg => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {isLoading && (
          <div className="typing-indicator">
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="input-area" onSubmit={handleSendMessage}>
        <input
          type="text"
          className="chat-input"
          placeholder="Escribe tu mensaje a la Agencia interconectada..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isLoading}
        />
        <button type="submit" className="send-button" disabled={isLoading || !inputText.trim()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>
    </div>
  );
}

export default Chat;
