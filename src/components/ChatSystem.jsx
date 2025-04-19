import { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { 
  getDatabase, 
  ref, 
  push, 
  set, 
  onValue, 
  serverTimestamp 
} from 'firebase/database';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDr27WKRXAAoKxzQ4mfJ4hhAlR4RMFWFqc",
  authDomain: "nittehackathon.firebaseapp.com",
  projectId: "nittehackathon",
  storageBucket: "nittehackathon.firebasestorage.app",
  messagingSenderId: "950943964810",
  appId: "1:950943964810:web:fbe7b46659db62b9b05773",
  measurementId: "G-5KDL1FMKDT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Mock user data
const mockUsers = {
  manager: {
    email: 'manager@example.com',
    password: 'password123',
    name: 'Manager'
  },
  supplier: {
    email: 'supplier@example.com',
    password: 'password123',
    name: 'Supplier'
  }
};

// Mock batch data
const mockBatches = [
  { id: 'BatchA123', name: 'Batch A - Electronics' },
  { id: 'BatchB456', name: 'Batch B - Furniture' },
  { id: 'BatchC789', name: 'Batch C - Clothing' }
];

const ChatSystem = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedBatch, setSelectedBatch] = useState(mockBatches[0].id);
  const [userRole, setUserRole] = useState(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Listen for messages when batch is selected
  useEffect(() => {
    if (!selectedBatch) return;

    const messagesRef = ref(database, `chats/${selectedBatch}`);
    
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messageList = Object.entries(data).map(([id, message]) => ({
          id,
          ...message
        }));
        setMessages(messageList.sort((a, b) => a.timestamp - b.timestamp));
      } else {
        setMessages([]);
      }
    });

    return () => unsubscribe();
  }, [selectedBatch]);

  // Handle login
  const handleLogin = async (role) => {
    setLoading(true);
    try {
      const userData = mockUsers[role];
      console.log(`Attempting to login as ${role} with email: ${userData.email}`);
      
      try {
        // First try to create the user account
        const createResult = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
        console.log('Account created successfully:', createResult.user.uid);
        setUserRole(role);
      } catch (createError) {
        // If user already exists, try to sign in
        if (createError.code === 'auth/email-already-in-use') {
          console.log('User already exists, attempting to sign in...');
          try {
            const signInResult = await signInWithEmailAndPassword(auth, userData.email, userData.password);
            console.log('Sign in successful:', signInResult.user.uid);
            setUserRole(role);
          } catch (signInError) {
            console.error('Sign in error:', signInError.code, signInError.message);
            alert(`Login failed: ${signInError.message}`);
          }
        } else {
          console.error('Error creating account:', createError.code, createError.message);
          alert(`Login failed: ${createError.message}`);
        }
      }
    } catch (error) {
      console.error('General login error:', error);
      alert(`Login failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUserRole(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !user || !selectedBatch) {
      console.log('Cannot send message:', { 
        messageEmpty: !newMessage.trim(), 
        noUser: !user, 
        noBatch: !selectedBatch 
      });
      return;
    }
    
    try {
      console.log('Sending message:', {
        batchId: selectedBatch,
        text: newMessage,
        senderId: user.uid,
        senderName: userRole === 'manager' ? 'Manager' : 'Supplier'
      });

      const messagesRef = ref(database, `chats/${selectedBatch}`);
      const newMessageRef = push(messagesRef);
      
      const messageData = {
        text: newMessage,
        senderId: user.uid,
        senderName: userRole === 'manager' ? 'Manager' : 'Supplier',
        receiverId: userRole === 'manager' ? 'supplier' : 'manager',
        timestamp: serverTimestamp()
      };

      console.log('Message data:', messageData);
      
      await set(newMessageRef, messageData);
      console.log('Message sent successfully');
      
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert(`Failed to send message: ${error.message}`);
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 bg-blue-600 text-white">
          <h2 className="text-xl font-semibold">Real-time Chat System</h2>
        </div>
        
        {!user ? (
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">Login to chat</h3>
            <div className="flex space-x-4">
              <button
                onClick={() => handleLogin('manager')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Login as Manager
              </button>
              <button
                onClick={() => handleLogin('supplier')}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Login as Supplier
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-[600px]">
            <div className="p-4 border-b flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <span className="font-medium">
                  Logged in as: {userRole === 'manager' ? 'Manager' : 'Supplier'}
                </span>
                <select
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                  className="border rounded-md px-2 py-1"
                >
                  {mockBatches.map((batch) => (
                    <option key={batch.id} value={batch.id}>
                      {batch.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {messages.length === 0 ? (
                <div className="flex justify-center items-center h-full text-gray-500">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.senderId === user.uid ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs p-3 rounded-lg ${
                          message.senderId === user.uid
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        <div className="text-sm font-medium mb-1">
                          {message.senderName}
                        </div>
                        <div>{message.text}</div>
                        <div className="text-xs mt-1 opacity-70">
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
            
            <form onSubmit={handleSendMessage} className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSystem; 