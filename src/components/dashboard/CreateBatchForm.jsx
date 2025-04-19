import { useState } from 'react';

const CreateBatchForm = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    productName: '',
    quantity: '',
    date: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    if (!formData.productName || !formData.quantity || !formData.date) {
      alert('Please fill in all fields');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Product Name</label>
        <input
          type="text"
          name="productName"
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Enter product name"
          value={formData.productName}
          onChange={handleInputChange}
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Quantity</label>
        <input
          type="number"
          name="quantity"
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Enter quantity"
          value={formData.quantity}
          onChange={handleInputChange}
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Production Date</label>
        <input
          type="date"
          name="date"
          className="w-full px-3 py-2 border rounded-md"
          value={formData.date}
          onChange={handleInputChange}
        />
      </div>
      <button
        onClick={handleSubmit}
        className="w-full px-4 py-2 text-sm text-white bg-yellow-600 rounded hover:bg-yellow-700"
      >
        Create Batch
      </button>
    </div>
  );
};

export default CreateBatchForm; 