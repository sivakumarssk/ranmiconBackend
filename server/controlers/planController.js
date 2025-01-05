const Plan = require("../models/plan");
const ParticipationType = require("../models/participationType");


const createPlan = async (req, res) => {
    const { name, prices,startDate,endDate } = req.body; // Prices: [{ participationType: ID, price: 100 }]

    try {

        // const prices1=prices.parase()

      const participationTypes = await ParticipationType.find();
      const pricesMap = JSON.parse(prices).reduce((acc, item) => {
        acc[item.participationType] = item.price;
        return acc;
      }, {});
  
      // Ensure all participation types have a price
      const planPrices = participationTypes.map((type) => ({
        participationType: type._id,
        price: pricesMap[type._id] || null // Default to null if price not provided
      }));
  
      const newPlan = await Plan.create({ name, prices: planPrices,startDate,endDate });
      res.status(201).json(newPlan);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const updatePlanPrices = async (req, res) => {
    const { planId, prices } = req.body; // Expect prices as an array of { participationType: { _id, name }, price }

    try {
        // Find the plan by ID
        const plan = await Plan.findById(planId);
        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }

        // Map prices based on the participationType._id
        const pricesMap = prices.reduce((acc, item) => {
            acc[item.participationType._id] = item.price; // Use participationType._id
            return acc;
        }, {});

        // Update prices in the plan
        plan.prices.forEach((item) => {
            if (pricesMap[item.participationType.toString()] !== undefined) {
                item.price = pricesMap[item.participationType.toString()];
            }
        });

        plan.updatedAt = Date.now(); // Update the timestamp
        await plan.save(); // Save the updated plan

        // Populate participationType to include full details
        const updatedPlan = await Plan.findById(planId).populate('prices.participationType', 'name');

        res.status(200).json(updatedPlan); // Return the updated plan with populated participationType
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


  

  const getPlans = async (req, res) => {
    try {
      const plans = await Plan.find().populate('prices.participationType', 'name');
      res.status(200).json(plans);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Delete a Plan
  const deletePlan = async (req, res) => {
    const { id } = req.params;
  
    try {
      // Check if the plan exists
      const plan = await Plan.findById(id);
      if (!plan) {
        return res.status(404).json({ message: 'Plan not found' });
      }
  
      // Delete the plan
      await Plan.findByIdAndDelete(id);
  
      res.status(200).json({ message: 'Plan deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  module.exports = { createPlan,updatePlanPrices,getPlans,deletePlan }