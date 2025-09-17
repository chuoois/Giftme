import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react';
import { botService } from '@/services/bot.services';

export const Chatbot = ({
  botName = "ExcitementBot",
  botInitials = "EB",
  welcomeMessage = "Xin chào! Tôi là ExcitementBot từ trang Gift Me. Tôi có thể giúp gì cho bạn?"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const introMessage = {
        id: 1,
        text: welcomeMessage,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([introMessage]);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, messages.length, welcomeMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newUserMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const { response, data } = await botService.getBotResponse(inputMessage);

      const botMessage = {
        id: messages.length + 2,
        text: response || "Xin lỗi, tôi chưa hiểu. Bạn có thể hỏi câu khác được không?",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        data
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: messages.length + 2,
        text: "Có lỗi xảy ra khi kết nối với máy chủ.",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChatbot = () => setIsOpen(prev => !prev);
  const minimizeChatbot = () => setIsMinimized(prev => !prev);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <div
          onClick={toggleChatbot}
          className="w-16 h-16 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full shadow-lg cursor-pointer flex items-center justify-center hover:shadow-xl transition-all duration-300 hover:scale-110"
        >
          <MessageCircle className="w-8 h-8 text-white" />
        </div>
      )}

      {isOpen && (
        <div className={`bg-white rounded-lg shadow-2xl border border-pink-100 transition-all duration-300 ${isMinimized ? 'h-16' : 'h-96 w-80'}`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-400 to-pink-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-pink-600 font-bold text-sm">{botInitials}</span>
              </div>
              <div>
                <h3 className="font-semibold text-sm">{botName}</h3>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-xs opacity-90">Đang hoạt động</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={minimizeChatbot} className="w-8 h-8 hover:bg-white hover:bg-opacity-20 rounded-full flex items-center justify-center transition-colors">
                <Minimize2 className="w-4 h-4" />
              </button>
              <button onClick={toggleChatbot} className="w-8 h-8 hover:bg-white hover:bg-opacity-20 rounded-full flex items-center justify-center transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body */}
          {!isMinimized && (
            <>
              <div className="flex-1 p-4 h-64 overflow-y-auto bg-pink-50">
                {messages.map(message => (
                  <div key={message.id} className={`flex mb-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {message.sender === 'bot' && (
                      <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                        <span className="text-white text-xs font-bold">{botInitials}</span>
                      </div>
                    )}
                    <div className="max-w-xs">
                      <div className={`rounded-lg px-3 py-2 text-sm ${message.sender === 'user' ? 'bg-gradient-to-r from-pink-400 to-pink-600 text-white rounded-br-sm' : 'bg-white border border-pink-200 text-gray-800 rounded-bl-sm'}`}>
                        {message.text}
                      </div>

                      {/* Nếu bot trả về data, hiển thị quà với Link */}
                      {message.sender === 'bot' && message.data && (
                        <div className="mt-2 space-y-2">
                          {message.data.map(product => (
                            <Link
                              key={product._id}
                              to={`/combo/${product._id}#${product.name.replace(/\s+/g, "-").toLowerCase()}`}
                              className="block border rounded-lg p-2 bg-white shadow-sm hover:shadow-md transition"
                            >
                              <img src={product.image} alt={product.name} className="w-full h-24 object-cover rounded-md mb-1" />
                              <div className="text-sm font-semibold">{product.name}</div>
                              <div className="text-xs text-gray-500 line-through">{product.originalPrice.toLocaleString()}₫</div>
                              <div className="text-sm text-pink-600 font-bold">{product.price.toLocaleString()}₫</div>
                              {product.discount && <div className="text-xs text-red-500">{product.discount}% OFF</div>}
                            </Link>
                          ))}
                        </div>
                      )}

                      <div className={`text-xs text-gray-500 mt-1 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                        {message.timestamp}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex mb-3 justify-start">
                    <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full flex items-center justify-center mr-2">
                      <span className="text-white text-xs font-bold">{botInitials}</span>
                    </div>
                    <div className="bg-white border border-pink-200 rounded-lg rounded-bl-sm px-3 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-pink-200 p-3">
                <div className="flex items-center space-x-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 border border-pink-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                    className="w-10 h-10 bg-gradient-to-r from-pink-400 to-pink-600 text-white rounded-full flex items-center justify-center hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
