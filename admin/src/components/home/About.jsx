import axios from "axios";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function About() {
    const [aboutForm, setAboutForm] = useState({
        aboutHeading: "", 
        aboutDes: "", // Rich Text (HTML)
        aboutImage1: null, // File
        aboutImage2: null  // File
    });

    const [error, setError] = useState({
        aboutHeading: "", 
        aboutDes: "", 
        aboutImage1: "", 
        aboutImage2: ""
    });

    const validate = () => {
        let valid = true;
        let newErrors = {};

        Object.keys(aboutForm).forEach((key) => {
            if (!aboutForm[key] || (key.startsWith("aboutImage") && !aboutForm[key])) {
                newErrors[key] = "This field is required";
                valid = false;
            }
        });

        setError(newErrors);
        return valid;
    };

    const handleInputChange = (e, key) => {
        setError((prev) => ({ ...prev, [key]: "" }));

        if (key === "aboutImage1" || key === "aboutImage2") {
            setAboutForm((prev) => ({ ...prev, [key]: e.target.files[0] })); // Store File
        } else {
            setAboutForm((prev) => ({ ...prev, [key]: e.target.value }));
        }
    };

    const handleRichTextChange = (value) => {
        setAboutForm((prev) => ({ ...prev, aboutDes: value })); // HTML Content
    };

    const handleSubmit = async () => {
        if (validate()) {
            try {
                const data = new FormData();
                Object.entries(aboutForm).forEach(([key, value]) => {
                    if (value instanceof File) {
                        data.append(key, value);
                    } else {
                        data.append(key, value);
                    }
                });

                const response = await axios.patch('https://admin.ranmicon.com/api/about', data, {
                    headers: { "Content-Type": "multipart/form-data" }
                });

                console.log(response.data);
                alert("Data submitted successfully!");
            } catch (error) {
                console.error("Error uploading data:", error);
                alert("Failed to submit data.");
            }
        }
    };

    return (
        <>
            <div className="mainCon">

                <div className="formCom">
                    <label>About Heading :</label>
                    <input
                        type="text"
                        placeholder="Enter about Heading"
                        value={aboutForm.aboutHeading}
                        onChange={(e) => handleInputChange(e, "aboutHeading")}
                        required
                    />
                    {error.aboutHeading && <p className="errorText">{error.aboutHeading}</p>}
                </div>

                <div className="formCom">
                    <label>About Description :</label>
                    <ReactQuill className="textEdit"
                        value={aboutForm.aboutDes}
                        onChange={handleRichTextChange}
                        placeholder="Enter about description"
                        required
                    />
                    {error.aboutDes && <p className="errorText">{error.aboutDes}</p>}
                </div>

                <div className="formCom">
                    <label>Upload About Image1 :</label>
                    <input
                        type="file"
                        onChange={(e) => handleInputChange(e, "aboutImage1")}
                        required
                    />
                    {error.aboutImage1 && <p className="errorText">{error.aboutImage1}</p>}
                </div>

                <div className="formCom">
                    <label>Upload About Image2 :</label>
                    <input
                        type="file"
                        onChange={(e) => handleInputChange(e, "aboutImage2")}
                        required
                    />
                    {error.aboutImage2 && <p className="errorText">{error.aboutImage2}</p>}
                </div>

                <button onClick={handleSubmit}>Submit</button>
            </div>
        </>
    );
}

export default About;
