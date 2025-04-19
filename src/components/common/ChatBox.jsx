import { useState, useEffect, useRef } from 'react';
import { getDatabase, ref, push, set, onValue, serverTimestamp } from 'firebase/database';

const ChatBox = ({ currentUser, partnerRole, chatId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const database = getDatabase();

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Listen for messages
  useEffect(() => {
    if (!chatId || !currentUser) return;

    const messagesRef = ref(database, `chats/${chatId}`);
    
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messageList = Object.entries(data).map(([id, message]) => ({
          id,
          ...message
        }))
        .filter(message => message.timestamp) // Filter out messages with no timestamp
        .sort((a, b) => {
          const timestampA = typeof a.timestamp === 'number' ? a.timestamp : 0;
          const timestampB = typeof b.timestamp === 'number' ? b.timestamp : 0;
          return timestampA - timestampB;
        });
        
        console.log('Fetched messages:', messageList); // Debug log
        setMessages(messageList);
      } else {
        setMessages([]);
      }
    });

    return () => unsubscribe();
  }, [chatId, database, currentUser]);

  // Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !currentUser || !chatId) return;
    
    try {
      const messagesRef = ref(database, `chats/${chatId}`);
      const newMessageRef = push(messagesRef);
      
      const messageData = {
        text: newMessage,
        senderId: currentUser.uid,
        senderRole: currentUser.role,
        receiverRole: partnerRole,
        timestamp: serverTimestamp()
      };

      console.log('Sending message:', messageData); // Debug log
      
      await set(newMessageRef, messageData);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">
        Chat with {partnerRole.charAt(0).toUpperCase() + partnerRole.slice(1)}
      </h2>
      <div className="flex flex-col h-[400px]">
        <div className="flex-1 p-3 bg-white rounded border overflow-y-auto mb-4">
          {messages.length === 0 ? (
            <p className="text-center text-gray-500 mt-4">No messages yet. Start the conversation!</p>
          ) : (
            <div className="space-y-4">
              {messages.map(message => {
                const isCurrentUser = message.senderId === currentUser.uid;
                // Show the actual sender's role
                const messageRole = message.senderRole;
                
                return (
                  <div 
                    key={message.id} 
                    className={`flex w-full ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] p-3 rounded-lg ${
                        isCurrentUser 
                          ? 'bg-yellow-100 text-yellow-800 ml-auto' 
                          : 'bg-gray-100 text-gray-800 mr-auto'
                      }`}
                    >
                      <div className="text-xs text-gray-500 mb-1">{messageRole}</div>
                      <p className="text-sm break-words">{message.text}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatTime(message.timestamp)}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        <form onSubmit={handleSendMessage} className="mt-auto">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <button
              type="submit"
              className="px-4 py-2 text-sm text-yellow-600 bg-white rounded border border-yellow-200 hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatBox; 