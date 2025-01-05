const Speaker = require('../models/speaker');
const Home = require('../models/home');
const { uploadFile, deleteFile } = require('../middlewares/filehandle');

// Add a speaker
// Add a speaker
exports.addSpeaker = async (req, res) => {
    const { name, description } = req.body;
    const file = req.files?.image;

    if (!name || !description || !file) {
        return res.status(400).json({ error: "Name, description, and image are required." });
    }

    try {
        const imagePath = await uploadFile(file, 'speakers');
        if (!imagePath) {
            return res.status(500).json({ error: "Error uploading image." });
        }

        const newSpeaker = { image: imagePath, name, description };

        let speaker = await Speaker.findOne();
        if (!speaker) {
            speaker = new Speaker({ speakers: [], KeynoteSpeakers: [], Committe: [] });
        }

        let home = await Home.findOne();
        if (!home) {
            home = new Home({
                speakers: [],
                KeynoteSpeakers: [],
                backgroundImage: "",
                conferencedate: "",
                conferencepalce: "",
            });
        }

        // Add to Speaker collection
        const addedSpeaker = speaker.speakers.create(newSpeaker);
        speaker.speakers.push(addedSpeaker);
        await speaker.save();

        // Add to Home collection, ensuring max length of 8
        if (home.speaker.length < 8) {
            home.speaker.push({ ...newSpeaker, speakerId: addedSpeaker._id }); // Store reference to Speaker's _id
            await home.save();
        }

        res.status(200).json({ message: "Speaker added successfully.", speaker: newSpeaker });
    } catch (error) {

        console.log(error);
        
        res.status(500).json({ error: error.message });
    }
};


// Add a keynote speaker
exports.addKeynoteSpeaker = async (req, res) => {
    const { name, description } = req.body;
    const file = req.files?.image;

    if (!name || !description || !file) {
        return res.status(400).json({ error: "Name, description, and image are required." });
    }

    try {
        const imagePath = await uploadFile(file, 'speakers');
        if (!imagePath) {
            return res.status(500).json({ error: "Error uploading image." });
        }

        const newKeynoteSpeaker = { image: imagePath, name, description };

        let speaker = await Speaker.findOne();
        if (!speaker) {
            speaker = new Speaker({ speakers: [], KeynoteSpeakers: [], Committe: [] });
        }

        let home = await Home.findOne();
        if (!home) {
            home = new Home({
                speakers: [],
                KeynoteSpeakers: [],
                backgroundImage: "",
                conferencedate: "",
                conferencepalce: "",
            });
        }

        // Add to Speaker collection
        const addedKeynoteSpeaker = speaker.KeynoteSpeakers.create(newKeynoteSpeaker); // Create a new subdocument
        speaker.KeynoteSpeakers.push(addedKeynoteSpeaker); // Push the subdocument
        await speaker.save();

        // Add to Home collection, ensuring max length of 8
        if (home.KeynoteSpeakers.length < 8) {
            home.KeynoteSpeakers.push({ ...newKeynoteSpeaker, speakerId: addedKeynoteSpeaker._id });
            await home.save();
        }

        res.status(200).json({
            message: "Keynote speaker added successfully.",
            keynoteSpeaker: { ...newKeynoteSpeaker, speakerId: addedKeynoteSpeaker._id },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};


// Delete a speaker
exports.deleteSpeaker = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "ID is required." });
    }

    try {
        const speaker = await Speaker.findOne();
        const home = await Home.findOne();

        if (!speaker || !home) {
            return res.status(404).json({ error: "Speaker or Home record not found." });
        }

        // Find and remove from Speaker collection
        const speakerToDelete = speaker.speakers.find((s) => s._id.toString() === id);
        if (!speakerToDelete) {
            return res.status(404).json({ error: "Speaker not found." });
        }

        await deleteFile(speakerToDelete.image);

        speaker.speakers = speaker.speakers.filter((s) => s._id.toString() !== id);
        await speaker.save();

        // Find and remove from Home collection using speakerId
        home.speaker = home.speaker.filter((s) => s.speakerId?.toString() !== id);
        await home.save();

        res.status(200).json({ message: "Speaker deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Delete a keynote speaker
exports.deleteKeynoteSpeaker = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "ID is required." });
    }

    try {
        const speaker = await Speaker.findOne();
        const home = await Home.findOne();

        if (!speaker || !home) {
            return res.status(404).json({ error: "Speaker or Home record not found." });
        }

        // Find the keynote speaker to delete in the Speaker model
        const keynoteToDelete = speaker.KeynoteSpeakers.find((k) => k._id.toString() === id);
        if (!keynoteToDelete) {
            return res.status(404).json({ error: "Keynote speaker not found in Speaker model." });
        }

        // Delete the associated file
        await deleteFile(keynoteToDelete.image);

        // Remove from Speaker collection
        speaker.KeynoteSpeakers = speaker.KeynoteSpeakers.filter((k) => k._id.toString() !== id);
        await speaker.save();

        // Remove from Home collection using speakerId
        home.KeynoteSpeakers = home.KeynoteSpeakers.filter((k) => k.speakerId?.toString() !== id);
        await home.save();

        res.status(200).json({ message: "Keynote speaker deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};


// Add a committee member
exports.addCommitteeMember = async (req, res) => {
    const { name, description } = req.body;
    const file = req.files?.image;

    if (!name || !description || !file) {
        return res.status(400).json({ error: "Name, description, and image are required." });
    }

    try {
        const imagePath = await uploadFile(file, 'speakers');
        if (!imagePath) {
            return res.status(500).json({ error: "Error uploading image." });
        }

        const newCommitteeMember = { image: imagePath, name, description };
        const speaker = await Speaker.findOne();

        if (!speaker) {
            return res.status(404).json({ error: "Speaker record not found." });
        }

        speaker.Committe.push(newCommitteeMember);
        await speaker.save();

        res.status(200).json({ message: "Committee member added successfully.", committeeMember: newCommitteeMember });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.deleteCommitteeMember = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "ID is required." });
    }

    try {
        const speaker = await Speaker.findOne();
        const home = await Home.findOne();

        if (!speaker || !home) {
            return res.status(404).json({ error: "Speaker or Home record not found." });
        }

        // Find the keynote speaker to delete in the Speaker model
        const committeToDelete = speaker.Committe.find((k) => k._id.toString() === id);
        if (!committeToDelete) {
            return res.status(404).json({ error: "Keynote speaker not found in Speaker model." });
        }

        // Delete the associated file
        await deleteFile(committeToDelete.image);

        // Remove from Speaker collection
        speaker.Committe = speaker.Committe.filter((k) => k._id.toString() !== id);
        await speaker.save();

        res.status(200).json({ message: "Committe speaker deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// Get all speakers
exports.getAllSpeakers = async (req, res) => {
    try {
        const speaker = await Speaker.findOne();
        if (!speaker) {
            return res.status(404).json({ error: "Speaker record not found." });
        }

        const allSpeakers = {
            speakers: speaker.speakers,
            keynoteSpeakers: speaker.KeynoteSpeakers,
            committee: speaker.Committe,
        };

        res.status(200).json(allSpeakers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
