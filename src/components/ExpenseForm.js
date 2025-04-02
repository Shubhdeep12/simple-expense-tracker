'use client';

import { useState, useEffect } from 'react';

export default function ExpenseForm() {
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [newType, setNewType] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch expense types on component mount
  useEffect(() => {
    async function fetchTypes() {
      try {
        const response = await fetch('/api/types');
        const data = await response.json();
        if (data.types) {
          setTypes(data.types);
        }
      } catch (error) {
        console.error('Error fetching types:', error);
      }
    }

    fetchTypes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setMessageType('');

    try {
      // Determine the type to use
      const finalType = selectedType === 'custom' ? newType : selectedType;
      
      if (!finalType) {
        setMessage('Please select or enter a type');
        setMessageType('error');
        setLoading(false);
        return;
      }

      if (!amount || isNaN(parseFloat(amount))) {
        setMessage('Please enter a valid amount');
        setMessageType('error');
        setLoading(false);
        return;
      }

      // Submit the expense
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: finalType,
          amount: parseFloat(amount),
          date: new Date().toISOString(),
        }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage('Expense added successfully!');
        setMessageType('success');
        setShowSuccess(true);
        
        // Reset form
        setSelectedType('');
        setNewType('');
        setAmount('');
        
        // If a new type was added, update the types list
        if (selectedType === 'custom' && !types.includes(newType)) {
          setTypes([...types, newType]);
        }
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setShowSuccess(false);
          setMessage('');
        }, 3000);
      } else {
        setMessage(`Error: ${result.error}`);
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again.');
      setMessageType('error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Expense Type</label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="form-control"
          required
        >
          <option value="">Select a type</option>
          {types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
          <option value="custom">Add custom type</option>
        </select>
        
        {selectedType === 'custom' && (
          <div className="custom-type-input">
            <input
              type="text"
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              className="form-control"
              placeholder="Enter new expense type"
              required
            />
          </div>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Amount (₹)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="form-control"
          placeholder="Enter amount"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`submit-button ${loading ? 'loading-button' : ''}`}
      >
        {loading ? 'Adding expense...' : 'Add Expense'}
      </button>

      {message && (
        <div className={`message ${messageType === 'success' ? 'success-message' : 'error-message'}`}>
          {message}
        </div>
      )}
    </form>
  );
}