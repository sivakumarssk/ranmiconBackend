import { useState } from "react"
import '../components/home/Main.css';
import Virtual from "../components/guidelines/Virtual";
import Speaker from "../components/guidelines/Speaker";
import Poster from "../components/guidelines/Poster";
import Chair from "../components/guidelines/Chair";
import Abstract from "../components/guidelines/Abstract";
import Plans from "../components/guidelines/Plans";

const arr =["speaker","poster","chair","virtual","abstract","plans"]


function Guidelines() {

    const [section, setSection] =useState('speaker')

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


            {section === 'speaker' && <Speaker/>}
            {section === 'poster'&& <Poster />}
            {section === 'chair'&& <Chair />}
            {section === 'virtual'&& <Virtual />}
            {section === 'abstract'&& <Abstract />}
            {section === 'plans'&& <Plans />}
        </div>
    )
}

export default Guidelines