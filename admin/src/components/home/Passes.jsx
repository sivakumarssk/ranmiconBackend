import axios from "axios";
import { useState, useEffect } from "react";

function Passes() {
    const [passesForm, setPassesForm] = useState({
        pass1: [],
        pass2: [],
        pass3: []
    });

    const [inputValues, setInputValues] = useState({
        pass1: { name: "", price: "", benefit: "" },
        pass2: { name: "", price: "", benefit: "" },
        pass3: { name: "", price: "", benefit: "" }
    });

    // Fetch passes data
    const fetchPasses = async () => {
        try {
            const response = await axios.get("https://admin.ranmicon.com/api/");
            const { pass1, pass2, pass3 } = response.data;
            setPassesForm({ pass1, pass2, pass3 });
        } catch (error) {
            console.error("Error fetching passes:", error);
        }
    };

    const handleInputChange = (pass, field, value) => {
        setInputValues((prev) => ({
            ...prev,
            [pass]: {
                ...prev[pass],
                [field]: value
            }
        }));
    };

    const handleAddOrUpdateBenefit = async (pass) => {
        const { name, price, benefit } = inputValues[pass];

        // Validate input
        if (!benefit.trim()) {
            alert("Benefit cannot be empty.");
            return;
        }

        const updatedPasses = [...passesForm[pass]];

        if (updatedPasses.length === 0) {
            // Add a new pass if no pass exists
            if (!name.trim() || !price.trim()) {
                alert("Name and price are required for a new pass.");
                return;
            }

            const newPass = {
                name: name.trim(),
                price: Number(price.trim()),
                benifits: [benefit.trim()]
            };

            try {
                await axios.patch(`https://admin.ranmicon.com/api/passes`, {
                    [pass]: [...updatedPasses, newPass]
                });

                setPassesForm((prev) => ({
                    ...prev,
                    [pass]: [...prev[pass], newPass]
                }));
                alert("New pass added successfully.");
            } catch (error) {
                console.error("Error adding new pass:", error);
            }
        } else {
            // Update the last existing pass
            const lastPassIndex = updatedPasses.length - 1;
            const lastPass = updatedPasses[lastPassIndex];

            if (name.trim()) lastPass.name = name.trim();
            if (price.trim()) lastPass.price = Number(price.trim());
            lastPass.benifits.push(benefit.trim());

            try {
                await axios.patch(`https://admin.ranmicon.com/api/passes`, {
                    [pass]: updatedPasses
                });

                setPassesForm((prev) => ({
                    ...prev,
                    [pass]: updatedPasses
                }));
                alert("Pass updated successfully.");
            } catch (error) {
                console.error("Error updating pass:", error);
            }
        }

        // Reset input fields for the current pass
        setInputValues((prev) => ({
            ...prev,
            [pass]: { name: "", price: "", benefit: "" }
        }));
    };

    const handleDeleteBenefit = async (passType, passIndex, benefitIndex) => {
        try {
            const response = await axios.delete(
                `https://admin.ranmicon.com/api/passes/${passType}/${benefitIndex}`
            );
            if (response.status === 200) {
                setPassesForm((prev) => ({
                    ...prev,
                    [passType]: prev[passType].map((item, i) =>
                        i === passIndex
                            ? {
                                  ...item,
                                  benifits: item.benifits.filter((_, j) => j !== benefitIndex)
                              }
                            : item
                    )
                }));
                alert("Benefit deleted successfully.");
            }
        } catch (error) {
            console.error("Error deleting benefit:", error);
        }
    };

    const handleSubmit = async () => {
        try {
            await axios.patch("https://admin.ranmicon.com/api/passes", passesForm, {
                headers: { "Content-Type": "application/json" }
            });
            alert("Passes submitted successfully!");
        } catch (error) {
            console.error("Error submitting passes:", error);
            alert("Failed to submit passes.");
        }
    };

    useEffect(() => {
        fetchPasses();
    }, []);

    return (
        <div className="mainCon">
            {["pass1", "pass2", "pass3"].map((pass) => (
                <div key={pass} className="pass-section">
                    <h3>{pass}</h3>
                    <div className="add-pass-form">
                        <input
                            type="text"
                            value={inputValues[pass].name}
                            onChange={(e) => handleInputChange(pass, "name", e.target.value)}
                            placeholder="Name (optional for existing pass)"
                        />
                        <input
                            type="number"
                            value={inputValues[pass].price}
                            onChange={(e) => handleInputChange(pass, "price", e.target.value)}
                            placeholder="Price (optional for existing pass)"
                        />
                        <input
                            type="text"
                            value={inputValues[pass].benefit}
                            onChange={(e) => handleInputChange(pass, "benefit", e.target.value)}
                            placeholder="Add Benefit"
                        />
                        <button onClick={() => handleAddOrUpdateBenefit(pass)}>
                            Add/Update Pass
                        </button>
                    </div>
                    <ul>
                        {passesForm[pass].map((item, passIndex) => (
                            <li key={passIndex} style={{ flexDirection: "column" }}>
                                <p>
                                    <strong>{item.name}</strong> - ${item.price}
                                </p>
                                <ul>
                                    {item.benifits.map((benefit, benefitIndex) => (
                                        <li key={benefitIndex} style={{ maxWidth: "100%", width: "500px" }}>
                                            <p>{benefit}</p>
                                            <button
                                                onClick={() =>
                                                    handleDeleteBenefit(pass, passIndex, benefitIndex)
                                                }
                                            >
                                                Delete Benefit
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
            {/* <button onClick={handleSubmit}>Submit Passes</button> */}
        </div>
    );
}

export default Passes;
