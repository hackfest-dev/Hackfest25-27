import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
          <button
            onClick={handleLogout}
            disabled={loading}
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
          >
            {loading ? 'Signing out...' : 'Sign out'}
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/chat')}
                className="w-full px-4 py-2 text-sm text-yellow-600 bg-white rounded border border-yellow-200 hover:bg-yellow-50"
              >
                Open Chat
              </button>
              <button
                className="w-full px-4 py-2 text-sm text-yellow-600 bg-white rounded border border-yellow-200 hover:bg-yellow-50"
              >
                View Reports
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">No recent activity</p>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Statistics</h2>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Loading statistics...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard; 