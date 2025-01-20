import axios from "axios";
import { useState } from "react";
import ReactQuill from "react-quill";

function Poster() {
    const [mainForm, setMainForm] = useState({
           poster: "",
       });
   
       const [error, setError] = useState({
           poster: "",
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
   
           if (key === "poster") {
               setMainForm((prev) => ({ ...prev, [key]: e })); // ReactQuill provides HTML
           }
       };
   
       const handleSubmit = async () => {
           if (validate()) {
               try {
                   const data = new FormData();
                   
                   data.append('poster',mainForm.poster)
   
                   const response = await axios.post('https://admin.ranmicon.com/api/guide-poster', data, {
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
                       <label>Poster :</label>
                       <ReactQuill
                        modules={modules}
                        formats={formats}
                           className="textEdit"
                           value={mainForm.poster}
                           onChange={(e) => handleOnChange(e, "poster")}
                           placeholder="Enter poster"
                           required
                       />
                       {error.poster && <p className="errorText">{error.poster}</p>}
                   </div>
   
                   <div className="preview">
                       <label>Preview:</label>
                       <div
                           className="previewText"
                           dangerouslySetInnerHTML={{ __html: mainForm.poster }}
                       />
                   </div>
   
                   <button onClick={handleSubmit}>Submit</button>
               </div>
           </>
       );
}

export default Poster;
