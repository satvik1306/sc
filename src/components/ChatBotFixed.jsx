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
      className="fixed bottom-6 right-6 z-50"
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
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 sm:w-16 sm:h-16 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center relative overflow-hidden group"
            style={{
              backgroundColor: 'hsl(var(--primary, 220 91% 25%))',
              color: 'hsl(var(--primary-foreground, 0 0% 100%))',
              cursor: 'pointer',
              pointerEvents: 'auto'
            }}
          >
            <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse" />
            <MessageCircle className="relative z-10 w-6 h-6 sm:w-7 sm:h-7" />
            <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-white z-20" />
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
            className="absolute bottom-20 right-0 w-80 sm:w-96 h-[500px] sm:h-[600px] bg-background/95 backdrop-blur-xl rounded-2xl shadow-xl border border-border/50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary text-primary-foreground p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="bg-white/20 backdrop-blur-md rounded-xl p-2">
                    <Home size={20} />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold">Villa Assistant</h3>
                  <p className="text-xs opacity-90 font-content">Powered by AI • Online</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="bg-white/20 backdrop-blur-md hover:bg-white/30 border-none rounded-full p-2 cursor-pointer text-primary-foreground transition-all duration-200"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 bg-gradient-to-b from-muted/30 to-background/50 flex flex-col gap-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className={`flex flex-col ${message.role === "user" ? 'items-end' : 'items-start'}`}
                >
                  <div className={`max-w-[85%] flex flex-col ${message.role === "user" ? 'items-end' : 'items-start'}`}>
                    <div className={`px-4 py-3 rounded-2xl font-content text-sm leading-relaxed break-words shadow-md ${
                      message.role === "user" 
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-card text-card-foreground border border-border/50 rounded-bl-md'
                    }`}>
                      {message.content}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground">
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
                  className="flex justify-start"
                >
                  <div className="bg-card border border-border/50 px-5 py-4 rounded-2xl rounded-bl-md shadow-md flex items-center gap-3">
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <motion.div
                          key={i}
                          animate={{
                            scale: [1, 1.2, 1],
                            backgroundColor: ['hsl(var(--primary))', 'hsl(var(--primary)/0.6)', 'hsl(var(--primary))']
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.2
                          }}
                          className="w-2.5 h-2.5 bg-primary rounded-full"
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">
                      🤖 AI is thinking...
                    </span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            {messages.length === 1 && (
              <div className="px-5 py-4 bg-muted/20 border-t border-border/50 backdrop-blur-md">
                <p className="text-xs text-muted-foreground mb-3 font-medium">✨ Quick questions to get started:</p>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((question, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleQuickQuestion(question)}
                      className="text-xs bg-card hover:bg-accent/50 text-card-foreground px-3 py-2 rounded-xl border border-border/30 cursor-pointer transition-all duration-200 shadow-sm font-content"
                    >
                      {question}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="border-t border-border/50 p-5 bg-background/95 backdrop-blur-md">
              <div className="flex gap-3 items-end">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about our luxury villas..."
                    disabled={loading}
                    className="w-full border-2 border-input rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200 bg-muted/30 text-foreground placeholder:text-muted-foreground font-content
                      focus:border-primary focus:bg-background focus:shadow-md focus:ring-1 focus:ring-primary/20
                      disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  className={`rounded-full w-12 h-12 flex items-center justify-center transition-all duration-200 shadow-md ${
                    input.trim() && !loading 
                      ? 'bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer shadow-lg' 
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                  }`}
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