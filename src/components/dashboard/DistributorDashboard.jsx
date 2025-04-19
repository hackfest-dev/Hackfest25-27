import { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import LoadingSpinner from '../common/LoadingSpinner';
import RoutePlanner from './RoutePlanner';
import ChatBox from '../common/ChatBox';

const DistributorDashboard = ({ selectedRole = "Distributor" }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: '',
    content: null
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log('Current role:', selectedRole); // Debug log
    // Set user data when component mounts
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser({
        uid: currentUser.uid,
        role: 'distributor'
      });
    }
  }, [selectedRole]);

  // Sample blockchain data
  const blockchainData = {
    shipments: [
      {
        id: 'TX001',
        batchId: 'B789',
        timestamp: '2024-03-15 10:30:00',
        supplier: 'Green Mango Valley',
        manufacturer: 'Fresh Juice Co.',
        quantity: '500 L',
        transactionHash: '0x1234...5678',
        status: 'Verified',
        temperature: '4°C',
        quality: 'A+',
        blockNumber: '12345678',
        previousHash: '0xabcd...efgh'
      },
      {
        id: 'TX002',
        batchId: 'B790',
        timestamp: '2024-03-16 09:15:00',
        supplier: 'Green Mango Valley',
        manufacturer: 'Fresh Juice Co.',
        quantity: '300 L',
        transactionHash: '0x8765...4321',
        status: 'Pending Verification',
        temperature: '5°C',
        quality: 'A',
        blockNumber: '12345679',
        previousHash: '0x1234...5678'
      }
    ]
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyBlockchain = (shipmentId) => {
    const shipment = blockchainData.shipments.find(s => s.id === shipmentId);
    setModalContent({
      title: 'Blockchain Verification',
      content: (
        <div className="space-y-4">
          <div className="p-4 bg-white rounded border">
            <h3 className="text-sm font-medium mb-3">Transaction Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Transaction Hash:</span>
                <span className="text-sm font-mono">{shipment.transactionHash}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Block Number:</span>
                <span className="text-sm font-mono">{shipment.blockNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Previous Hash:</span>
                <span className="text-sm font-mono">{shipment.previousHash}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Timestamp:</span>
                <span className="text-sm">{shipment.timestamp}</span>
              </div>
            </div>
          </div>
          <div className="p-4 bg-white rounded border">
            <h3 className="text-sm font-medium mb-3">Shipment Information</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Batch ID:</span>
                <span className="text-sm">{shipment.batchId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Supplier:</span>
                <span className="text-sm">{shipment.supplier}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Manufacturer:</span>
                <span className="text-sm">{shipment.manufacturer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Quantity:</span>
                <span className="text-sm">{shipment.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Quality Grade:</span>
                <span className="text-sm">{shipment.quality}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Temperature:</span>
                <span className="text-sm">{shipment.temperature}</span>
              </div>
            </div>
          </div>
          <div className="p-4 bg-white rounded border">
            <h3 className="text-sm font-medium mb-3">Verification Status</h3>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 text-sm ${
                shipment.status === 'Verified' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              } rounded-full`}>
                {shipment.status}
              </span>
              {shipment.status === 'Verified' && (
                <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </div>
        </div>
      )
    });
    setShowModal(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Nexus Chain</h1>
          <button
            onClick={handleLogout}
            disabled={loading}
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
          >
            {loading ? 'Signing out...' : 'Sign out'}
          </button>
        </div>
        
        <div className="space-y-6">
          {/* Route Planner Section */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-6">Route Planner & Shipment Tracker</h2>
            <RoutePlanner />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Chat with Manufacturer */}
            {user && (
              <ChatBox
                currentUser={user}
                partnerRole="manufacturer"
                chatId={`manufacturer-distributor-${user.uid}`}
              />
            )}

            {/* Chat with Retailer */}
            {user && (
              <ChatBox
                currentUser={user}
                partnerRole="retailer"
                chatId={`distributor-retailer-${user.uid}`}
              />
            )}
          </div>

          {/* Blockchain Verification Section */}
          <div className="bg-gray-50 p-4 rounded-lg lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Blockchain Verification</h2>
            <div className="space-y-3">
              {blockchainData.shipments.map(shipment => (
                <div key={shipment.id} className="p-4 bg-white rounded border">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-sm font-medium">Batch #{shipment.batchId}</h3>
                      <p className="text-xs text-gray-500">Transaction ID: {shipment.id}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      shipment.status === 'Verified' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {shipment.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div>
                      <p className="text-xs text-gray-500">Quantity</p>
                      <p className="text-sm">{shipment.quantity}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Temperature</p>
                      <p className="text-sm">{shipment.temperature}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Timestamp</p>
                      <p className="text-sm">{shipment.timestamp}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Quality</p>
                      <p className="text-sm">{shipment.quality}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-between items-center">
                    <p className="text-xs text-gray-500">
                      Hash: <span className="font-mono">{shipment.transactionHash}</span>
                    </p>
                    <button
                      onClick={() => handleVerifyBlockchain(shipment.id)}
                      className="px-3 py-1 text-sm text-yellow-600 bg-white rounded border border-yellow-200 hover:bg-yellow-50"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Schedule */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Juice Shipping Schedule</h2>
            <div className="space-y-2">
              <div className="p-3 bg-white rounded border">
                <p className="text-sm font-medium">Route #A123</p>
                <p className="text-sm text-gray-600">From: Mango Juice Manufacturer</p>
                <p className="text-sm text-gray-600">To: Retailer B</p>
                <p className="text-sm text-gray-600">Quantity: 500 L</p>
                <p className="text-sm text-gray-600">Status: Scheduled</p>
              </div>
              <div className="p-3 bg-white rounded border">
                <p className="text-sm font-medium">Route #A124</p>
                <p className="text-sm text-gray-600">From: Mango Juice Manufacturer</p>
                <p className="text-sm text-gray-600">To: Retailer C</p>
                <p className="text-sm text-gray-600">Quantity: 300 L</p>
                <p className="text-sm text-gray-600">Status: In Progress</p>
              </div>
            </div>
          </div>

          {/* Shipment Tracking */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Juice Shipment Tracking</h2>
            <div className="space-y-2">
              <div className="p-3 bg-white rounded border">
                <p className="text-sm font-medium">Shipment #S789</p>
                <p className="text-sm text-gray-600">Product: Alphonso Mango Juice</p>
                <p className="text-sm text-gray-600">Quantity: 500 L</p>
                <p className="text-sm text-gray-600">Current Location: City X</p>
                <p className="text-sm text-gray-600">ETA: 2 hours</p>
                <div className="mt-2">
                  <button className="text-sm text-yellow-600 hover:text-yellow-700">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Route Issues */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Distribution Issues</h2>
            <div className="space-y-2">
              <div className="p-3 bg-white rounded border">
                <p className="text-sm font-medium text-red-600">Temperature Alert</p>
                <p className="text-sm text-gray-600">Route: #A123</p>
                <p className="text-sm text-gray-600">Issue: Temperature above recommended range</p>
                <p className="text-sm text-gray-600">Status: Resolving</p>
                <button className="mt-2 text-sm text-yellow-600 hover:text-yellow-700">
                  Update Status
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-2">
              <div className="p-3 bg-white rounded border">
                <p className="text-sm text-gray-600">New juice route assigned</p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
              <div className="p-3 bg-white rounded border">
                <p className="text-sm text-gray-600">Juice shipment delivered</p>
                <p className="text-xs text-gray-500">3 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">{modalContent.title}</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {modalContent.content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DistributorDashboard; 