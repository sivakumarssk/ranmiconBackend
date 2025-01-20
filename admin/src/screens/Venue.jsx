import React, { useState } from "react";
import axios from "axios";
import "./Venue.css";
import ReactQuill from "react-quill";

const Venue = () => {
    const [formData, setFormData] = useState({
        address: "", // Ensure this starts as a string
        hotelLocation: "",
        image1: null,
        image2: null,
        image3: null,
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            [{ font: [] }],
            [{ size: [] }],
            [{ color: [] }, { background: [] }],
            ["bold", "italic", "underline", "strike"],
            [{ script: "sub" }, { script: "super" }],
            [{ align: [] }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],
            ["link", "image"],
            ["clean"],
        ],
    };

    const formats = [
        "header", "font", "size", "color", "background",
        "bold", "italic", "underline", "strike",
        "script", "align", "list", "indent",
        "link", "image", "clean",
    ];

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle ReactQuill change
    const handleOnChange = (value) => {
        setFormData((prev) => ({ ...prev, address: value })); // Ensure the address is set as a string
    };

    // Handle file changes
    const handleFileChange = (e, key) => {
        setFormData({ ...formData, [key]: e.target.files[0] });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("address", formData.address);
        data.append("hotelLocation", formData.hotelLocation);
        if (formData.image1) data.append("image1", formData.image1);
        if (formData.image2) data.append("image2", formData.image2);
        if (formData.image3) data.append("image3", formData.image3);

        try {
            const response = await axios.post("https://admin.ranmicon.com/api/addVenue", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("Venue updated successfully!");
            setSuccess("Venue updated successfully!");
            setError("");
        } catch (err) {
            console.error(err);
            setError("Failed to update venue.");
            setSuccess("");
        }
    };

    return (
        <div className="add-venue-container">
            <h1>Add Venue</h1>
            <form onSubmit={handleSubmit} className="venue-form">
                <div className="form-group">
                    <label>Address :</label>
                    <ReactQuill
                        modules={modules}
                        formats={formats}
                        className="textEdit"
                        value={formData.address}
                        onChange={handleOnChange}
                        placeholder="Enter address"
                        required
                    />
                    {error && <p className="errorText">{error}</p>}
                </div>

                <div className="form-group">
                    <label>Hotel Location:</label>
                    <input
                        type="text"
                        name="hotelLocation"
                        value={formData.hotelLocation}
                        onChange={handleInputChange}
                        placeholder="Enter hotel location"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Upload Image 1:</label>
                    <input
                        type="file"
                        onChange={(e) => handleFileChange(e, "image1")}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Upload Image 2:</label>
                    <input
                        type="file"
                        onChange={(e) => handleFileChange(e, "image2")}
                    />
                </div>
                <div className="form-group">
                    <label>Upload Image 3:</label>
                    <input
                        type="file"
                        onChange={(e) => handleFileChange(e, "image3")}
                    />
                </div>
                <button type="submit">Submit</button>
                {success && <p className="success-message">{success}</p>}
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
};

export default Venue;
