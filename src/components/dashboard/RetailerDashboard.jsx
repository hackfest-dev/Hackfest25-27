import { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import LoadingSpinner from '../common/LoadingSpinner';
import ChatBox from '../common/ChatBox';

const RetailerDashboard = ({ selectedRole = "Retailer" }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: null });
  const [inventory, setInventory] = useState([
    {
      id: 'P001',
      name: 'Alphonso Mango Juice - 1L',
      sku: 'AMJ1L001',
      stock: 150,
      minStock: 50,
      price: 120,
      category: 'Beverages',
      expiryDate: '2024-06-15',
      manufacturer: 'Fresh Juice Co.',
      batchNumber: 'B789',
      lastRestocked: '2024-03-15'
    },
    {
      id: 'P002',
      name: 'Alphonso Mango Juice - 500ml',
      sku: 'AMJ500001',
      stock: 200,
      minStock: 75,
      price: 70,
      category: 'Beverages',
      expiryDate: '2024-06-15',
      manufacturer: 'Fresh Juice Co.',
      batchNumber: 'B790',
      lastRestocked: '2024-03-15'
    },
    {
      id: 'P003',
      name: 'Alphonso Mango Juice - 250ml',
      sku: 'AMJ250001',
      stock: 300,
      minStock: 100,
      price: 40,
      category: 'Beverages',
      expiryDate: '2024-06-15',
      manufacturer: 'Fresh Juice Co.',
      batchNumber: 'B791',
      lastRestocked: '2024-03-15'
    }
  ]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    stock: '',
    minStock: '',
    price: '',
    category: 'Beverages',
    expiryDate: '',
    manufacturer: '',
    batchNumber: ''
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stockAdjustment, setStockAdjustment] = useState({ quantity: 0, type: 'add' });

  useEffect(() => {
    // Set user data when component mounts
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser({
        uid: currentUser.uid,
        role: 'retailer'
      });
    }
  }, []);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setModalContent({
      title: 'Add New Product',
      content: (
        <form onSubmit={(e) => {
          e.preventDefault();
          const newId = `P${String(inventory.length + 1).padStart(3, '0')}`;
          setInventory([...inventory, { ...newProduct, id: newId, lastRestocked: new Date().toISOString().split('T')[0] }]);
          setNewProduct({
            name: '',
            sku: '',
            stock: '',
            minStock: '',
            price: '',
            category: 'Beverages',
            expiryDate: '',
            manufacturer: '',
            batchNumber: ''
          });
          setShowModal(false);
        }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Name</label>
              <input
                type="text"
                required
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">SKU</label>
                <input
                  type="text"
                  required
                  value={newProduct.sku}
                  onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Initial Stock</label>
                <input
                  type="number"
                  required
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Min Stock Level</label>
                <input
                  type="number"
                  required
                  value={newProduct.minStock}
                  onChange={(e) => setNewProduct({ ...newProduct, minStock: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  type="number"
                  required
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Manufacturer</label>
                <input
                  type="text"
                  required
                  value={newProduct.manufacturer}
                  onChange={(e) => setNewProduct({ ...newProduct, manufacturer: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Batch Number</label>
                <input
                  type="text"
                  required
                  value={newProduct.batchNumber}
                  onChange={(e) => setNewProduct({ ...newProduct, batchNumber: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
              <input
                type="date"
                required
                value={newProduct.expiryDate}
                onChange={(e) => setNewProduct({ ...newProduct, expiryDate: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm text-gray-600 bg-white rounded border hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm text-white bg-yellow-600 rounded hover:bg-yellow-700"
              >
                Add Product
              </button>
            </div>
          </div>
        </form>
      )
    });
    setShowModal(true);
  };

  const handleAdjustStock = (product) => {
    setSelectedProduct(product);
    setModalContent({
      title: 'Adjust Stock',
      content: (
        <form onSubmit={(e) => {
          e.preventDefault();
          const quantity = parseInt(stockAdjustment.quantity);
          setInventory(inventory.map(item => {
            if (item.id === product.id) {
              return {
                ...item,
                stock: stockAdjustment.type === 'add' 
                  ? item.stock + quantity 
                  : item.stock - quantity,
                lastRestocked: stockAdjustment.type === 'add' ? new Date().toISOString().split('T')[0] : item.lastRestocked
              };
            }
            return item;
          }));
          setStockAdjustment({ quantity: 0, type: 'add' });
          setShowModal(false);
        }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Adjustment Type</label>
              <select
                value={stockAdjustment.type}
                onChange={(e) => setStockAdjustment({ ...stockAdjustment, type: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              >
                <option value="add">Add Stock</option>
                <option value="remove">Remove Stock</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                min="1"
                required
                value={stockAdjustment.quantity}
                onChange={(e) => setStockAdjustment({ ...stockAdjustment, quantity: parseInt(e.target.value) || 0 })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm text-gray-600 bg-white rounded border hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm text-white bg-yellow-600 rounded hover:bg-yellow-700"
              >
                Adjust Stock
              </button>
            </div>
          </div>
        </form>
      )
    });
    setShowModal(true);
  };

  const handleRemoveProduct = (productId) => {
    if (window.confirm('Are you sure you want to remove this product?')) {
      setInventory(inventory.filter(item => item.id !== productId));
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

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
          {/* Chat with Distributor */}
          {user && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <ChatBox
                currentUser={user}
                partnerRole="distributor"
                chatId="distributor-retailer-chat"
              />
            </div>
          )}

          {/* Product Inventory Section */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Product Inventory</h2>
              <button
                onClick={handleAddProduct}
                className="px-4 py-2 text-sm text-white bg-yellow-600 rounded hover:bg-yellow-700"
              >
                Add New Product
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Restocked</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inventory.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">SKU: {product.sku}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product.stock} units</div>
                        <div className="text-sm text-gray-500">Min: {product.minStock}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">₹{product.price}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.stock > product.minStock
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.stock > product.minStock ? 'In Stock' : 'Low Stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.lastRestocked}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleAdjustStock(product)}
                          className="text-yellow-600 hover:text-yellow-900 mr-4"
                        >
                          Adjust Stock
                        </button>
                        <button
                          onClick={() => handleRemoveProduct(product.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
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

export default RetailerDashboard; 