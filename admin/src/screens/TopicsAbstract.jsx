import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Topic.css";

function TopicsAbstract() {
    const [topics, setTopics] = useState([]); // State to store topics list
    const [newTopic, setNewTopic] = useState(""); // State for new topic input
    const [error, setError] = useState(""); // State for error messages

    // Fetch topics from the server
    const fetchTopics = async () => {
        try {
            const response = await axios.get("https://admin.ranmicon.com/api/topic");
            console.log(response.data);
            
            setTopics(response.data || []);
        } catch (error) {
            console.error("Error fetching topics:", error);
            alert('Failed to fetch topics.')
            setError("Failed to fetch topics.");
        }
    };

    // Add a new topic
    const handleAddTopic = async () => {
        if (!newTopic.trim()) {
            setError("Topic cannot be empty.");
            return;
        }
        setError("");

        try {
            const response = await axios.post("https://admin.ranmicon.com/api/addTopics", {
                topics:newTopic,
            });
            setTopics(response.data.topics);
            setNewTopic(""); // Clear input
            alert("Topic added successfully.");
        } catch (error) {
            console.error("Error adding topic:", error);
            alert('Failed to add topics.')
            setError("Failed to add topic.");
        }
    };

    // Delete a topic
    const handleDeleteTopic = async (topic) => {
        try {
            const response = await axios.post("https://admin.ranmicon.com/api/deleteTopic", {
                topic:topic, // Send the topic to delete
            });
            setTopics(response.data.topics);
            alert("Topic deleted successfully.");
        } catch (error) {
            console.error("Error deleting topic:", error);
            alert('Failed to delete topics.')
            setError("Failed to delete topic.");
        }
    };

    // Fetch topics when the component mounts
    useEffect(() => {
        fetchTopics();
    }, []);

    return (
        <div className="mainCon">
            <h1>Manage Topics</h1>

            {/* Add Topic Section */}
            <div className="formCom">
                <label>Add New Topic:</label>
                <input
                    type="text"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    placeholder="Enter topic"
                />
                <button onClick={handleAddTopic}>Add Topic</button>
                {error && <p className="errorText">{error}</p>}
            </div>

            {/* Topics List */}
            <div className="topicsList">
                <h3>Existing Topics:</h3>
                {topics.length > 0 ? (
                    <ul>
                        {topics.map((topic, index) => (
                            <li key={index}>
                                {topic}
                                <button
                                    className="delete-button"
                                    onClick={() => handleDeleteTopic(topic)}
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No topics available.</p>
                )}
            </div>
        </div>
    );
}

export default TopicsAbstract;
