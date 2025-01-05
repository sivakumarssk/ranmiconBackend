import { useState } from "react"
import '../components/home/Main.css';
import Privacy from "../components/policy/Privacy";
import Cancellation from "../components/policy/Cancellation";
import TermsConditions from "../components/policy/TermsConditions";



const arr =["privacy","termsConditions","cancellation"]


function Policy() {

    const [section, setSection] =useState('privacy')

    return (
        <div className="mainCon">

            <select
                value={section}
                onChange={(e) => setSection(e.target.value)}
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            >
                {arr.map((key) => (
                    <option key={key} value={key}>
                        {key}
                    </option>
                ))}
            </select>


            {section === 'privacy' && <Privacy/>}
            {section === 'termsConditions'&& <TermsConditions />}
            {section === 'cancellation'&& <Cancellation />}
        </div>
    )
}

export default Policy