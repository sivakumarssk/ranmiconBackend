import { useState } from "react"
import About from "../components/home/About"
import Main from "../components/home/Main"
import '../components/home/Main.css';
import Topics from "../components/home/Topics";
import Schedule from "../components/home/Schedule";
import Passes from "../components/home/Passes";

const arr =["main","about","topics","schedule","passes"]


function Home() {

    const [section, setSection] =useState('main')

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


            {section === 'main' && <Main/>}
            {section === 'about'&& <About />}
            {section === 'topics'&& <Topics />}
            {section === 'schedule'&& <Schedule />}
            {section === 'passes'&& <Passes />}
        </div>
    )
}

export default Home