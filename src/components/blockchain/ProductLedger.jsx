import { useState, useEffect } from 'react';
import { useContract } from '../../hooks/useContract';
import LoadingSpinner from '../common/LoadingSpinner';
import { Link } from 'react-router-dom';

const STATUS_BADGES = {
  0: { name: 'Created', color: 'bg-blue-100 text-blue-800' },
  1: { name: 'Verified', color: 'bg-green-100 text-green-800' },
  2: { name: 'Finalized', color: 'bg-purple-100 text-purple-800' }
};

const ProductLedger = () => {
  const { contract, isConnected } = useContract();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  useEffect(() => {
    const fetchProducts = async () => {
      if (!contract || !isConnected) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const productPromises = [];
        // Try fetching products with IDs from 1 to 10 initially
        // We can adjust this range if needed
        for (let i = 1; i <= 10; i++) {
          const promise = (async (id) => {
            try {
              const product = await contract.getProductById(id);
              // Check if the product exists by verifying if batchId is not empty
              if (product && product[0]) {
                return {
                  id,
                  batchId: product[0],
                  certification: product[1],
                  origin: product[2],
                  timestamp: new Date(Number(product[3]) * 1000),
                  owner: product[4],
                  status: Number(product[5])
                };
              }
              return null;
            } catch (err) {
              // If the product doesn't exist, we'll get an error - that's okay
              return null;
            }
          })(i);
          
          productPromises.push(promise);
        }

        const fetchedProducts = await Promise.all(productPromises);
        const validProducts = fetchedProducts.filter(Boolean);

        if (validProducts.length === 0) {
          setError('No products found in the registry.');
        } else {
          // Sort products by ID in descending order (newest first)
          validProducts.sort((a, b) => b.id - a.id);
          setProducts(validProducts);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        if (err.code === 'CALL_EXCEPTION') {
          setError('Smart contract call failed. Please check your connection and try again.');
        } else if (err.code === 'NETWORK_ERROR') {
          setError('Network error. Please check your connection and try again.');
        } else {
          setError(`Failed to fetch products: ${err.message || 'Unknown error'}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    // Set up an interval to refresh the products every 30 seconds
    const intervalId = setInterval(fetchProducts, 30000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [contract, isConnected]);

  if (!isConnected) {
    return (
      <div className="bg-yellow-50 p-4 rounded-md text-yellow-700">
        <p className="font-medium">Wallet Not Connected</p>
        <p className="mt-1 text-sm">Please connect your wallet to view the product ledger.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <LoadingSpinner />
        <p className="mt-4 text-gray-600">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Products</h3>
        <p className="text-red-700">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Found</h3>
        <p className="text-gray-600">There are currently no products in the registry.</p>
      </div>
    );
  }

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Product Ledger
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Complete list of all products in the supply chain
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Batch ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Origin
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentProducts.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{product.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.batchId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.origin}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.timestamp.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${STATUS_BADGES[product.status].color}`}>
                    {STATUS_BADGES[product.status].name}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Link
                    to={`/product/${product.id}`}
                    className="text-yellow-600 hover:text-yellow-900"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstProduct + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(indexOfLastProduct, products.length)}
                </span>{' '}
                of <span className="font-medium">{products.length}</span> products
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductLedger; 