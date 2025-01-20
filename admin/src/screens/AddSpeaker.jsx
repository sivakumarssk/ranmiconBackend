// File: src/components/AddSpeaker.js
import React, { useState } from 'react';
import axios from 'axios';
import './AddSpeaker.css';

const AddSpeaker = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: null,
        category: 'speaker', // Default category
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('image', formData.image);

        let endpoint = '';
        switch (formData.category) {
            case 'speaker':
                endpoint = 'https://admin.ranmicon.com/api/addSpeaker';
                break;
            case 'keynote':
                endpoint = 'https://admin.ranmicon.com/api/addKeynoteSpeaker';
                break;
            case 'committee':
                endpoint = 'https://admin.ranmicon.com/api/addCommittee';
                break;
            default:
                break;
        }

        try {
            await axios.post(endpoint, data);
            alert(`${formData.category} added successfully!`);
            setFormData({ name: '', description: '', image: null, category: 'speaker' });
        } catch (error) {
            console.error(`Error adding ${formData.category}:`, error);
        }
    };

    return (
        <div className="add-speaker-container">
            <h1>Add Speaker</h1>
            <form className="add-speaker-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Description:</label>
                    <input
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Image:</label>
                    <input type="file" name="image" onChange={handleFileChange} required />
                </div>
                <div className="form-group">
                    <label>Category:</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="speaker">Speaker</option>
                        <option value="keynote">Keynote Speaker</option>
                        <option value="committee">Committee Member</option>
                    </select>
                </div>
                <button className="submit-button" type="submit">
                    Add {formData.category}
                </button>
            </form>
        </div>
    );
};

export default AddSpeaker;
