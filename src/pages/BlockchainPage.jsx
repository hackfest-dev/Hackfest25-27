import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BlockchainProductForm from '../components/blockchain/BlockchainProductForm';
import ProductDetails from '../components/blockchain/ProductDetails';
import ProductLedger from '../components/blockchain/ProductLedger';
import { useContract } from '../hooks/useContract';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import LoadingSpinner from '../components/common/LoadingSpinner';

const STATUS_STEPS = {
  0: 'Created',
  1: 'Verified',
  2: 'Finalized'
};

const BlockchainPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { contract, isConnected, networkError } = useContract();
  const [activeTab, setActiveTab] = useState(location.state?.initialTab || 'mint');
  const [searchProductId, setSearchProductId] = useState('');
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const role = userDoc.data().role;
            if (['manufacturer', 'distributor', 'retailer'].includes(role)) {
              setUserRole(role);
              if (role === 'manufacturer' && location.state?.fromManufacturerDashboard) {
                setActiveTab('mint');
              }
            } else {
              navigate('/not-authorized');
            }
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
          setError('Failed to fetch user role');
        }
      } else {
        navigate('/login');
      }
    };

    fetchUserRole();
  }, [navigate, location]);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedId = searchProductId.trim();
    if (trimmedId && !isNaN(Number(trimmedId))) {
      setShowProductDetails(true);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setSearchProductId(value);
    }
  };

  const handleVerifyProduct = async (productId) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const tx = await contract.verifyProduct(productId);
      await tx.wait();
      setSuccess('Product verified successfully');
      setShowProductDetails(false);
      setTimeout(() => setShowProductDetails(true), 100);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalizeProduct = async (productId) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const tx = await contract.finalizeProduct(productId);
      await tx.wait();
      setSuccess('Product finalized successfully');
      setShowProductDetails(false);
      setTimeout(() => setShowProductDetails(true), 100);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!userRole) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Supply Chain Product Registry</h1>
            <p className="mt-2 text-gray-600">
              {userRole === 'manufacturer' ? 'Mint and track your products' :
               userRole === 'distributor' ? 'Verify products in the supply chain' :
               'Finalize products for retail'}
            </p>
          </div>
          {location.state?.fromManufacturerDashboard && (
            <button
              onClick={() => navigate('/manufacturer')}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              ← Back to Dashboard
            </button>
          )}
        </div>
      </div>

      {!isConnected ? (
        <div className="max-w-md mx-auto p-6 bg-yellow-50 text-yellow-700 rounded-lg shadow-md">
          <p className="text-center">
            Please connect your wallet to use the supply chain features
          </p>
        </div>
      ) : networkError ? (
        <div className="max-w-md mx-auto p-6 bg-red-50 text-red-700 rounded-lg shadow-md">
          <p className="text-center">
            Please switch to Sepolia testnet to use the supply chain features
          </p>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => {
                    setActiveTab('mint');
                    setShowProductDetails(false);
                    setSearchProductId('');
                    setError(null);
                    setSuccess(null);
                  }}
                  className={`${
                    activeTab === 'mint'
                      ? 'border-yellow-500 text-yellow-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  {userRole === 'manufacturer' ? 'Mint Product NFT' : 'Track Product'}
                </button>
                {userRole !== 'manufacturer' && (
                  <button
                    onClick={() => {
                      setActiveTab('verify');
                      setShowProductDetails(false);
                      setSearchProductId('');
                      setError(null);
                      setSuccess(null);
                    }}
                    className={`${
                      activeTab === 'verify'
                        ? 'border-yellow-500 text-yellow-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    {userRole === 'distributor' ? 'Verify Product' : 'Finalize Product'}
                  </button>
                )}
                <button
                  onClick={() => {
                    setActiveTab('ledger');
                    setShowProductDetails(false);
                    setSearchProductId('');
                    setError(null);
                    setSuccess(null);
                  }}
                  className={`${
                    activeTab === 'ledger'
                      ? 'border-yellow-500 text-yellow-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  View All Products
                </button>
              </nav>
            </div>
          </div>

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

          {activeTab === 'ledger' ? (
            <ProductLedger />
          ) : activeTab === 'mint' && userRole === 'manufacturer' ? (
            <BlockchainProductForm />
          ) : (
            <div>
              <div className="max-w-md mx-auto mb-8">
                <form onSubmit={handleSearch} className="flex space-x-2">
                  <input
                    type="number"
                    min="1"
                    value={searchProductId}
                    onChange={handleInputChange}
                    placeholder="Enter Product ID"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                  />
                  <button
                    type="submit"
                    disabled={!searchProductId.trim() || isNaN(Number(searchProductId)) || loading}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Search
                  </button>
                </form>
              </div>

              {showProductDetails && searchProductId && (
                <div className="space-y-6">
                  <ProductDetails productId={Number(searchProductId)} />
                  
                  {userRole === 'distributor' && (
                    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Verify Product</h3>
                      <button
                        onClick={() => handleVerifyProduct(Number(searchProductId))}
                        disabled={loading}
                        className="w-full px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Verifying...' : 'Verify Product'}
                      </button>
                    </div>
                  )}

                  {userRole === 'retailer' && (
                    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Finalize Product</h3>
                      <button
                        onClick={() => handleFinalizeProduct(Number(searchProductId))}
                        disabled={loading}
                        className="w-full px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Finalizing...' : 'Finalize Product'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BlockchainPage; 