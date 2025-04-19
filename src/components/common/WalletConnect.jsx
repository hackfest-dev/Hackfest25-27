import { useContract } from '../../hooks/useContract';
import LoadingSpinner from './LoadingSpinner';

const WalletConnect = () => {
  const { 
    account, 
    isConnected, 
    isLoading, 
    error, 
    networkError, 
    connectWallet, 
    switchToSepolia 
  } = useContract();

  // Format account address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="flex items-center space-x-2">
      {networkError && (
        <button
          onClick={switchToSepolia}
          className="px-3 py-1 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Switch to Sepolia
        </button>
      )}
      
      {error && (
        <div className="text-xs text-red-600">
          {error}
        </div>
      )}
      
      {isLoading ? (
        <div className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md">
          <LoadingSpinner size="sm" />
        </div>
      ) : isConnected ? (
        <div className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md">
          {formatAddress(account)}
        </div>
      ) : (
        <button
          onClick={connectWallet}
          className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default WalletConnect; 