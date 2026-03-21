import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Mic } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Chat() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', textKey: 'chat_welcome' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Initialize speech recognition native boundaries once
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
    }
  }, []);

  useEffect(() => {
    // Dynamically apply selected language locale to speech parser
    if (recognitionRef.current) {
      recognitionRef.current.lang = i18n.language === 'hi' ? 'hi-IN' : i18n.language === 'te' ? 'te-IN' : 'en-US';
      
      recognitionRef.current.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          currentTranscript += event.results[i][0].transcript;
        }
        setInput(currentTranscript);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, [i18n.language]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not explicitly supported by your specific browser architecture.");
      return;
    }
    
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setInput('');
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    // Create new message array for UI
    const userMsg = { id: Date.now(), sender: 'user', text: input };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      // Send the entire conversation history to the backend Context window
      // We resolve the textKey locally before sending so backend sees actual string text payload
      const historyPayload = updatedMessages.map(msg => ({
        sender: msg.sender,
        text: msg.textKey ? t(msg.textKey) : msg.text
      }));

      const response = await api.post('/chat/message', { messages: historyPayload });
      const { reply, isComplete, extractedDetails } = response.data;

      if (isComplete) {
        // Redirection to Form with the structured payload
        navigate('/form', { state: { extractedDetails, confidence: 98 } });
      } else {
        setMessages(prev => [...prev, { 
          id: Date.now() + 1, 
          sender: 'ai', 
          text: reply 
        }]);
      }
    } catch (error) {
       console.error("Chat Error:", error);
       setMessages(prev => [...prev, { 
          id: Date.now() + 1, 
          sender: 'ai', 
          text: `Error: ${error.response?.data?.message || error.message || 'Unknown network error'}` 
        }]);
    } finally {
      setLoading(false);
    }
  };

  const currentLangLabel = i18n.language === 'hi' ? "Hindi selected" : 
                           i18n.language === 'te' ? "Telugu selected" : "English selected";

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px', backgroundColor: 'var(--color-bg-card)', 
        borderBottom: '1px solid #E5E7EB', borderRadius: '12px 12px 0 0',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem' }}>{t('sidebar_chat')}</h2>
        <span className="status-badge blue">{currentLangLabel}</span>
      </div>

      {/* Messages Area */}
      <div style={{
        flex: 1, backgroundColor: '#F3F4F6', padding: '20px',
        overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px'
      }}>
        {messages.map(msg => (
          <div key={msg.id} style={{
            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '70%',
            backgroundColor: msg.sender === 'user' ? 'var(--color-primary)' : 'white',
            color: msg.sender === 'user' ? 'white' : 'var(--color-text-dark)',
            padding: '12px 16px',
            borderRadius: '12px',
            borderBottomRightRadius: msg.sender === 'user' ? '0' : '12px',
            borderBottomLeftRadius: msg.sender === 'ai' ? '0' : '12px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
          }}>
            {msg.textKey ? t(msg.textKey) : msg.text}
          </div>
        ))}
        {loading && (
          <div style={{
            alignSelf: 'flex-start',
            backgroundColor: 'white',
            padding: '12px 16px',
            borderRadius: '12px',
            borderBottomLeftRadius: '0',
            color: 'var(--color-text-light)',
            fontSize: '0.9rem',
            fontStyle: 'italic'
          }}>
            Typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{
        padding: '16px', backgroundColor: 'var(--color-bg-card)', 
        borderTop: '1px solid #E5E7EB', borderRadius: '0 0 12px 12px',
        display: 'flex', gap: '12px', alignItems: 'center'
      }}>
        <button 
          onClick={toggleRecording}
          className={isRecording ? 'recording-pulse' : ''}
          style={{
          padding: '10px', borderRadius: '50%', border: 'none',
          backgroundColor: '#F3F4F6', color: 'var(--color-text-dark)', cursor: 'pointer',
          transition: 'all 0.2s'
        }}>
          <Mic size={20} />
        </button>
        <input 
          type="text" 
          placeholder={t('chat_input_placeholder')}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={loading}
          style={{
            flex: 1, padding: '12px 16px', borderRadius: '24px',
            border: '1px solid #E5E7EB', outline: 'none',
            fontFamily: 'var(--font-family)', fontSize: '0.95rem'
          }}
        />
        <button 
          onClick={handleSend}
          disabled={loading || !input.trim()}
          style={{
            padding: '10px', borderRadius: '50%', border: 'none',
            backgroundColor: loading || !input.trim() ? '#9CA3AF' : 'var(--color-primary)', 
            color: 'white', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          <Send size={18} style={{ marginLeft: '2px' }} />
        </button>
      </div>
    </div>
  );
}
