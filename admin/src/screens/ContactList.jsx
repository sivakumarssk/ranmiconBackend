import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ContactList.css";

const ContactList = () => {
    const [contacts, setContacts] = useState([]);
    const [error, setError] = useState("");

    // Fetch contacts from the server
    const fetchContacts = async () => {
        try {
            const response = await axios.get("https://admin.ranmicon.com/api/contact");
            setContacts(response.data.data || []);
            setError("");
        } catch (err) {
            console.error(err);
            setError("Failed to fetch contacts.");
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    return (
        <div className="contact-list-container">
            <h1>Contact List</h1>
            {error && <p className="error-message">{error}</p>}
            {contacts.length > 0 ? (
                <table className="contact-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone Number</th>
                            <th>Message</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contacts.map((contact, index) => (
                            <tr key={index}>
                                <td>{contact.name}</td>
                                <td>{contact.email}</td>
                                <td>{contact.phone}</td>
                                <td>{contact.message}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No contacts available.</p>
            )}
        </div>
    );
};

export default ContactList;
