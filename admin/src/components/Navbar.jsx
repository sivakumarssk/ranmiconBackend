import React from "react";
import { Link } from "react-router-dom";
import './Navbar.css'
import logWhite from '../assets/logoWhite.png'

function Navbar() {

    const handleLogout = () => {
        localStorage.clear();
        // localStorage.removeItem("token");
        alert("You have been logged out.");
      };


    return (
        <>
            <div className="topNav">
                <p>Welcome,Admin</p>
                <Link  to='/login' onClick={handleLogout}>LogOut</Link>
            </div>

            <div className="navMain">
                <Link to='/' id="logoCon">
                    <img src={logWhite} alt="logo" className="logo" />
                </Link>

                <Link to='/' >
                    Home
                </Link>
                <Link to="/add-speaker">Add Speaker</Link>
                <Link to="/speaker-list">Speaker List</Link>
                <Link to="/abstractTopics">Abstract Topics</Link>
                <Link to="/abstractList">Abstract List</Link>
                <Link to="/guidelines">Guidelines</Link>
                <Link to="/manageDates">Manage Dates</Link>
                <Link to="/agenda">Agenda</Link>
                <Link to="/venue">Venue</Link>
                <Link to="/contactList">Contact List</Link>
                <Link to="/plans">Plans</Link>
                <Link to="/accommodations">Accommodations</Link>
                <Link to="/policy">Policy</Link>
                <Link to="/registrationList">Registration List</Link>
            </div>
        </>
    )
}

export default Navbar