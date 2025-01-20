import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Plans.css';

const Plans = () => {
    const [plans, setPlans] = useState([]);
    const [participationTypes, setParticipationTypes] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [newPlan, setNewPlan] = useState({
        name: '',
        startDate: '',
        endDate: '',
        prices: [],
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editingPlanId, setEditingPlanId] = useState(null);
    const [newParticipationType, setNewParticipationType] = useState('');


    

    // Fetch plans and participation types from the server
    const fetchData = async () => {
        try {
            const plansResponse = await axios.get('https://admin.ranmicon.com/api/getPlans');
            const participationResponse = await axios.get('https://admin.ranmicon.com/api/getparticipation');

            
            setPlans(plansResponse.data);
            setParticipationTypes(participationResponse.data);
        } catch (err) {
            setError('Failed to fetch data');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Handle creating or updating a plan
    const handleCreateOrUpdatePlan = async () => {
        try {
            const pricesArray =newPlan.prices.map((each)=>({
                ...each,
                price: parseFloat(each.price)
            }))
            console.log(pricesArray,'pl');
            
            
            // const pricesArray = Object.entries(newPlan.prices).map(([typeId, price]) => ({
            //     name: typeId,
            //     price: parseFloat(price),
            // }));

            if (isEditing) {
                // Update Plan
                try {
                    const response = await axios.put('http://localhost:5000/api/updatePlan', {
                        planId: editingPlanId,
                        name: newPlan.name,
                        startDate: newPlan.startDate,
                        endDate: newPlan.endDate,
                        prices: pricesArray,
                    });
                    setPlans(plans.map((p) => (p._id === editingPlanId ? response.data : p)));

                    console.log(response,'kd');
                    
                    setSuccess('Plan updated successfully');
                    
                } catch (error) {
                    console.log(error,'updateErr');
                    
                }
                
            
              
            } else {
                // Create Plan
                const response = await axios.post('https://admin.ranmicon.com/api/createPlan', {
                    name: newPlan.name,
                    startDate: newPlan.startDate,
                    endDate: newPlan.endDate,
                    prices: JSON.stringify(pricesArray),
                });

                setPlans([...plans, response.data]);
                setSuccess('Plan created successfully');
            }

            setNewPlan({ name: '', startDate: '', endDate: '', prices: [] });
            setIsEditing(false);
            setEditingPlanId(null);
            setError('');
        } catch (err) {
            setError('Failed to create or update plan');
            setSuccess('');
        }
    };

    // Handle editing a plan
    const handleEditPlan = (plan) => {
        setIsEditing(true);
        setEditingPlanId(plan._id);

        const priceMap = [];
        plan.prices.forEach((price) => {
            priceMap.push({_id:price?._id,participationType:price.participationType, price:price.price})
        });
        console.log(plan.prices,'gfd');
        

        setNewPlan({
            name: plan.name,
            startDate: plan.startDate,
            endDate: plan.endDate,
            prices: priceMap,
        });
    };

    // Handle deleting a plan
    const handleDeletePlan = async (planId) => {
        try {
            await axios.delete(`https://admin.ranmicon.com/api/deletePlan/${planId}`);
            setPlans(plans.filter((plan) => plan._id !== planId));
            setSuccess('Plan deleted successfully');
        } catch (err) {
            setError('Failed to delete plan');
        }
    };

    // Handle creating a participation type
    const handleCreateParticipationType = async () => {
        try {
            const response = await axios.post('https://admin.ranmicon.com/api/participationtypes', {
                name: newParticipationType,
            });

            console.log(response,'part');
            if(response){

                setParticipationTypes([...participationTypes, response.data.newType]);
                setPlans(response.data?.plans)
                setNewParticipationType('');
                setSuccess('Participation type created successfully');
                setError('');
            }
            
        } catch (err) {
            setError('Failed to create participation type');
            setSuccess('');
        }
    };

    // Handle deleting a participation type
    const handleDeleteParticipationType = async (id) => {
        try {
            await axios.delete(`https://admin.ranmicon.com/api/deleteparticipation/${id}`);
            setParticipationTypes(participationTypes.filter((type) => type._id !== id));
            setSuccess('Participation type deleted successfully');
        } catch (err) {
            setError('Failed to delete participation type');
        }
    };

    console.log(plans,'old');
    console.log(newPlan,'new');
    console.log(participationTypes);
    


    return (
        <div className="admin-panel">
            <h1>Admin Panel</h1>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}

            {/* Plan Management Section */}
            <section>
                <h2>Plans</h2>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Prices</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {plans.map((plan) => (
                            <tr key={plan._id}>
                                <td>{plan.name}</td>
                                <td>{plan.startDate?.split('T')[0]}</td>
                                <td>{plan.endDate?.split('T')[0]}</td>
                                <td>
                                    {participationTypes.map((pt) => {
                                        const priceObj = plan?.prices.find(
                                            (price) => price.participationType?._id === pt._id
                                        );
                                        return (
                                            <p key={pt._id}>
                                                {pt.name}: {priceObj?.price || 'N/A'}
                                            </p>
                                        );
                                    })}
                                </td>
                                <td>
                                    <button onClick={() => handleEditPlan(plan)}>Edit</button>
                                    <button onClick={() => handleDeletePlan(plan._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <h3>{isEditing ? 'Edit Plan' : 'Create New Plan'}</h3>
                <input
                    type="text"
                    placeholder="Plan Name"
                    value={newPlan.name}
                    
                    onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                />
                <input
                    type="date"
                    placeholder="Start Date"
                    value={newPlan.startDate?.split('T')[0]}
                    
                    onChange={(e) => setNewPlan({ ...newPlan, startDate: e.target.value })}
                />
                <input
                    type="date"
                    placeholder="End Date"
                    value={newPlan.endDate?.split('T')[0]}
                    
                    onChange={(e) => setNewPlan({ ...newPlan, endDate: e.target.value })}
                />
                <h4>Set Prices</h4>
                {participationTypes.map((type) => (
                    <div key={type._id}>
                        {/* {console.log(newPlan.prices,'pric')} */}
                        <label>{type.name}:</label>
                        <input
    type="number"
    placeholder="Price"
    value={
        newPlan?.prices.find(
            (each) => each.participationType?._id === type._id
        )?.price || ''
    }
    onChange={(e) => {
        const existingPriceIndex = newPlan.prices.findIndex(
            (each) => each.participationType?._id === type._id
        );
        const updatedPrices = [...newPlan.prices];

        if (existingPriceIndex !== -1) {
            // Update existing price
            updatedPrices[existingPriceIndex].price = e.target.value;
        } else {
            // Add new price entry
            updatedPrices.push({
                participationType: { _id: type._id },
                price: e.target.value,
            });
        }

        setNewPlan({
            ...newPlan,
            prices: updatedPrices,
        });
    }}
/>

                    </div>
                ))}
                <button onClick={handleCreateOrUpdatePlan}>
                    {isEditing ? 'Update Plan' : 'Create Plan'}
                </button>
            </section>

            {/* Participation Type Management Section */}
            <section>
                <h2>Participation Types</h2>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {participationTypes.map((type) => (
                            <tr key={type._id}>
                                <td>{type.name}</td>
                                <td>
                                    <button onClick={() => handleDeleteParticipationType(type._id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <h3>Create New Participation Type</h3>
                <input
                    type="text"
                    placeholder="Participation Type Name"
                    value={newParticipationType}
                    onChange={(e) => setNewParticipationType(e.target.value)}
                />
                <button onClick={handleCreateParticipationType}>Create Participation Type</button>
            </section>
        </div>
    );
};

export default Plans;
