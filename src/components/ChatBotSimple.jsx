import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Home } from "lucide-react";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content: "Hello! I'm your AI assistant for Saridena Constructions. I can help you with information about our luxury villas, pricing, amenities, and more. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

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
      const timeoutId = setTimeout(() => controller.abort(), 45000);

      const res = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentInput }),
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
              backgroundColor: '#1e40af',
              color: 'white',
              borderRadius: '50%',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 25px rgba(30, 64, 175, 0.3)',
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
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              bottom: '80px',
              right: '0',
              width: '380px',
              height: '550px',
              backgroundColor: 'white',
              borderRadius: '20px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
              border: '1px solid #e5e7eb',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              pointerEvents: 'auto'
            }}
          >
            {/* Header */}
            <div 
              style={{
                backgroundColor: '#1e40af',
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
                  <h3 style={{ fontWeight: 'bold', fontSize: '18px', margin: 0, fontFamily: 'Bileha, sans-serif' }}>Villa Assistant</h3>
                  <p style={{ fontSize: '12px', opacity: 0.9, margin: 0 }}>Powered by AI • Online</p>
                </div>
              </div>
              <button
                onClick={() => {
                  console.log("Close button clicked!");
                  setIsOpen(false);
                }}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  borderRadius: '50%',
                  padding: '8px',
                  cursor: 'pointer',
                  color: 'white',
                  transition: 'all 0.2s ease'
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
              backgroundColor: '#f8fafc',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
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
                      backgroundColor: message.role === "user" ? '#1e40af' : 'white',
                      color: message.role === "user" ? 'white' : '#374151',
                      padding: '12px 16px',
                      borderRadius: message.role === "user" ? '20px 20px 6px 20px' : '20px 20px 20px 6px',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                      border: message.role === "user" ? 'none' : '1px solid #e5e7eb',
                      fontSize: '14px',
                      lineHeight: '1.5',
                      wordWrap: 'break-word'
                    }}>
                      {message.content}
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
                    backgroundColor: 'white',
                    padding: '16px 20px',
                    borderRadius: '20px 20px 20px 6px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    border: '1px solid #e5e7eb',
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
                            backgroundColor: ['#1e40af', '#3b82f6', '#1e40af']
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.2
                          }}
                          style={{
                            width: '10px',
                            height: '10px',
                            backgroundColor: '#1e40af',
                            borderRadius: '50%'
                          }}
                        />
                      ))}
                    </div>
                    <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500' }}>
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
                backgroundColor: '#f8fafc',
                borderTop: '1px solid #e5e7eb'
              }}>
                <p style={{
                  fontSize: '12px',
                  color: '#6b7280',
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
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleQuickQuestion(question)}
                      style={{
                        fontSize: '12px',
                        backgroundColor: 'white',
                        color: '#374151',
                        padding: '8px 12px',
                        borderRadius: '20px',
                        border: '1px solid #e5e7eb',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
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
              borderTop: '1px solid #e5e7eb',
              padding: '20px',
              backgroundColor: 'white'
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
                    style={{
                      width: '100%',
                      border: '2px solid #e5e7eb',
                      borderRadius: '20px',
                      padding: '12px 16px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      backgroundColor: '#f8fafc',
                      color: '#374151',
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
                    backgroundColor: input.trim() && !loading ? '#1e40af' : '#e5e7eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '48px',
                    height: '48px',
                    cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                    boxShadow: input.trim() && !loading ? '0 4px 12px rgba(30, 64, 175, 0.3)' : '0 2px 4px rgba(0,0,0,0.1)'
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