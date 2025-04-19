import { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import LoadingSpinner from '../common/LoadingSpinner';
import ChatBox from '../common/ChatBox';

const SupplierDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [batches, setBatches] = useState([]);
  const [newBatch, setNewBatch] = useState({
    quantity: '',
    harvestDate: '',
    quality: 'A',
    notes: ''
  });
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: '',
    content: null
  });
  const [scheduledSupplies, setScheduledSupplies] = useState([]);
  const [user, setUser] = useState(null);

  // Fake analytics data
  const analyticsData = {
    totalHarvest: '25,000 kg',
    averageQuality: 'A Grade',
    efficiency: '92%',
    monthlyTrends: [
      { month: 'Jan', harvest: 2000 },
      { month: 'Feb', harvest: 2200 },
      { month: 'Mar', harvest: 2500 }
    ],
    qualityDistribution: {
      'A+': '45%',
      'A': '35%',
      'B': '20%'
    }
  };

  // Fake reports data
  const reportsData = {
    recent: [
      {
        id: 'R001',
        title: 'March Harvest Summary',
        date: '2024-03-15',
        type: 'Monthly'
      },
      {
        id: 'R002',
        title: 'Quality Analysis Q1',
        date: '2024-03-10',
        type: 'Quarterly'
      },
      {
        id: 'R003',
        title: 'Supplier Performance',
        date: '2024-03-05',
        type: 'Special'
      }
    ]
  };

  // Fake settings data
  const settingsData = {
    farmDetails: {
      name: 'Green Mango Valley',
      location: 'Maharashtra, India',
      capacity: '30,000 kg/month'
    },
    qualityParameters: {
      'A+': 'Perfect ripeness, No blemishes',
      'A': 'Optimal ripeness, Minor blemishes',
      'B': 'Slightly overripe, Visible blemishes'
    },
    notifications: {
      email: true,
      sms: true,
      app: true
    }
  };

  // Simulated initial data
  useEffect(() => {
    // Simulate fetching initial data
    setBatches([
      {
        id: 'B123',
        quantity: 1000,
        harvestDate: '2024-03-15',
        quality: 'A',
        status: 'Pending Verification',
        notes: 'First harvest of the season'
      },
      {
        id: 'B124',
        quantity: 800,
        harvestDate: '2024-03-14',
        quality: 'A+',
        status: 'Verified',
        transactionHash: '0x123...',
        notes: 'Premium quality batch'
      }
    ]);

    setMessages([
      {
        id: 1,
        sender: 'Manufacturer',
        content: 'We need 2000kg of Alphonso mangoes for next week.',
        timestamp: '2 hours ago'
      },
      {
        id: 2,
        sender: 'You',
        content: 'We can supply that quantity. Will prepare the batch.',
        timestamp: '1 hour ago'
      }
    ]);

    // Add scheduled supplies data
    setScheduledSupplies([
      {
        id: 'S001',
        manufacturerId: 'M123',
        manufacturerName: 'Fresh Juice Co.',
        quantity: 2000,
        scheduledDate: '2024-03-20',
        status: 'Pending',
        quality: 'A+',
        price: '₹180,000',
        notes: 'First batch of the season'
      },
      {
        id: 'S002',
        manufacturerId: 'M123',
        manufacturerName: 'Fresh Juice Co.',
        quantity: 1500,
        scheduledDate: '2024-03-25',
        status: 'Confirmed',
        quality: 'A',
        price: '₹120,000',
        notes: 'Regular weekly supply'
      },
      {
        id: 'S003',
        manufacturerId: 'M124',
        manufacturerName: 'Pure Mango Ltd.',
        quantity: 1800,
        scheduledDate: '2024-03-28',
        status: 'In Transit',
        quality: 'A+',
        price: '₹162,000',
        notes: 'Premium quality mangoes'
      }
    ]);

    // Set user data when component mounts
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser({
        uid: currentUser.uid,
        role: 'supplier'
      });
    }
  }, []);

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

  const handleBatchSubmit = (e) => {
    e.preventDefault();
    const batchId = `B${Math.floor(Math.random() * 1000)}`;
    const newBatchData = {
      id: batchId,
      ...newBatch,
      status: 'Pending Verification',
      harvestDate: new Date().toISOString().split('T')[0]
    };
    setBatches([...batches, newBatchData]);
    setNewBatch({
      quantity: '',
      harvestDate: '',
      quality: 'A',
      notes: ''
    });
  };

  const handleVerifyBatch = (batchId) => {
    setBatches(batches.map(batch => {
      if (batch.id === batchId) {
        return {
          ...batch,
          status: 'Verified',
          transactionHash: `0x${Math.random().toString(16).substr(2, 40)}`
        };
      }
      return batch;
    }));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: messages.length + 1,
      sender: 'You',
      content: newMessage,
      timestamp: 'Just now'
    };
    setMessages([...messages, message]);
    setNewMessage('');
  };

  const handleShowAnalytics = () => {
    setModalContent({
      title: 'Harvest Analytics',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-white rounded border">
              <p className="text-sm font-medium">Total Harvest</p>
              <p className="text-lg text-yellow-600">{analyticsData.totalHarvest}</p>
            </div>
            <div className="p-3 bg-white rounded border">
              <p className="text-sm font-medium">Average Quality</p>
              <p className="text-lg text-yellow-600">{analyticsData.averageQuality}</p>
            </div>
            <div className="p-3 bg-white rounded border">
              <p className="text-sm font-medium">Efficiency</p>
              <p className="text-lg text-yellow-600">{analyticsData.efficiency}</p>
            </div>
          </div>
          <div className="p-4 bg-white rounded border">
            <h3 className="text-sm font-medium mb-2">Quality Distribution</h3>
            <div className="space-y-2">
              {Object.entries(analyticsData.qualityDistribution).map(([grade, percentage]) => (
                <div key={grade} className="flex justify-between items-center">
                  <span className="text-sm">{grade} Grade</span>
                  <span className="text-sm text-yellow-600">{percentage}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 bg-white rounded border">
            <h3 className="text-sm font-medium mb-2">Monthly Trends</h3>
            <div className="space-y-2">
              {analyticsData.monthlyTrends.map(trend => (
                <div key={trend.month} className="flex justify-between items-center">
                  <span className="text-sm">{trend.month}</span>
                  <span className="text-sm text-yellow-600">{trend.harvest} kg</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    });
    setShowModal(true);
  };

  const handleShowReports = () => {
    setModalContent({
      title: 'Farm Reports',
      content: (
        <div className="space-y-4">
          {reportsData.recent.map(report => (
            <div key={report.id} className="p-4 bg-white rounded border">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-medium">{report.title}</h3>
                  <p className="text-xs text-gray-500">{report.date}</p>
                </div>
                <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                  {report.type}
                </span>
              </div>
              <button className="mt-2 text-sm text-yellow-600 hover:text-yellow-700">
                View Report
              </button>
            </div>
          ))}
          <button className="w-full px-4 py-2 text-sm text-yellow-600 bg-white rounded border border-yellow-200 hover:bg-yellow-50">
            Generate New Report
          </button>
        </div>
      )
    });
    setShowModal(true);
  };

  const handleShowSettings = () => {
    setModalContent({
      title: 'Farm Settings',
      content: (
        <div className="space-y-4">
          <div className="p-4 bg-white rounded border">
            <h3 className="text-sm font-medium mb-2">Farm Details</h3>
            <div className="space-y-2">
              {Object.entries(settingsData.farmDetails).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-sm capitalize">{key}</span>
                  <span className="text-sm text-gray-600">{value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 bg-white rounded border">
            <h3 className="text-sm font-medium mb-2">Quality Parameters</h3>
            <div className="space-y-2">
              {Object.entries(settingsData.qualityParameters).map(([grade, description]) => (
                <div key={grade} className="space-y-1">
                  <p className="text-sm font-medium">Grade {grade}</p>
                  <p className="text-sm text-gray-600">{description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 bg-white rounded border">
            <h3 className="text-sm font-medium mb-2">Notifications</h3>
            <div className="space-y-2">
              {Object.entries(settingsData.notifications).map(([type, enabled]) => (
                <div key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={() => {}}
                    className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm capitalize">{type} Notifications</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    });
    setShowModal(true);
  };

  // Add status color helper function
  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Confirmed': 'bg-green-100 text-green-800',
      'In Transit': 'bg-blue-100 text-blue-800',
      'Delivered': 'bg-gray-100 text-gray-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // Add supply action handler
  const handleSupplyAction = (supplyId, action) => {
    setScheduledSupplies(supplies => 
      supplies.map(supply => {
        if (supply.id === supplyId) {
          switch (action) {
            case 'confirm':
              return { ...supply, status: 'Confirmed' };
            case 'cancel':
              return { ...supply, status: 'Cancelled' };
            case 'start-delivery':
              return { ...supply, status: 'In Transit' };
            default:
              return supply;
          }
        }
        return supply;
      })
    );
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Add Scheduled Supplies section before other sections */}
          <div className="bg-gray-50 p-4 rounded-lg lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Scheduled Supplies</h2>
              <button 
                className="px-3 py-1 text-sm text-yellow-600 bg-white rounded border border-yellow-200 hover:bg-yellow-50"
                onClick={() => {/* Add new supply logic */}}
              >
                Schedule New Supply
              </button>
            </div>
            <div className="space-y-3">
              {scheduledSupplies.map(supply => (
                <div key={supply.id} className="p-4 bg-white rounded border">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-sm font-medium">{supply.manufacturerName}</h3>
                      <p className="text-xs text-gray-500">ID: {supply.id}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(supply.status)}`}>
                      {supply.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
                    <div>
                      <p className="text-xs text-gray-500">Quantity</p>
                      <p className="text-sm">{supply.quantity} kg</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Quality Grade</p>
                      <p className="text-sm">{supply.quality}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Scheduled Date</p>
                      <p className="text-sm">{supply.scheduledDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Price</p>
                      <p className="text-sm">{supply.price}</p>
                    </div>
                  </div>
                  {supply.notes && (
                    <p className="text-sm text-gray-600 mt-2">
                      Note: {supply.notes}
                    </p>
                  )}
                  <div className="flex space-x-2 mt-3">
                    {supply.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleSupplyAction(supply.id, 'confirm')}
                          className="px-3 py-1 text-xs text-green-600 bg-green-50 rounded hover:bg-green-100"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleSupplyAction(supply.id, 'cancel')}
                          className="px-3 py-1 text-xs text-red-600 bg-red-50 rounded hover:bg-red-100"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {supply.status === 'Confirmed' && (
                      <button
                        onClick={() => handleSupplyAction(supply.id, 'start-delivery')}
                        className="px-3 py-1 text-xs text-blue-600 bg-blue-50 rounded hover:bg-blue-100"
                      >
                        Start Delivery
                      </button>
                    )}
                    <button
                      onClick={() => {/* Add view details logic */}}
                      className="px-3 py-1 text-xs text-gray-600 bg-gray-50 rounded hover:bg-gray-100"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Batch Upload */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Create Mango Batch</h2>
            <form onSubmit={handleBatchSubmit} className="space-y-4">
              <div className="p-3 bg-white rounded border">
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="Quantity (kg)"
                    value={newBatch.quantity}
                    onChange={(e) => setNewBatch({...newBatch, quantity: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                  <select
                    value={newBatch.quality}
                    onChange={(e) => setNewBatch({...newBatch, quality: e.target.value})}
                    className="w-full p-2 border rounded"
                  >
                    <option value="A+">A+ Grade</option>
                    <option value="A">A Grade</option>
                    <option value="B">B Grade</option>
                  </select>
                  <textarea
                    placeholder="Notes"
                    value={newBatch.notes}
                    onChange={(e) => setNewBatch({...newBatch, notes: e.target.value})}
                    className="w-full p-2 border rounded"
                    rows="2"
                  />
                </div>
                <button
                  type="submit"
                  className="mt-4 w-full px-4 py-2 text-sm text-yellow-600 bg-white rounded border border-yellow-200 hover:bg-yellow-50"
                >
                  Create Batch
                </button>
              </div>
            </form>
          </div>

          {/* Blockchain Registration */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Mango Batch Registration</h2>
            <div className="space-y-2">
              {batches.map(batch => (
                <div key={batch.id} className="p-3 bg-white rounded border">
                  <p className="text-sm font-medium">Batch #{batch.id}</p>
                  <p className="text-sm text-gray-600">Quantity: {batch.quantity} kg</p>
                  <p className="text-sm text-gray-600">Quality: {batch.quality}</p>
                  <p className="text-sm text-gray-600">Status: {batch.status}</p>
                  {batch.transactionHash && (
                    <p className="text-sm text-gray-600">Transaction Hash: {batch.transactionHash}</p>
                  )}
                  {batch.status === 'Pending Verification' && (
                    <button
                      onClick={() => handleVerifyBatch(batch.id)}
                      className="mt-2 text-sm text-yellow-600 hover:text-yellow-700"
                    >
                      Verify Registration
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Manufacturer Chat */}
          {user && (
            <ChatBox
              currentUser={user}
              partnerRole="manufacturer"
              chatId="supplier-manufacturer-chat"
            />
          )}

          {/* Batch History */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Mango Batch History</h2>
            <div className="space-y-2">
              {batches.map(batch => (
                <div key={batch.id} className="p-3 bg-white rounded border">
                  <p className="text-sm font-medium">Batch #{batch.id}</p>
                  <p className="text-sm text-gray-600">Date: {batch.harvestDate}</p>
                  <p className="text-sm text-gray-600">Quantity: {batch.quantity} kg</p>
                  <p className="text-sm text-gray-600">Quality: {batch.quality}</p>
                  <p className="text-sm text-gray-600">Status: {batch.status}</p>
                  {batch.notes && (
                    <p className="text-sm text-gray-600">Notes: {batch.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button 
                onClick={handleShowAnalytics}
                className="w-full px-4 py-2 text-sm text-yellow-600 bg-white rounded border border-yellow-200 hover:bg-yellow-50"
              >
                View Harvest Analytics
              </button>
              <button 
                onClick={handleShowReports}
                className="w-full px-4 py-2 text-sm text-yellow-600 bg-white rounded border border-yellow-200 hover:bg-yellow-50"
              >
                Generate Farm Reports
              </button>
              <button 
                onClick={handleShowSettings}
                className="w-full px-4 py-2 text-sm text-yellow-600 bg-white rounded border border-yellow-200 hover:bg-yellow-50"
              >
                Farm Settings
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-2">
              {batches.slice(0, 2).map(batch => (
                <div key={batch.id} className="p-3 bg-white rounded border">
                  <p className="text-sm text-gray-600">
                    {batch.status === 'Verified' ? 'Batch verified' : 'New mango batch harvested'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {batch.status === 'Verified' ? '3 hours ago' : '1 hour ago'}
                  </p>
                </div>
              ))}
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

export default SupplierDashboard; 