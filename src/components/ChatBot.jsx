import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Home } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Add global styles for glassmorphism input placeholder
const styles = `
  .glassmorphism-input::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
  .glassmorphism-input:focus {
    border-color: rgba(255, 255, 255, 0.4);
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.2);
  }
`;

if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content: "Hello! I'm the AI assistant here at Saridena Constructions. I'm here to help you learn about our luxury LakeWoods Villas project and answer any questions you might have about our company. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  // Generate a unique session ID for this conversation
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    const currentInput = input;
    setInput("");

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 50000);

      const res = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: currentInput,
          session_id: sessionId 
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      
      const assistantMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: data.response || "I'm sorry, I couldn't process your request. Please try again.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      let errorContent = "Sorry, I'm having trouble connecting to our servers. Please try again later.";
      
      if (error.name === 'AbortError') {
        errorContent = "The request is taking too long. Please try a simpler question or try again later.";
      }
      
      const errorMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: errorContent,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const quickQuestions = [
    "What villa sizes do you offer?",
    "What are the prices?",
    "Tell me about amenities",
    "How can I contact you?"
  ];

  const handleQuickQuestion = (question) => {
    setInput(question);
  };

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 99999,
        pointerEvents: 'auto'
      }}
    >
      {/* Chat Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              console.log("Chat button clicked!");
              setIsOpen(true);
            }}
            style={{
              width: '64px',
              height: '64px',
              background: 'rgba(37, 40, 46, 0.8)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'white',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(37, 40, 46, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              pointerEvents: 'auto'
            }}
          >
            <div 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                animation: 'pulse 2s infinite'
              }}
            />
            <MessageCircle size={28} style={{ position: 'relative', zIndex: 1 }} />
            <div 
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                width: '12px',
                height: '12px',
                backgroundColor: '#ef4444',
                borderRadius: '50%',
                border: '2px solid white',
                zIndex: 2
              }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.1 }}
            style={{
              position: 'absolute',
              bottom: '80px',
              right: '0',
              width: '380px',
              height: '550px',
              background: 'rgba(37, 40, 46, 0.85)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              pointerEvents: 'auto'
            }}
          >
            {/* Header */}
            <div 
              style={{
                background: 'rgba(37, 40, 46, 0.9)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'white',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    padding: '8px'
                  }}>
                    <Home size={20} />
                  </div>
                  <div style={{
                    position: 'absolute',
                    bottom: '-2px',
                    right: '-2px',
                    width: '12px',
                    height: '12px',
                    backgroundColor: '#10b981',
                    borderRadius: '50%',
                    border: '2px solid white'
                  }}></div>
                </div>
                <div>
                  <h3 style={{ fontWeight: 'bold', fontSize: '18px', margin: 0, fontFamily: 'Bileha, sans-serif' }}>AI Villa Assistant</h3>
                  <p style={{ fontSize: '12px', opacity: 0.9, margin: 0 }}>Saridena Constructions • AI Powered</p>
                </div>
              </div>
              <button
                onClick={() => {
                  console.log("Close button clicked!");
                  setIsOpen(false);
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                  padding: '8px',
                  cursor: 'pointer',
                  color: 'white',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.1)'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '20px',
              background: 'rgba(37, 40, 46, 0.3)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.1, ease: "easeOut" }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: message.role === "user" ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div style={{
                    maxWidth: '85%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: message.role === "user" ? 'flex-end' : 'flex-start'
                  }}>
                    <div style={{
                      background: message.role === "user" 
                        ? 'rgba(255, 255, 255, 0.2)' 
                        : 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      padding: '12px 16px',
                      borderRadius: message.role === "user" ? '20px 20px 6px 20px' : '20px 20px 20px 6px',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
                      fontSize: '14px',
                      lineHeight: '1.5',
                      wordWrap: 'break-word'
                    }}>
                      {message.role === "user" ? (
                        message.content
                      ) : (
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: ({children}) => <div style={{margin: '0 0 8px 0'}}>{children}</div>,
                            ul: ({children}) => <ul style={{margin: '0 0 8px 0', paddingLeft: '16px'}}>{children}</ul>,
                            ol: ({children}) => <ol style={{margin: '0 0 8px 0', paddingLeft: '16px'}}>{children}</ol>,
                            li: ({children}) => <li style={{margin: '2px 0'}}>{children}</li>,
                            strong: ({children}) => <strong style={{fontWeight: '600'}}>{children}</strong>,
                            em: ({children}) => <em style={{fontStyle: 'italic'}}>{children}</em>,
                            h1: ({children}) => <h1 style={{fontSize: '18px', fontWeight: 'bold', margin: '8px 0 4px 0'}}>{children}</h1>,
                            h2: ({children}) => <h2 style={{fontSize: '16px', fontWeight: 'bold', margin: '6px 0 3px 0'}}>{children}</h2>,
                            h3: ({children}) => <h3 style={{fontSize: '14px', fontWeight: 'bold', margin: '4px 0 2px 0'}}>{children}</h3>,
                            blockquote: ({children}) => <blockquote style={{
                              borderLeft: '3px solid #1e40af',
                              paddingLeft: '12px',
                              margin: '8px 0',
                              fontStyle: 'italic',
                              backgroundColor: '#f8f9fa'
                            }}>{children}</blockquote>,
                            code: ({children}) => <code style={{
                              backgroundColor: '#f3f4f6', 
                              padding: '2px 4px', 
                              borderRadius: '3px', 
                              fontSize: '12px',
                              fontFamily: 'monospace'
                            }}>{children}</code>,
                            pre: ({children}) => <pre style={{
                              backgroundColor: '#f3f4f6', 
                              padding: '8px', 
                              borderRadius: '6px', 
                              overflow: 'auto',
                              fontSize: '12px',
                              fontFamily: 'monospace'
                            }}>{children}</pre>,
                            table: ({children}) => <table style={{
                              width: '100%',
                              borderCollapse: 'collapse',
                              margin: '8px 0',
                              background: 'rgba(255, 255, 255, 0.05)',
                              backdropFilter: 'blur(5px)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              borderRadius: '6px',
                              overflow: 'hidden'
                            }}>{children}</table>,
                            thead: ({children}) => <thead style={{
                              background: 'rgba(255, 255, 255, 0.1)',
                              fontWeight: '600'
                            }}>{children}</thead>,
                            tbody: ({children}) => <tbody>{children}</tbody>,
                            tr: ({children}) => <tr style={{
                              borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                            }}>{children}</tr>,
                            th: ({children}) => <th style={{
                              padding: '8px 12px',
                              textAlign: 'left',
                              fontSize: '12px',
                              fontWeight: '600',
                              color: 'rgba(255, 255, 255, 0.9)',
                              borderRight: '1px solid rgba(255, 255, 255, 0.1)'
                            }}>{children}</th>,
                            td: ({children}) => <td style={{
                              padding: '8px 12px',
                              fontSize: '12px',
                              color: 'rgba(255, 255, 255, 0.8)',
                              borderRight: '1px solid rgba(255, 255, 255, 0.05)'
                            }}>{children}</td>
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      )}
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      marginTop: '6px',
                      fontSize: '11px',
                      color: '#9ca3af'
                    }}>
                      {message.role === "user" ? (
                        <User size={12} />
                      ) : (
                        <Bot size={12} />
                      )}
                      <span>{formatTime(message.timestamp)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ display: 'flex', justifyContent: 'flex-start' }}
                >
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    padding: '16px 20px',
                    borderRadius: '20px 20px 20px 6px',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {[0, 1, 2].map(i => (
                        <motion.div
                          key={i}
                          animate={{
                            scale: [1, 1.2, 1],
                            backgroundColor: ['rgba(255, 255, 255, 0.6)', 'rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.6)']
                          }}
                          transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            delay: i * 0.2
                          }}
                          style={{
                            width: '10px',
                            height: '10px',
                            backgroundColor: 'rgba(255, 255, 255, 0.6)',
                            borderRadius: '50%',
                            boxShadow: '0 0 10px rgba(255, 255, 255, 0.3)'
                          }}
                        />
                      ))}
                    </div>
                    <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.8)', fontWeight: '500' }}>
                      🤖 AI is thinking...
                    </span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            {messages.length === 1 && (
              <div style={{
                padding: '16px 20px',
                background: 'rgba(37, 40, 46, 0.4)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <p style={{
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  marginBottom: '12px',
                  fontWeight: '500'
                }}>✨ Quick questions to get started:</p>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  {quickQuestions.map((question, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ 
                        scale: 1.02,
                        boxShadow: '0 4px 16px rgba(255, 255, 255, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.2)'
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleQuickQuestion(question)}
                      style={{
                        fontSize: '12px',
                        background: 'rgba(255, 255, 255, 0.12)',
                        backdropFilter: 'blur(15px)',
                        WebkitBackdropFilter: 'blur(15px)',
                        border: '1px solid rgba(255, 255, 255, 0.25)',
                        color: 'white',
                        padding: '8px 12px',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.15)'
                      }}
                    >
                      {question}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '20px',
              background: 'rgba(37, 40, 46, 0.4)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)'
            }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about our luxury villas..."
                    disabled={loading}
                    className="glassmorphism-input"
                    style={{
                      width: '100%',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '20px',
                      padding: '12px 16px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      color: 'white',
                      opacity: loading ? 0.6 : 1
                    }}
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  style={{
                    background: input.trim() && !loading 
                      ? 'rgba(255, 255, 255, 0.3)' 
                      : 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    borderRadius: '50%',
                    width: '48px',
                    height: '48px',
                    cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                    boxShadow: input.trim() && !loading 
                      ? '0 4px 16px rgba(255, 255, 255, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.1)' 
                      : '0 2px 8px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <Send size={18} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}