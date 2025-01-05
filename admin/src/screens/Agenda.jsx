// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Agenda.css';

function Agenda() {
  const [date, setDate] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [agendas, setAgendas] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch agendas from backend
  const fetchAgendas = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://admin.emdcconference.com/api/getAgenda');
      setAgendas(response.data.agendas);
    } catch (error) {
      console.error(error);
      alert('Failed to load agendas');
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload
  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  // Add new agenda
  const handleAddAgenda = async (e) => {
    e.preventDefault();
    if (!date || !pdfFile) {
      alert('Please provide a date and select a PDF file.');
      return;
    }

    const formData = new FormData();
    formData.append('date', date);
    formData.append('pdfFile', pdfFile);

    try {
      await axios.post('https://admin.emdcconference.com/api/addAgenda', formData);
      setDate('');
      setPdfFile(null);
      fetchAgendas();
      alert('Agenda added successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to add agenda');
    }
  };

  // Delete an agenda by ID
  const handleDeleteAgenda = async (id) => {
    try {
      await axios.delete(`https://admin.emdcconference.com/api/deleteAgenda/${id}`);
      fetchAgendas();
      alert('Agenda deleted successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to delete agenda');
    }
  };

  useEffect(() => {
    fetchAgendas();
  }, []);

  return (
    <div className="manage-agenda-container">
      <h1>Manage Agenda</h1>
      <form onSubmit={handleAddAgenda} className="form-container2">
        <label>Date</label>
        <input
          type="text"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <label>PDF File</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
        />
        <button type="submit">Add Agenda</button>
      </form>

      <h2>Existing Agendas</h2>
      {loading ? <p>Loading...</p> : (
        <ul>
          {agendas.map((agenda) => (
            <li key={agenda._id} className="agenda-item">
              <p>Date: {agenda.date}</p>
              <a href={`http://localhost:5000${agenda.pdf}`} target="_blank" rel="noopener noreferrer">
                View PDF
              </a>
              <button onClick={() => handleDeleteAgenda(agenda._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Agenda;
