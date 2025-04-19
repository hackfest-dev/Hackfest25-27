import { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import LoadingSpinner from '../common/LoadingSpinner';
import DemandForecast from './DemandForecast';
import CreateBatchForm from './CreateBatchForm';
import ReportViewer from './ReportViewer';
import ChatBox from '../common/ChatBox';

const ManufacturerDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: null });
  const [batches, setBatches] = useState([
    // Initial fake data
    { id: 'B001', productName: 'Sample Product', quantity: 100, date: '2024-03-19', status: 'Processing' }
  ]);
  const [user, setUser] = useState(null);

  // Fake data for different actions
  const fakeProductionSchedule = [
    { id: 'PS001', product: 'Alphonso Mango Juice', date: '2024-03-20', quantity: 500, status: 'Scheduled' },
    { id: 'PS002', product: 'Alphonso Mango Juice', date: '2024-03-21', quantity: 750, status: 'In Progress' },
    { id: 'PS003', product: 'Alphonso Mango Juice', date: '2024-03-22', quantity: 300, status: 'Pending' },
  ];

  useEffect(() => {
    // Set user data when component mounts
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser({
        uid: currentUser.uid,
        role: 'manufacturer'
      });
    }
  }, []);

  const handleCreateBatch = () => {
    setModalContent({
      title: 'Create New Batch',
      content: <CreateBatchForm onSubmit={handleSubmitBatch} onClose={() => setShowModal(false)} />
    });
    setShowModal(true);
  };

  const handleSubmitBatch = (data) => {
    const batchId = `B${String(batches.length + 1).padStart(3, '0')}`;
    const newBatchEntry = {
      id: batchId,
      productName: data.productName,
      quantity: parseInt(data.quantity),
      date: data.date,
      status: 'Processing'
    };

    setBatches([...batches, newBatchEntry]);
    setShowModal(false);
  };

  const handleViewSchedule = () => {
    setModalContent({
      title: 'Production Schedule',
      content: (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">ID</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Product</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Quantity</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fakeProductionSchedule.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-2 text-sm text-gray-900">{item.id}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{item.product}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{item.date}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{item.quantity}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    });
    setShowModal(true);
  };

  const handleGenerateReports = () => {
    setModalContent({
      title: 'Reports',
      content: <ReportViewer onClose={() => setShowModal(false)} />
    });
    setShowModal(true);
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

  const handleMintNFT = () => {
    navigate('/blockchain', { state: { fromManufacturerDashboard: true } });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Alphonso Mango Juice Manufacturing</h1>
          <button
            onClick={handleLogout}
            disabled={loading}
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
          >
            {loading ? 'Signing out...' : 'Sign out'}
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* NFT Management */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Product NFT Management</h2>
            <div className="space-y-2">
              <button
                onClick={handleMintNFT}
                className="w-full px-4 py-2 text-sm text-yellow-600 bg-white rounded border border-yellow-200 hover:bg-yellow-50"
              >
                Mint New Juice Batch NFT
              </button>
              <button
                onClick={() => navigate('/blockchain', { state: { fromManufacturerDashboard: true, initialTab: 'ledger' } })}
                className="w-full px-4 py-2 text-sm text-yellow-600 bg-white rounded border border-yellow-200 hover:bg-yellow-50"
              >
                View Juice Production Ledger
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button
                onClick={handleCreateBatch}
                className="w-full px-4 py-2 text-sm text-yellow-600 bg-white rounded border border-yellow-200 hover:bg-yellow-50"
              >
                Create New Juice Batch
              </button>
              <button
                onClick={handleViewSchedule}
                className="w-full px-4 py-2 text-sm text-yellow-600 bg-white rounded border border-yellow-200 hover:bg-yellow-50"
              >
                View Juice Production Schedule
              </button>
              <button
                onClick={handleGenerateReports}
                className="w-full px-4 py-2 text-sm text-yellow-600 bg-white rounded border border-yellow-200 hover:bg-yellow-50"
              >
                Generate Production Reports
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* AI Demand Forecast */}
          <DemandForecast />

          {/* Created Batches */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Juice Production Batches</h2>
            <div className="space-y-2">
              {batches.map((batch) => (
                <div key={batch.id} className="p-3 bg-white rounded border">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Batch #{batch.id}</p>
                      <p className="text-sm text-gray-600">Alphonso Mango Juice</p>
                      <p className="text-sm text-gray-600">Quantity: {batch.quantity} L</p>
                      <p className="text-sm text-gray-600">Date: {batch.date}</p>
                    </div>
                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                      {batch.status}
                    </span>
                  </div>
                </div>
              ))}
              {batches.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  No juice batches created yet
                </div>
              )}
            </div>
          </div>

          {/* Incoming Supplies */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Incoming Mango Supplies</h2>
            <div className="space-y-2">
              <div className="p-3 bg-white rounded border">
                <p className="text-sm font-medium">Batch #1234</p>
                <p className="text-sm text-gray-600">From: Alphonso Mango Farm A</p>
                <p className="text-sm text-gray-600">Quantity: 1000 kg</p>
                <p className="text-sm text-gray-600">Status: In Transit</p>
              </div>
              <div className="p-3 bg-white rounded border">
                <p className="text-sm font-medium">Batch #1235</p>
                <p className="text-sm text-gray-600">From: Alphonso Mango Farm B</p>
                <p className="text-sm text-gray-600">Quantity: 800 kg</p>
                <p className="text-sm text-gray-600">Status: Arriving Today</p>
              </div>
            </div>
          </div>

          {/* Batch Tracking */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Juice Production Tracking</h2>
            <div className="space-y-2">
              <div className="p-3 bg-white rounded border">
                <p className="text-sm font-medium">Batch #1234</p>
                <p className="text-sm text-gray-600">Status: Processing</p>
                <p className="text-sm text-gray-600">Location: Juice Production Line A</p>
                <p className="text-sm text-gray-600">Current Stage: Pasteurization</p>
              </div>
            </div>
          </div>

          {/* Chat with Supplier */}
          {user && (
            <ChatBox
              currentUser={user}
              partnerRole="supplier"
              chatId="supplier-manufacturer-chat"
            />
          )}

          {/* Chat with Distributor */}
          {user && (
            <ChatBox
              currentUser={user}
              partnerRole="distributor"
              chatId={`manufacturer-distributor-${user.uid}`}
            />
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{modalContent.title}</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
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

export default ManufacturerDashboard; 