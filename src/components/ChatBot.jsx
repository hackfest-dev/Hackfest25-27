import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import axios from 'axios';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      role: 'user',
      content: inputMessage
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Create query parameters
      const queryParams = new URLSearchParams({
        host: 'aws-0-ap-southeast-1.pooler.supabase.com',
        port: '6543',
        user: 'postgres.ofcyjirmbaospuaqdczi',
        password: '%2B918618978068',
        database: 'postgres',
        query: inputMessage
      });

      console.log('Sending request with query params:', queryParams.toString());

      const response = await axios.post(`/api/chat?${queryParams.toString()}`, null, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('API Response:', response.data);
      
      const botMessage = {
        role: 'assistant',
        content: response.data.summary || 'Sorry, I could not process your request.'
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error details:', error.response || error);
      let errorMessage = {
        role: 'assistant',
        content: 'Failed to connect to the AI service. Please try again later.'
      };

      if (error.response?.data?.detail) {
        // Handle validation errors
        const details = Array.isArray(error.response.data.detail) 
          ? error.response.data.detail.map(d => d.msg).join('\n')
          : error.response.data.detail;
        errorMessage.content = `Error: ${details}`;
      }

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Add initial greeting message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: 'Hello! I am your Supply Chain AI Assistant. How can I help you today?'
        }
      ]);
    }
  }, []);

  return (
    <div className="flex flex-col h-[80vh] max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      {/* Chat Header */}
      <div className="bg-yellow-600 text-white px-6 py-4 rounded-t-lg">
        <h2 className="text-xl font-semibold">Supply Chain AI Assistant</h2>
        <p className="text-sm opacity-90">Ask me anything about supply chain management</p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-2">
              <Loader2 className="w-5 h-5 animate-spin text-yellow-600" />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={sendMessage} className="border-t p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600"
          />
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="bg-yellow-600 text-white rounded-lg px-4 py-2 hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBot; 