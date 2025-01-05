import React, { useState } from "react";
import axios from "axios";

const Main = () => {
  const [section, setSection] = useState("main");
  const [action, setAction] = useState("replace");
  const [formData, setFormData] = useState({
    main: { backgroundImage:'', conferenceNum: "", conferencedate: "", conferencepalce: "" },
    about: { aboutHeading: "", aboutDes: "", aboutImage1: "", aboutImage2: "" },
    topics: { topicsList1: [], topicsList2: [], topicsList3: [] },
    schedule: { day1: [], day2: [], day3: [] },
    // speakers: { keyNote: [], speaker: [] },
    passes: { pass1: {}, pass2: {}, pass3: {} },
  });

  // Handle Input Change for Simple Fields
  const handleInputChange = (e, sectionName, fieldName) => {
    const value = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      [sectionName]: {
        ...prevData[sectionName],
        [fieldName]: value,
      },
    }));
  };

  // Handle File Upload
  const handleFileChange = (e, sectionName, fieldName) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      [sectionName]: {
        ...prevData[sectionName],
        [fieldName]: file,
      },
    }));
  };

  // Add Dynamic Input Field (Array Fields)
  const addArrayField = (sectionName, fieldName) => {
    setFormData((prevData) => ({
      ...prevData,
      [sectionName]: {
        ...prevData[sectionName],
        [fieldName]: [...prevData[sectionName][fieldName], ""],
      },
    }));
  };

  // Update Dynamic Input Field (Array Fields)
  const updateArrayField = (sectionName, fieldName, index, value) => {
    setFormData((prevData) => {
      const updatedArray = [...prevData[sectionName][fieldName]];
      updatedArray[index] = value;
      return {
        ...prevData,
        [sectionName]: {
          ...prevData[sectionName],
          [fieldName]: updatedArray,
        },
      };
    });
  };

  // Add Object to Array of Objects
  const addObjectField = (sectionName, fieldName) => {
    setFormData((prevData) => ({
      ...prevData,
      [sectionName]: {
        ...prevData[sectionName],
        [fieldName]: [...prevData[sectionName][fieldName], { key: "", value: "" }],
      },
    }));
  };

  // Update Object in Array of Objects
  const updateObjectField = (sectionName, fieldName, index, key, value) => {
    setFormData((prevData) => {
      const updatedArray = [...prevData[sectionName][fieldName]];
      updatedArray[index] = { ...updatedArray[index], [key]: value };
      return {
        ...prevData,
        [sectionName]: {
          ...prevData[sectionName],
          [fieldName]: updatedArray,
        },
      };
    });
  };

  // Submit Form Data
  const handleSubmit = async () => {
    const sectionData = formData[section];

    // Prepare FormData for Image Uploads
    const data = new FormData();
    Object.entries(sectionData).forEach(([key, value]) => {
      if (value instanceof File) {
        data.append(key, value); // Append file
      } else if (Array.isArray(value)) {
        value.forEach((item) => data.append(`${key}[]`, item)); // Append array items
      } else {
        data.append(key, JSON.stringify(value)); // Append other fields
      }
    });

    try {
      const response = await axios.patch(`/api/home/${section}?action=${action}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Data updated successfully!");
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error updating data:", error);
      alert("Failed to update data.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h2>Admin Panel: Update Section</h2>

      <div style={{ marginBottom: "20px" }}>
        <label>Select Section:</label>
        <select
          value={section}
          onChange={(e) => setSection(e.target.value)}
          style={{ width: "100%", padding: "8px", marginTop: "5px" }}
        >
          {Object.keys(formData).map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
      </div>

      {Object.entries(formData[section]).map(([key, value], idx) => (
        <div key={idx} style={{ marginBottom: "15px" }}>
          <label>{key}:</label>
          {value instanceof Array ? (
            <div>
              {value.map((item, index) => (
                <input
                  key={index}
                  type="text"
                  value={item}
                  onChange={(e) => updateArrayField(section, key, index, e.target.value)}
                  placeholder={`Enter ${key} ${index + 1}`}
                  style={{ width: "90%", marginRight: "5px", padding: "8px" }}
                />
              ))}
              <button onClick={() => addArrayField(section, key)}>Add</button>
            </div>
          ) : value instanceof Object ? (
            <div>
              {value.map((obj, index) => (
                <div key={index} style={{ display: "flex", marginBottom: "5px" }}>
                  <input
                    type="text"
                    value={obj.key}
                    onChange={(e) => updateObjectField(section, key, index, "key", e.target.value)}
                    placeholder="Key"
                    style={{ width: "40%", marginRight: "5px", padding: "8px" }}
                  />
                  <input
                    type="text"
                    value={obj.value}
                    onChange={(e) => updateObjectField(section, key, index, "value", e.target.value)}
                    placeholder="Value"
                    style={{ width: "40%", marginRight: "5px", padding: "8px" }}
                  />
                </div>
              ))}
              <button onClick={() => addObjectField(section, key)}>Add</button>
            </div>
          ) : key.toLowerCase().includes("image") ? (
            <input type="file" onChange={(e) => handleFileChange(e, section, key)} />
          ) : (
            <input
              type="text"
              value={value}
              onChange={(e) => handleInputChange(e, section, key)}
              placeholder={`Enter ${key}`}
              style={{ width: "100%", padding: "8px" }}
            />
          )}
        </div>
      ))}

      <div style={{ marginBottom: "20px" }}>
        <label>Action:</label>
        <select
          value={action}
          onChange={(e) => setAction(e.target.value)}
          style={{ width: "100%", padding: "8px", marginTop: "5px" }}
        >
          <option value="replace">Replace</option>
          <option value="append">Append</option>
        </select>
      </div>

      <button onClick={handleSubmit} style={{ padding: "10px 20px", backgroundColor: "#007BFF", color: "#fff" }}>
        Update Section
      </button>
    </div>
  );
};

export default Main;
