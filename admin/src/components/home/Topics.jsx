import React, { useEffect, useState } from "react";
import axios from "axios";
// import "./Topics.css";

function Topics() {
    const [topics, setTopics] = useState({
        topicsList1: [],
        topicsList2: [],
        topicsList3: [],
    });

    const [inputValues, setInputValues] = useState({
        topicsList1: "",
        topicsList2: "",
        topicsList3: "",
    });

    const [error, setError] = useState("");

    // Fetch topics from the server
    const fetchTopics = async () => {
        try {
            const response = await axios.get("https://admin.ranmicon.com/api/");
            const { topicsList1, topicsList2, topicsList3 } = response.data;
            setTopics({ topicsList1, topicsList2, topicsList3 });
        } catch (err) {
            console.error("Error fetching topics:", err);
            setError("Failed to fetch topics.");
        }
    };

    // Add a new topic to the list
    const handleAddTopic = async (listName) => {
        if (!inputValues[listName].trim()) {
            setError("Cannot add an empty topic.");
            return;
        }
        setError("");

        try {
            const updatedTopics = {
                ...topics,
                [listName]: [...topics[listName], inputValues[listName].trim()],
            };

            // Submit updated topics to the server
            const response = await axios.patch("https://admin.ranmicon.com/api/topics", updatedTopics, {
                headers: { "Content-Type": "application/json" },
            });

            if (response.status === 200) {
                setTopics(updatedTopics);
                setInputValues((prev) => ({ ...prev, [listName]: "" }));
            }
        } catch (err) {
            console.error("Error adding topic:", err);
            setError("Failed to add topic.");
        }
    };

    // Delete a topic from the list
    const handleDeleteTopic = async (listName, topic) => {
        try {
            const response = await axios.delete(`https://admin.ranmicon.com/api/topics/${listName}/${topic}`);

            if (response.status === 200) {
                setTopics((prevTopics) => ({
                    ...prevTopics,
                    [listName]: prevTopics[listName].filter((item) => item !== topic),
                }));
            }
        } catch (err) {
            console.error("Error deleting topic:", err);
            setError("Failed to delete topic.");
        }
    };

    useEffect(() => {
        fetchTopics();
    }, []);

    return (
        <div className="topics-container">
            <h1>Manage Topics</h1>
            {error && <p className="error-message">{error}</p>}
            {["topicsList1", "topicsList2", "topicsList3"].map((listName) => (
                <div key={listName} className="topics-list">
                    <h3>{listName.replace("topicsList", "Topics List ")}</h3>
                    <ul>
                        {topics[listName].map((topic, index) => (
                            <li key={index}>
                                {topic}
                                <button
                                    className="delete-button"
                                    onClick={() => handleDeleteTopic(listName, topic)}
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                    <input
                        type="text"
                        value={inputValues[listName]}
                        onChange={(e) =>
                            setInputValues((prev) => ({ ...prev, [listName]: e.target.value }))
                        }
                        placeholder={`Add a topic to ${listName}`}
                    />
                    <button onClick={() => handleAddTopic(listName)}>Add Topic</button>
                </div>
            ))}
        </div>
    );
}

export default Topics;
