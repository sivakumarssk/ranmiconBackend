import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './RegistrationList.css';

const RegistrationList = () => {
    const [registrations, setRegistrations] = useState([]); // Store registration data
    const [error, setError] = useState(''); // Store error message

    // Fetch data from the API
    const fetchRegistrationData = async () => {
        try {
            const response = await axios.get('https://admin.ranmicon.com/api/registrations'); // Replace with your backend URL
            setRegistrations(response.data || []);
        } catch (error) {
            console.error('Error fetching registration data:', error);
            setError('Failed to fetch registration data.');
        }
    };

    useEffect(() => {
        fetchRegistrationData();
    }, []);

    return (
        <div className="registration-container">
            <h1>Registration List</h1>
            {error && <p className="error-message">{error}</p>}
            {registrations.length > 0 ? (
                <div className="registration-table-container">
                    <table className="registration-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Organization/Institution</th>
                                {/* <th>Interested In</th> */}
                                <th>Country</th>
                                <th>Plan</th>
                                <th>Payment Status</th>
                                <th>Accommodations</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registrations.map((registration, index) => (
                                <tr key={index}>
                                    <td>{registration.title || 'N/A'}</td>
                                    <td>{registration.name || 'N/A'}</td>
                                    <td>{registration.email || 'N/A'}</td>
                                    <td>{registration.phone || 'N/A'}</td>
                                    <td>{registration.organization || 'N/A'}</td>
                                    {/* <td>{registration.interestedIn || 'N/A'}</td> */}
                                    <td>{registration.country || 'N/A'}</td>
                                    <td>
                                        {registration.selectedPlan
                                            ? `${registration.selectedPlan.planName} ($${registration.selectedPlan.price})`
                                            : 'N/A'}
                                    </td>
                                    <td>{registration.payment.status || 'N/A'}</td>
                                    <td>
                                        {registration.accommodations && registration.accommodations.length > 0
                                            ? registration.accommodations.map((acc, i) => (
                                                <div key={i}>
                                                    {acc.name} (${acc.price})
                                                </div>
                                            ))
                                            : 'None'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>No registration data available.</p>
            )}
        </div>

    );
};

export default RegistrationList;
