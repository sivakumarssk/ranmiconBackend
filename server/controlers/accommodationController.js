const Accommodation = require('../models/accommodation');

// Add a new accommodation
const addAccommodation = async (req, res) => {
  const { name, price } = req.body;

  if (!name || price == null) {
    return res.status(400).json({ message: 'Name and price are required' });
  }

  try {
    const existingAccommodation = await Accommodation.findOne({ name });
    if (existingAccommodation) {
      return res.status(400).json({ message: 'Accommodation already exists' });
    }

    const newAccommodation = await Accommodation.create({ name, price });
    res.status(201).json(newAccommodation);
  } catch (error) {
    console.error('Error adding accommodation:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// Update an accommodation
const updateAccommodation = async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;

  if (!id || (!name && price == null)) {
    return res.status(400).json({ message: 'ID and at least one field to update are required' });
  }

  try {
    const accommodation = await Accommodation.findById(id);
    if (!accommodation) {
      return res.status(404).json({ message: 'Accommodation not found' });
    }

    if (name) accommodation.name = name;
    if (price != null) accommodation.price = price;

    await accommodation.save();
    res.status(200).json(accommodation);
  } catch (error) {
    console.error('Error updating accommodation:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// Delete an accommodation
const deleteAccommodation = async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ message: 'ID is required' });

  try {
    const accommodation = await Accommodation.findById(id);
    if (!accommodation) {
      return res.status(404).json({ message: 'Accommodation not found' });
    }

    await Accommodation.findByIdAndDelete(id);
    res.status(200).json({ message: 'Accommodation deleted successfully' });
  } catch (error) {
    console.error('Error deleting accommodation:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// Get all accommodations
const getAccommodations = async (req, res) => {
  try {
    const accommodations = await Accommodation.find();
    res.status(200).json(accommodations);
  } catch (error) {
    console.error('Error fetching accommodations:', error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addAccommodation,
  updateAccommodation,
  deleteAccommodation,
  getAccommodations,
};
