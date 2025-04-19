import { useState } from 'react';
import { useContract } from '../../hooks/useContract';
import LoadingSpinner from '../common/LoadingSpinner';
import { QRCodeSVG } from 'qrcode.react';

const BlockchainProductForm = () => {
  const { contract, isConnected, networkError } = useContract();
  
  const [formData, setFormData] = useState({
    batchId: '',
    certification: '',
    origin: '',
    timestamp: new Date().toISOString().slice(0, 16) // Format: YYYY-MM-DDThh:mm
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [productId, setProductId] = useState(null);
  const [txHash, setTxHash] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isConnected) {
      setError('Please connect your wallet first');
      return;
    }
    
    if (networkError) {
      setError('Please switch to Sepolia testnet');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);
      setProductId(null);
      setTxHash(null);
      
      // Convert timestamp to Unix timestamp (seconds)
      const timestamp = Math.floor(new Date(formData.timestamp).getTime() / 1000);
      
      // Call the smart contract function to mint NFT
      const tx = await contract.mintNFT(
        formData.batchId,
        formData.certification,
        formData.origin,
        timestamp
      );
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      // Get the product ID from the event logs
      // This assumes your contract emits an event with the product ID
      const event = receipt.logs.find(log => log.fragment && log.fragment.name === 'ProductMinted');
      const newProductId = event ? event.args[0].toString() : null;
      
      setProductId(newProductId);
      setTxHash(receipt.hash);
      setSuccess('Product NFT minted successfully!');
      
      // Reset form
      setFormData({
        batchId: '',
        certification: '',
        origin: '',
        timestamp: new Date().toISOString().slice(0, 16)
      });
    } catch (err) {
      console.error('Error minting NFT:', err);
      setError(err.message || 'Failed to mint NFT. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Register Product on Blockchain</h2>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-md">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="batchId" className="block text-sm font-medium text-gray-700">
            Batch ID
          </label>
          <input
            type="text"
            id="batchId"
            name="batchId"
            value={formData.batchId}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
            placeholder="Enter batch ID"
          />
        </div>
        
        <div>
          <label htmlFor="certification" className="block text-sm font-medium text-gray-700">
            Certification
          </label>
          <input
            type="text"
            id="certification"
            name="certification"
            value={formData.certification}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
            placeholder="Enter certification details"
          />
        </div>
        
        <div>
          <label htmlFor="origin" className="block text-sm font-medium text-gray-700">
            Origin
          </label>
          <input
            type="text"
            id="origin"
            name="origin"
            value={formData.origin}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
            placeholder="Enter product origin"
          />
        </div>
        
        <div>
          <label htmlFor="timestamp" className="block text-sm font-medium text-gray-700">
            Timestamp
          </label>
          <input
            type="datetime-local"
            id="timestamp"
            name="timestamp"
            value={formData.timestamp}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
          />
        </div>
        
        <div>
          <button
            type="submit"
            disabled={isLoading || !isConnected || networkError}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? <LoadingSpinner /> : 'Mint Product NFT'}
          </button>
        </div>
      </form>
      
      {txHash && (
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Transaction Details</h3>
          <p className="text-sm text-gray-600 mb-2">
            Transaction Hash: <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="text-yellow-600 hover:text-yellow-700">{txHash.slice(0, 10)}...{txHash.slice(-8)}</a>
          </p>
          {productId && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Product ID: {productId}</p>
              <div className="flex justify-center mt-2">
                <QRCodeSVG 
                  value={`${window.location.origin}/product/${productId}`} 
                  size={128}
                  level="M"
                  includeMargin={true}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BlockchainProductForm; 