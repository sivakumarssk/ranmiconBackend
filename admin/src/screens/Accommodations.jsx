import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Plans.css';

const Accommodations = () => {
  const [accommodations, setAccommodations] = useState([]); // List of accommodations
  const [formData, setFormData] = useState({ name: '', price: '' }); // Form state
  const [isEditing, setIsEditing] = useState(false); // Edit mode
  const [editingId, setEditingId] = useState(null); // ID of accommodation being edited
  const [error, setError] = useState(''); // Error message
  const [success, setSuccess] = useState(''); // Success message

  // Fetch accommodations on component mount
  useEffect(() => {
    fetchAccommodations();
  }, []);

  // Fetch accommodations from API
  const fetchAccommodations = async () => {
    try {
      const response = await axios.get('https://admin.ranmicon.com/api/getAccommodations');
      setAccommodations(response.data);
    } catch (error) {
      console.error('Error fetching accommodations:', error.message);
      setError('Failed to fetch accommodations');
    }
  };

  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission (Add or Update)
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || formData.price === '') {
      setError('Both name and price are required');
      return;
    }

    try {
      if (isEditing) {
        // Update accommodation
        await axios.put(`https://admin.ranmicon.com/api/updateAccommodation/${editingId}`, formData);
        setSuccess('Accommodation updated successfully');
      } else {
        // Add new accommodation
        await axios.post('https://admin.ranmicon.com/api/addAccommodation', formData);
        setSuccess('Accommodation added successfully');
      }

      // Reset form and fetch updated list
      setFormData({ name: '', price: '' });
      setIsEditing(false);
      setEditingId(null);
      fetchAccommodations();
      setError('');
    } catch (error) {
      console.error('Error saving accommodation:', error.message);
      setError('Failed to save accommodation');
    }
  };

  // Handle delete accommodation
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://admin.ranmicon.com/api/deleteAccommodation/${id}`);
      setSuccess('Accommodation deleted successfully');
      fetchAccommodations(); // Refresh list
    } catch (error) {
      console.error('Error deleting accommodation:', error.message);
      setError('Failed to delete accommodation');
    }
  };

  // Handle edit button click
  const handleEdit = (accommodation) => {
    setIsEditing(true);
    setEditingId(accommodation._id);
    setFormData({ name: accommodation.name, price: accommodation.price });
  };

  return (
    <div className="accommodations-container">
      <h1>Accommodations Management</h1>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      {/* Add/Edit Form */}
      <form className="accommodation-form" onSubmit={handleFormSubmit}>
        <h2>{isEditing ? 'Edit Accommodation' : 'Add Accommodation'}</h2>
        <input
          type="text"
          name="name"
          placeholder="Accommodation Name"
          value={formData.name}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Accommodation Price"
          value={formData.price}
          onChange={handleInputChange}
        />
        <button type="submit">{isEditing ? 'Update' : 'Add'}</button>
        {isEditing && (
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setEditingId(null);
              setFormData({ name: '', price: '' });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* Accommodations List */}
      <div className="accommodations-list">
        <h2>Accommodations</h2>
        { (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {accommodations.map((accommodation) => (
                <tr key={accommodation._id}>
                  <td>{accommodation.name}</td>
                  <td>${accommodation.price}</td>
                  <td>
                    <button onClick={() => handleEdit(accommodation)}>Edit</button>
                    <button onClick={() => handleDelete(accommodation._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Accommodations;
