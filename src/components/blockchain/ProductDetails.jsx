import { useState, useEffect } from 'react';
import { useContract } from '../../hooks/useContract';
import LoadingSpinner from '../common/LoadingSpinner';
import { QRCodeSVG } from 'qrcode.react';

const STATUS_STEPS = {
  0: { name: 'Created', color: 'bg-blue-500' },
  1: { name: 'Verified', color: 'bg-green-500' },
  2: { name: 'Finalized', color: 'bg-purple-500' }
};

const ProductDetails = ({ productId }) => {
  const { contract, isConnected, networkError } = useContract();
  
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!productId) {
        setError('Product ID is required');
        setIsLoading(false);
        return;
      }
      
      if (!isConnected) {
        setError('Please connect your wallet to view product details');
        setIsLoading(false);
        return;
      }
      
      if (networkError) {
        setError('Please switch to Sepolia testnet');
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        const numericProductId = Number(productId);
        if (isNaN(numericProductId)) {
          throw new Error('Invalid Product ID - must be a number');
        }
        
        const productData = await contract.getProductById(numericProductId);
        
        const formattedProduct = {
          id: productId,
          batchId: productData[0],
          certification: productData[1],
          origin: productData[2],
          timestamp: new Date(Number(productData[3]) * 1000).toLocaleString(),
          owner: productData[4],
          status: Number(productData[5])
        };
        
        setProduct(formattedProduct);
      } catch (err) {
        console.error('Error fetching product details:', err);
        if (err.message.includes('Product does not exist')) {
          setError('Product not found - Please check the Product ID');
        } else {
          setError(err.message || 'Failed to fetch product details. Please try again.');
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProductDetails();
  }, [productId, contract, isConnected, networkError]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="p-4 bg-yellow-50 text-yellow-700 rounded-md">
          Product not found
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Details</h2>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Product ID</h3>
            <p className="mt-1 text-lg text-gray-900">{product.id}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Batch ID</h3>
            <p className="mt-1 text-lg text-gray-900">{product.batchId}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Certification</h3>
            <p className="mt-1 text-lg text-gray-900">{product.certification}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Origin</h3>
            <p className="mt-1 text-lg text-gray-900">{product.origin}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Timestamp</h3>
            <p className="mt-1 text-lg text-gray-900">{product.timestamp}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Owner</h3>
            <p className="mt-1 text-lg text-gray-900">
              {`${product.owner.slice(0, 6)}...${product.owner.slice(-4)}`}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Status</h3>
            <div className="mt-2">
              <div className="relative">
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                  {Object.entries(STATUS_STEPS).map(([step, { name, color }], index) => (
                    <div
                      key={step}
                      className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                        index <= product.status ? color : 'bg-gray-300'
                      }`}
                      style={{ width: '33.33%' }}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  {Object.entries(STATUS_STEPS).map(([step, { name }]) => (
                    <span
                      key={step}
                      className={`${
                        Number(step) <= product.status
                          ? 'font-semibold'
                          : 'text-gray-400'
                      }`}
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Product QR Code</h3>
          <div className="flex justify-center">
            <QRCodeSVG 
              value={`${window.location.origin}/product/${product.id}`} 
              size={200}
              level="M"
              includeMargin={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails; 