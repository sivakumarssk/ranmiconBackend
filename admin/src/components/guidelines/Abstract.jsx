import axios from "axios";
import { useState } from "react";
import ReactQuill from "react-quill";

function Abstract() {
 const [mainForm, setMainForm] = useState({
        abstract: "",
    });

    const [error, setError] = useState({
        abstract: "",
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

        if (key === "abstract") {
            setMainForm((prev) => ({ ...prev, [key]: e })); // ReactQuill provides HTML
        }
    };

    const handleSubmit = async () => {
        if (validate()) {
            try {
                const data = new FormData();
                
                data.append('abstract',mainForm.abstract)

                const response = await axios.post('https://admin.ranmicon.com/api/guide-abstract', data, {
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
                    <label>abstract :</label>
                    <ReactQuill
                     modules={modules}
                     formats={formats}
                        className="textEdit"
                        value={mainForm.abstract}
                        onChange={(e) => handleOnChange(e, "abstract")}
                        placeholder="Enter abstract"
                        required
                    />
                    {error.abstract && <p className="errorText">{error.abstract}</p>}
                </div>

                <div className="preview">
                    <label>Preview:</label>
                    <div
                        className="previewText"
                        dangerouslySetInnerHTML={{ __html: mainForm.abstract }}
                    />
                </div>

                <button onClick={handleSubmit}>Submit</button>
            </div>
        </>
    );
}

export default Abstract;
