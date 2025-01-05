import axios from "axios";
import { useState } from "react";
import ReactQuill from "react-quill";

function Main() {
    const [mainForm, setMainForm] = useState({
        backgroundImage: null,
        conferenceHead: "",
        conferencedate: "",
        conferencepalce: ""
    });

    const [error, setError] = useState({
        backgroundImage: "",
        conferenceHead: "",
        conferencedate: "",
        conferencepalce: ""
    });

    const modules = {
        toolbar: [
            // Text style options
            [{ header: [1, 2, 3, false] }], // Heading levels 1, 2, 3, and normal text
            [{ 'font': [] }],               // Font family selection
            [{ 'size': [] }],               // Font size selection
            [{ 'color': [] }, { 'background': [] }], // Text and background colors
    
            // Text formatting options
            ['bold', 'italic', 'underline', 'strike'], // Bold, italic, underline, strikethrough
            [{ 'script': 'sub' }, { 'script': 'super' }], // Subscript, superscript
    
            // Text alignment and indent
            [{ 'align': [] }], // Text alignment
            [{ 'list': 'ordered' }, { 'list': 'bullet' }], // Ordered and unordered lists
            [{ 'indent': '-1' }, { 'indent': '+1' }],      // Indent options
    
            // Miscellaneous
            ['link', 'image'], // Links and images
            ['clean']          // Clear formatting
        ],
    };
    
    const formats = [
        'header', 'font', 'size', 'color', 'background',
        'bold', 'italic', 'underline', 'strike',
        'script', 'align', 'list', 'indent',
        'link', 'image', 'clean'
    ];
    

    const validate = () => {
        let valid = true;
        let newErrors = {};

        Object.keys(mainForm).forEach((key) => {
            if (!mainForm[key]) {
                newErrors[key] = "This field is required";
                valid = false;
            }
        });

        setError(newErrors);
        return valid;
    };

    const handleOnChange = (e, key) => {
        setError((prev) => ({ ...prev, [key]: "" }));

        if (key === "backgroundImage") {
            setMainForm((prev) => ({ ...prev, [key]: e.target.files[0] })); // Store the File object
        } else if (key === "conferenceHead") {
            setMainForm((prev) => ({ ...prev, [key]: e })); // ReactQuill provides HTML
        } else {
            setMainForm((prev) => ({ ...prev, [key]: e.target.value }));
        }
    };

    const handleSubmit = async () => {
        if (validate()) {
            try {
                const data = new FormData();
                Object.entries(mainForm).forEach(([key, value]) => {
                    if (value instanceof File) {
                        data.append(key, value);
                    } else {
                        data.append(key, value);
                    }
                });

                const response = await axios.patch('https://admin.emdcconference.com/api/main', data, {
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
                    <label>Upload Background Image :</label>
                    <input
                        type="file"
                        onChange={(e) => handleOnChange(e, "backgroundImage")}
                        required
                    />
                    {error.backgroundImage && <p className="errorText">{error.backgroundImage}</p>}
                </div>

                <div className="formCom">
                    <label>Conference Head :</label>
                    <ReactQuill
                     modules={modules}
                     formats={formats}
                        className="textEdit"
                        value={mainForm.conferenceHead}
                        onChange={(e) => handleOnChange(e, "conferenceHead")}
                        placeholder="Enter conference Head"
                        required
                    />
                    {error.conferenceHead && <p className="errorText">{error.conferenceHead}</p>}
                </div>

                <div className="formCom">
                    <label>Conference Date :</label>
                    <input
                        type="text"
                        placeholder="Enter conference Date"
                        value={mainForm.conferencedate}
                        onChange={(e) => handleOnChange(e, "conferencedate")}
                        required
                    />
                    {error.conferencedate && <p className="errorText">{error.conferencedate}</p>}
                </div>

                <div className="formCom">
                    <label>Conference Place :</label>
                    <input
                        type="text"
                        placeholder="Enter conference Place"
                        value={mainForm.conferencepalce}
                        onChange={(e) => handleOnChange(e, "conferencepalce")}
                        required
                    />
                    {error.conferencepalce && <p className="errorText">{error.conferencepalce}</p>}
                </div>

                <div className="preview">
                    <label>Preview:</label>
                    <div
                        className="previewText"
                        dangerouslySetInnerHTML={{ __html: mainForm.conferenceHead }}
                    />
                </div>

                <button onClick={handleSubmit}>Submit</button>
            </div>
        </>
    );
}

export default Main;
