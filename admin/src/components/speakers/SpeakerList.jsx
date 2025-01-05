// File: src/components/SpeakerList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Speaker.css';

const SpeakerList = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetchAllItems();
    }, []);

    const fetchAllItems = async () => {
        try {
            const response = await axios.get('https://admin.emdcconference.com/api/getAllSpeakers');
            const { speakers, keynoteSpeakers, committee } = response.data;

            // Adding category for each type of item
            const formattedData = [
                ...speakers.map((item) => ({ ...item, category: 'speaker' })),
                ...keynoteSpeakers.map((item) => ({ ...item, category: 'keynote' })),
                ...committee.map((item) => ({ ...item, category: 'committee' })),
            ];
            setItems(formattedData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const deleteItem = async (id, category) => {
        let endpoint = '';
        switch (category) {
            case 'speaker':
                endpoint = `https://admin.emdcconference.com/api/deleteSpeaker/${id}`;
                break;
            case 'keynote':
                endpoint = `https://admin.emdcconference.com/api/deleteKeynoteSpeaker/${id}`;
                break;
            case 'committee':
                endpoint = `https://admin.emdcconference.com/api/deleteCommitte/${id}`;
                break;
            default:
                break;
        }

        try {
            await axios.delete(endpoint);
            alert(`${category} deleted successfully!`);
            fetchAllItems(); // Refresh the list
        } catch (error) {
            console.error(`Error deleting ${category}:`, error);
        }
    };

    return (
        <div className="speaker-list-container">
            <h1>All Items</h1>
            <table className="items-table">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item._id}>
                            <td>
                                <img
                                    src={`http://localhost:5000${item.image}`}
                                    alt={item.name}
                                    className="item-image"
                                />
                            </td>
                            <td>{item.name}</td>
                            <td>{item.description}</td>
                            <td>{item.category}</td>
                            <td>
                                <button
                                    className="delete-button"
                                    onClick={() => deleteItem(item._id, item.category)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SpeakerList;
