import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AbstractList.css';

const AbstractList = () => {
    const [abstracts, setAbstracts] = useState([]); // Store abstract data
    const [error, setError] = useState(''); // Store error message

    // Fetch data from the API
    const fetchAbstractData = async () => {
        try {
            const response = await axios.get('https://admin.ranmicon.com/api/allAbstract'); // Replace with your backend URL
            setAbstracts(response.data.abstracts || []);
        } catch (error) {
            console.error('Error fetching abstract data:', error);
            setError('Failed to fetch abstract data.');
        }
    };

    useEffect(() => {
        fetchAbstractData();
    }, []);

    return (
        <div className="abstract-container">
            <h1>Abstract Submissions</h1>
            {error && <p className="error-message">{error}</p>}
            {abstracts.length > 0 ? (
                <table className="abstract-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Organization</th>
                            <th>Phone</th>
                            <th>Country</th>
                            <th>Interested In</th>
                            <th>Session</th>
                            <th>Attachment</th>
                            {/* <th>Topics</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {abstracts.map((abstract, index) => (
                            <tr key={index}>
                                <td>{abstract.title || 'N/A'}</td>
                                <td>{abstract.name || 'N/A'}</td>
                                <td>{abstract.email || 'N/A'}</td>
                                <td>{abstract.organization || 'N/A'}</td>
                                <td>{abstract.phone || 'N/A'}</td>
                                <td>{abstract.country || 'N/A'}</td>
                                <td>{abstract.interestedIn || 'N/A'}</td>
                                <td>{abstract.session || 'N/A'}</td>
                                <td>
                                    {abstract.attachFile ? (
                                        <a
                                            href={`https://admin.ranmicon.com${abstract.attachFile}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            View File
                                        </a>
                                    ) : (
                                        'N/A'
                                    )}
                                </td>
                                {/* <td>
                                    {abstract.topics && abstract.topics.length > 0
                                        ? abstract.topics.join(', ')
                                        : 'N/A'}
                                </td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No abstract data available.</p>
            )}
        </div>
    );
};

export default AbstractList;
