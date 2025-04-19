import { useNavigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import WalletConnect from './WalletConnect';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div 
          className="flex items-center cursor-pointer" 
          onClick={() => navigate('/')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-yellow-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
            />
          </svg>
          <span className="ml-2 text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            Nexus Chain
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/blockchain')}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-yellow-600 focus:outline-none"
          >
            Blockchain
          </button>
          <button
            onClick={() => navigate('/chat')}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-yellow-600 focus:outline-none"
          >
            <MessageSquare className="w-5 h-5 mr-1" />
            Chat with AI
          </button>
          <WalletConnect />
        </div>
      </div>
    </header>
  );
};

export default Header; 