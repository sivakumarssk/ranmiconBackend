import axios from "axios";
import { useState, useEffect } from "react";

function Schedule() {
    const [scheduleForm, setScheduleForm] = useState({
        day1: { dayDate: "", list: [] },
        day2: { dayDate: "", list: [] },
        day3: { dayDate: "", list: [] }
    });

    const [inputValues, setInputValues] = useState({
        day1: { head: "", date: "" },
        day2: { head: "", date: "" },
        day3: { head: "", date: "" }
    });

    const [error, setError] = useState("");

    // Fetch schedule data
    const fetchSchedule = async () => {
        try {
            const response = await axios.get("https://admin.ranmicon.com/api/");
            const { day1, day2, day3 } = response.data;
            setScheduleForm({ day1, day2, day3 });
        } catch (error) {
            console.error("Error fetching schedule:", error);
        }
    };

    const handleInputChange = (day, field, value) => {
        setInputValues((prev) => ({
            ...prev,
            [day]: { ...prev[day], [field]: value }
        }));
        setError("");
    };

    const handleDateChange = (day, value) => {
        setScheduleForm((prev) => ({
            ...prev,
            [day]: { ...prev[day], dayDate: value }
        }));
    };

    const handleAddEvent = (day) => {
        const { head, date } = inputValues[day];
        if (!head || !date) {
            setError("Both head and date are required.");
            return;
        }
        setScheduleForm((prev) => ({
            ...prev,
            [day]: { ...prev[day], list: [...prev[day].list, { head, date }] }
        }));
        setInputValues((prev) => ({ ...prev, [day]: { head: "", date: "" } }));
    };

    const handleDeleteEvent = async (day, id) => {
        try {
            const response = await axios.delete(`https://admin.ranmicon.com/api/schedule/${day}/${id}`);
            if (response.status === 200) {
                setScheduleForm((prev) => ({
                    ...prev,
                    [day]: {
                        ...prev[day],
                        list: prev[day].list.filter((event) => event._id !== id)
                    }
                }));
            }
        } catch (error) {
            console.error("Error deleting event:", error);
        }
    };

    const handleSubmit = async (day) => {
        try {
            console.log({
                day,
                dayDate: scheduleForm[day].dayDate,
                list: scheduleForm[day].list
            });
            
            const response = await axios.patch("https://admin.ranmicon.com/api/addschedule", {
                day,
                dayDate: scheduleForm[day].dayDate,
                list: scheduleForm[day].list
            });
            if (response.status === 200) {

                console.log(response,'dfgdf');
                
                const { day1, day2, day3 } = response.data.data;
                setScheduleForm({ day1, day2, day3 });
                alert(`${day} schedule updated successfully!`);
            }
        } catch (error) {
            console.error("Error submitting schedule:", error);
            alert("Failed to submit schedule.");
        }
    };

    useEffect(() => {
        fetchSchedule();
        console.log(scheduleForm);
        
    }, []);

    return (
        <div className="mainCon">
            {["day1", "day2", "day3"].map((day) => (
                <div key={day} className="schedule-section">
                    <h3>{day}</h3>
                    <label>
                        Day Date:
                        <input
                            type="text"
                            value={scheduleForm[day].dayDate}
                            onChange={(e) => handleDateChange(day, e.target.value)}
                            placeholder="Enter date (e.g., 24 February 2025)"
                        />
                    </label>
                    <div>
                        <input
                            type="text"
                            value={inputValues[day].head}
                            onChange={(e) => handleInputChange(day, "head", e.target.value)}
                            placeholder="Event Head"
                        />
                        <input
                            type="text"
                            value={inputValues[day].date}
                            onChange={(e) => handleInputChange(day, "date", e.target.value)}
                            placeholder="Event Date (e.g., 07:30AM - 08:00AM)"
                        />
                        <button onClick={() => handleAddEvent(day)}>Add Event</button>
                    </div>
                    <ul>
                        {scheduleForm[day]?.list.map((event, index) => (
                            <li key={event._id || index}>
                                <strong style={{maxWidth:'50%',width:'40%', marginRight:'20px'}}>{event.head}</strong> - {event.date}
                                <button onClick={() => handleDeleteEvent(day, event._id)}>
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => handleSubmit(day)}>Save {day} Schedule</button>
                </div>
            ))}
        </div>
    );
}

export default Schedule;
