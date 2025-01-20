// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManageDates.css';

function ManageDates() {
  const [key, setKey] = useState('');
  const [items, setItems] = useState([]);
  const [head, setHead] = useState('');
  const [date, setDate] = useState('');
  const [dates, setDates] = useState({});
  const [loading, setLoading] = useState(false);

  const addItem = () => {
    if (head && date) {
      setItems([...items, { head, date }]);
      setHead('');
      setDate('');
    } else {
      alert('Please fill in all fields');
    }
  };

  const handleAddDates = async () => {
    if (!key || items.length === 0) {
      alert('Please fill in all fields');
      return;
    }
    try {
      const response = await axios.post('https://admin.ranmicon.com/api/addDates', { key, items });
      setDates(response.data.data.dates);
      setKey('');
      setItems([]);
      alert('Dates added successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to add dates');
    }
  };

  const handleAddSingleItem = async () => {
    if (!key || !head || !date) {
      alert('Please fill in all fields');
      return;
    }
    try {
      const item = { head, date };
      const response = await axios.post('https://admin.ranmicon.com/api/addSingleDate', { key, item });
      setDates(response.data.data.dates);
      setHead('');
      setDate('');
      alert('Single date added successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to add single date');
    }
  };

  const handleDeleteItem = async (key, id) => {
    try {
      await axios.delete(`https://admin.ranmicon.com/api/deleteDates/${id}`);
      fetchDates();
      alert('Item deleted successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to delete item');
    }
  };

  const handleDeleteKey = async (key) => {
    try {
      await axios.delete(`https://admin.ranmicon.com/api/deleteKey/${key}`);
      fetchDates();
      alert(`Key "${key}" deleted successfully`);
    } catch (error) {
      console.error(error);
      alert('Failed to delete key');
    }
  };

  const fetchDates = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://admin.ranmicon.com/api/getdates');
      setDates(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDates();
  }, []);

  return (
    <div className="manage-dates-container">
      <h1>Date Management</h1>
      <div className="form-container">
        <label>Key</label>
        <input type="text" value={key} onChange={(e) => setKey(e.target.value)} />
        <label>Head</label>
        <input type="text" value={head} onChange={(e) => setHead(e.target.value)} />
        <label>Date</label>
        <input type="text" value={date} onChange={(e) => setDate(e.target.value)} />
        <div className='btnCon'>
        <button onClick={addItem}>Add Item</button>
        <button onClick={handleAddSingleItem}>Add Single Date</button>
        </div>
      </div>
      <button onClick={handleAddDates}>Submit Dates</button>

      <h4 className='headCom'>Items to Submit</h4>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            {item.head} - {item.date}
          </li>
        ))}
      </ul>

      <h4 className='headCom'>Stored Dates</h4>
      {loading ? <p>Loading...</p> : (
        Object.entries(dates).map(([key, items]) => (
          <div className="date-item" key={key}>
            <h3>{key}</h3>
            <ul>
              {items.map((item) => (
                <li key={item._id}>
                  {item.head} - {item.date}
                  <button onClick={() => handleDeleteItem(key, item._id)}>Delete</button>
                </li>
              ))}
            </ul>
            <button onClick={() => handleDeleteKey(key)}>Delete Key</button>
          </div>
        ))
      )}
    </div>
  );
}

export default ManageDates;
