

const ParticipationType = require("../models/participationType");
const Plan  = require("../models/plan");


const createParticipationType = async (req, res) => {
  const { name } = req.body;

  try {
    // Check if the participation type already exists
    const existingType = await ParticipationType.findOne({ name });
    if (existingType) {
      return res.status(400).json({ message: 'Participation type already exists' });
    }

    // Create the new participation type
    const newType = await ParticipationType.create({ name });

    // Update all existing plans with the new participation type
    await Plan.updateMany({}, {
      $push: { prices: { participationType: newType._id, price: null } }
    });

    const plans = await Plan.find().populate('prices.participationType', 'name');

    res.status(201).json({newType,plans });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const addParticipationTypeToPlans = async (req, res) => {
  const { name } = req.body;

  try {
    // Create the new participation type
    const newType = await ParticipationType.create({ name });

    // Update all existing plans with the new participation type
    await Plan.updateMany({}, {
      $push: { prices: { participationType: newType._id, price: null } }
    });

    res.status(201).json({ message: 'Participation type added and plans updated', newType });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const getParticipationTypes = async (req, res) => {
  try {
    const participationTypes = await ParticipationType.find();
    res.status(200).json(participationTypes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a Participation Type and cascade delete from Plans
const deleteParticipationType = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the participation type exists
    const participationType = await ParticipationType.findById(id);
    if (!participationType) {
      return res.status(404).json({ message: 'Participation type not found' });
    }

    // Delete the participation type
    await ParticipationType.findByIdAndDelete(id);

    // Remove the participation type reference from all plans
    await Plan.updateMany(
      {},
      { $pull: { prices: { participationType: id } } } // Pull the specific participation type from plans
    );

    res.status(200).json({ message: 'Participation type and related data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = { 
   createParticipationType,
   addParticipationTypeToPlans,
   getParticipationTypes,
   deleteParticipationType }