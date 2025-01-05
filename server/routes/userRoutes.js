const express = require('express')
const router = express.Router()
const Home = require('../models/home');
const DateModel = require('../models/date');
const Venue = require('../models/venue');
const Contact = require('../models/contact');

const { uploadMainContent } = require('../controlers/home/mainControler');
const { uploadFile, deleteFile } = require('../middlewares/filehandle');
const { addTopics, deleteTopic, uploadAbstract, getTopic, getAllAbstractData } = require('../controlers/abstractController')
const {
    addSpeaker,
    deleteSpeaker,
    addKeynoteSpeaker,
    deleteKeynoteSpeaker,
    addCommitteeMember,
    getAllSpeakers,
    deleteCommitteeMember,
} = require('../controlers/speakersController');

const { addAgenda, deleteAgenda, getAgenda } = require('../controlers/agendaController');
const { register,login } = require('../controlers/LoginController');


const Plan = require('../models/plan')
const Registration = require('../models/registration');
const { getParticipationTypes, addParticipant, deleteParticipant, createParticipationType, addParticipationTypeToPlans, deleteParticipationType } = require('../controlers/participationController');
const { updateAccommodation, addAccommodation, deleteAccommodation, getAccommodations } = require('../controlers/accommodationController');
const { createPlan, updatePlanPrices, deletePlan, getPlans } = require('../controlers/planController');


const guidelineController = require('../controlers/guidelinesController');

const {
    registerUserAndInitiatePayment,
    handleWebhook,
    getRegistrations
  } = require('../controlers/patmentController');
const { getPrivacy, getTermsConditions, getCancellation, createPrivacy, createTermsConditions, createCancellation } = require('../controlers/policyController');



// GET all data
router.get('/', async (req, res) => {
    try {
        const homeData = await Home.findOne(); // Assumes a single document in the collection
        res.status(200).json(homeData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch home data.' });
    }
});

router.patch('/addschedule', async (req, res) => {
    const { day, dayDate, list } = req.body;

    // Ensure valid day name
    if (!['day1', 'day2', 'day3'].includes(day)) {
        return res.status(400).json({ error: 'Invalid schedule day specified.' });
    }

    try {
        // Update the day details
        const updateFields = {};
        if (dayDate) updateFields[`${day}.dayDate`] = dayDate;
        if (list && Array.isArray(list)) {
            updateFields[`${day}.list`] = list; // Replace the list
        }
        

        const updatedHome = await Home.findOneAndUpdate(
            {},
            { $set: updateFields },
            { new: true }
        );

        if (!updatedHome) {
            return res.status(404).json({ error: 'Home document not found.' });
        }

        res.status(200).json({ message: 'Schedule updated successfully.', data: updatedHome });
    } catch (error) {
        console.log(error);
        
        res.status(500).json({ error: 'Failed to update schedule.', details: error.message });
    }
});


 
// PATCH update a section
router.patch('/:section', async (req, res) => {
    const { section } = req.params;
    const updateData = req.body;

    const validSections = [
        'main', 'about', 'topics', 'schedule', 'speakers', 'passes'
    ];

    // Map sections to schema fields
    const sectionMap = {
        main: ['backgroundImage', 'conferenceHead', 'conferencedate', 'conferencepalce'],
        about: ['aboutHeading', 'aboutDes', 'aboutImage1', 'aboutImage2'],
        topics: ['topicsList1', 'topicsList2', 'topicsList3'],
        schedule: ['day1', 'day2', 'day3'],
        speakers: ['keyNote', 'speaker'],
        passes: ['pass1', 'pass2', 'pass3']
    };

    if (!validSections.includes(section)) {
        return res.status(400).json({ error: 'Invalid section specified.' });
    }

    const fieldsToUpdate = sectionMap[section];
    const updateFields = {};

    for (const key of fieldsToUpdate) {
        if (updateData[key]) {
            let value = updateData[key];

            // Check if value is a stringified array
            if (typeof value === 'string') {
                try {
                    const parsedValue = JSON.parse(value);
                    if (Array.isArray(parsedValue)) {
                        value = parsedValue; // Convert to array
                    }
                } catch (err) {
                    // Ignore JSON.parse errors; treat as a regular string
                }
            }

            // Append to array or replace
            if (Array.isArray(value)) {
                updateFields[key] = value; // Replaces the array
            } else {
                updateFields[key] = value; // Updates individual fields
            }            
        }

        if (req.files && req.files[key]) {
            const file = req.files[key];

            try {
                const filePath = await uploadFile(file, 'home');

                // Delete old file if present
                const existingData = await Home.findOne();


                if (existingData && existingData[key]) {
                    await deleteFile(existingData[key]);
                }

                updateFields[key] = filePath; // Update with new file path
            } catch (error) {
                return res.status(500).json({ error: `Failed to upload file for ${key}: ${error.message}` });
            }
        }
    }


    try {
        const homeData = await Home.findOneAndUpdate(
            {}, // Finds the first document
            { $set: updateFields },
            { new: true, upsert: true } // `upsert` creates a new document if none exists
        );
        
        res.status(200).json(homeData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update home data.' });
    }
});



router.delete('/topics/:list/:item', async (req, res) => {
    try {
        const { list, item } = req.params;

        // Ensure valid list name
        if (!['topicsList1', 'topicsList2', 'topicsList3'].includes(list)) {
            return res.status(400).json({ error: 'Invalid topics list specified.' });
        }

        const updatedHome = await Home.findOneAndUpdate(
            {},
            { $pull: { [list]: item } },
            { new: true }
        );

        if (!updatedHome) {
            return res.status(404).json({ error: 'Home document not found.' });
        }

        res.status(200).json({ message: 'Item removed successfully.', data: updatedHome });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete item from topics.', details: error.message });
    }
});

// DELETE a single item from day1, day2, or day3
router.delete('/schedule/:day/:itemId', async (req, res) => {
    const { day, itemId } = req.params;

    console.log("Day:", day);
    console.log("Item ID:", itemId);

    if (!['day1', 'day2', 'day3'].includes(day)) {
        return res.status(400).json({ error: 'Invalid schedule day specified.' });
    }

    if (!itemId || itemId === "undefined") {
        return res.status(400).json({ error: 'Invalid or missing item ID.' });
    }

    try {
        const updatedHome = await Home.findOneAndUpdate(
            {},
            { $pull: { [`${day}.list`]: { _id: itemId } } },
            { new: true }
        );

        if (!updatedHome) {
            return res.status(404).json({ error: 'Home document not found.' });
        }

        res.status(200).json({ message: 'Event removed successfully.', data: updatedHome });
    } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).json({ error: 'Failed to delete event.', details: error.message });
    }
});



// DELETE a single pass item from pass1, pass2, or pass3
router.delete('/passes/:passType/:itemId', async (req, res) => {
    try {
        const { passType, itemId } = req.params;

        // Ensure valid pass type
        if (!['pass1', 'pass2', 'pass3'].includes(passType)) {
            return res.status(400).json({ error: 'Invalid pass type specified.' });
        }

        const homeDoc = await Home.findOne();
        if (!homeDoc) {
            return res.status(404).json({ error: 'Home document not found.' });
        }

        // Find the pass and remove the benefit by its ID
        const passIndex = homeDoc[passType].findIndex((pass) =>
            pass.benifits.some((benefit, index) => index.toString() === itemId)
        );

        if (passIndex === -1) {
            return res.status(404).json({ error: 'Benefit not found.' });
        }

        const benefitIndex = itemId;
        homeDoc[passType][passIndex].benifits.splice(benefitIndex, 1); // Remove the specific benefit

        await homeDoc.save();

        res.status(200).json({ message: 'Benefit removed successfully.', data: homeDoc });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete benefit.', details: error.message });
    }
});


router.delete('/passes/item/:passType/:itemId', async (req, res) => {
    try {
        const { passType, itemId } = req.params;

        // Ensure valid pass type
        if (!['pass1', 'pass2', 'pass3'].includes(passType)) {
            return res.status(400).json({ error: 'Invalid pass type specified.' });
        }

        const updatedHome = await Home.findOneAndUpdate(
            {},
            { $pull: { [passType]: { _id: itemId } } }, // Remove the pass by its ID
            { new: true }
        );

        if (!updatedHome) {
            return res.status(404).json({ error: 'Home document not found.' });
        }

        res.status(200).json({ message: 'Pass item removed successfully.', data: updatedHome });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete pass item.', details: error.message });
    }
});







// Add a speaker
router.post('/addSpeaker', addSpeaker);

// Delete a speaker
router.delete('/deleteSpeaker/:id', deleteSpeaker);

// Add a keynote speaker
router.post('/addKeynoteSpeaker', addKeynoteSpeaker);

// Delete a keynote speaker
router.delete('/deleteKeynoteSpeaker/:id', deleteKeynoteSpeaker);


router.delete('/deleteCommitte/:id', deleteCommitteeMember);

// Add a committee member
router.post('/addCommittee', addCommitteeMember);

// Get all speakers, keynote speakers, and committee members
router.get('/getAllSpeakers', getAllSpeakers);



// Add topics
router.post('/addTopics', addTopics);

router.get('/topic', getTopic)
// Delete a topic
router.post('/deleteTopic', deleteTopic);

// Upload abstract form data with a PDF
router.post('/uploadAbstract', uploadAbstract);

router.get('/allAbstract', getAllAbstractData)




// POST: Add or update a key with an array of objects
router.post('/addDates', async (req, res) => {
    let { key, items } = req.body;

    if (typeof items === 'string') {
        items = JSON.parse(items)
    }

    if (!key || !Array.isArray(items)) {
        return res.status(400).json({ error: 'Key is required and items must be an array.' });
    }


    try {
        let dateDoc = await DateModel.findOne();
        if (!dateDoc) {
            dateDoc = new DateModel({ dates: new Map() });
        }

        dateDoc.dates.set(key, items); // Add or update the key with the array
        await dateDoc.save();

        res.status(200).json({ data: dateDoc });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/addSingleDate', async (req, res) => {
    const { key, item } = req.body;

    if (!key || !item || !item.head || !item.date) {
        return res.status(400).json({ error: 'Key, head, and date are required.' });
    }

    try {
        // Find or create a document
        let dateDoc = await DateModel.findOne();
        if (!dateDoc) {
            dateDoc = new DateModel({ dates: new Map() });
        }

        // Add item to the correct key
        const itemsArray = dateDoc.dates.get(key) || [];
        itemsArray.push(item);
        dateDoc.dates.set(key, itemsArray);

        await dateDoc.save();

        res.status(200).json({ message: 'Date added successfully', data: dateDoc });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET: Fetch all keys and their values
router.get('/getdates', async (req, res) => {
    try {
        const dateDoc = await DateModel.findOne();
        if (!dateDoc) {
            return res.status(400).json({ error: 'No data found.' });
        }

        res.status(200).json({ data: Object.fromEntries(dateDoc.dates) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE: Remove a specific key or an object within a key
router.delete('/deleteDates/:id', async (req, res) => {
    const { id } = req.params; // Extract object ID from URL parameters

    if (!id) {
        return res.status(400).json({ error: 'Item ID is required.' });
    }

    try {
        const dateDoc = await DateModel.findOne();
        if (!dateDoc) {
            return res.status(404).json({ error: 'No data found.' });
        }

        let isItemDeleted = false;

        // Iterate over all keys in the map
        for (const [key, items] of dateDoc.dates) {
            const filteredItems = items.filter((item) => item._id.toString() !== id);

            // If items are filtered, update the map
            if (filteredItems.length !== items.length) {
                dateDoc.dates.set(key, filteredItems);
                isItemDeleted = true;
            }
        }

        if (!isItemDeleted) {
            return res.status(404).json({ error: 'Item not found.' });
        }

        await dateDoc.save();
        res.status(200).json({ message: 'Item deleted successfully.', data: dateDoc });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE: Remove an entire key from the dates map
router.delete('/deleteKey/:key', async (req, res) => {
    const { key } = req.params; // Extract the key from the URL

    if (!key) {
        return res.status(400).json({ error: 'Key is required.' });
    }

    try {
        const dateDoc = await DateModel.findOne();
        if (!dateDoc) {
            return res.status(404).json({ error: 'No data found.' });
        }

        if (!dateDoc.dates.has(key)) {
            return res.status(404).json({ error: `Key "${key}" not found.` });
        }

        dateDoc.dates.delete(key); // Remove the key
        await dateDoc.save();

        res.status(200).json({ message: `Key "${key}" deleted successfully.`, data: Object.fromEntries(dateDoc.dates) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



//agenda
router.post('/addAgenda', addAgenda)
router.delete('/deleteAgenda/:id', deleteAgenda)
router.get('/getAgenda', getAgenda)



//venue
router.post('/addVenue', async (req, res) => {
    try {
        const { address, hotelLocation } = req.body;
        const images = req.files || {}; // Assuming images are uploaded

        // Fetch all existing venues to delete old images
        const oldVenues = await Venue.find();
        for (const venue of oldVenues) {           
            if (venue.image1) await deleteFile(venue.image1);
            if (venue.image2) await deleteFile(venue.image2);
            if (venue.image3) await deleteFile(venue.image3);
        }

        // Remove all existing data
        await Venue.deleteMany({});

        // Upload new images
        const image1 = images.image1 ? await uploadFile(images.image1, 'venue') : null;
        const image2 = images.image2 ? await uploadFile(images.image2, 'venue') : null;
        const image3 = images.image3 ? await uploadFile(images.image3, 'venue') : null;

        // Add new data
        const newVenue = new Venue({
            address,
            image1,
            image2,
            image3,
            hotelLocation,
        });

        await newVenue.save();

        res.status(201).send({ message: 'Venue data updated successfully', data: newVenue });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error', error });
    }
});


// GET API: Retrieve all data
router.get('/venue', async (req, res) => {
    try {
        const venues = await Venue.find();
        res.status(200).send({ data: venues });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error', error });
    }
});



//contact

router.post('/addContact', async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        // Validate required fields
        if (!name || !email || !phone || !message) {
            return res.status(400).send({ message: 'All fields are required' });
        }

        // Create a new contact entry
        const newContact = new Contact({ name, email, phone, message });
        await newContact.save();

        res.status(201).send({ message: 'Contact added successfully', data: newContact });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error', error });
    }
});

// GET API: Retrieve all contact entries
router.get('/contact', async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).send({ data: contacts });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error', error });
    }
});


//login

router.post('/login',login)
router.post('/register',register)


//plan
// router.post('/addParticipant',addParticipant)
// router.delete('/deleteparticipation/:id',deleteParticipant)
// // router.post('/addAccommodation',addAccommodation)
// // router.delete('/deleteAccommodation/:id',deleteAccommodation)
// router.get('/getparticipation',getParticipationTypes)

// router.post('/createPlan',createPlan)
// router.put('/updatePlan',updatePlanPrices)
// router.delete('/deletePlan/:id',deletePlan)
// router.get('/getPlans',getPlans)


router.post('/participationtypes',createParticipationType)
router.post('/updateparticipation',addParticipationTypeToPlans)
router.delete('/deleteparticipation/:id',deleteParticipationType)
router.get('/getparticipation',getParticipationTypes)

router.post('/createPlan',createPlan)
router.put('/updatePlan',updatePlanPrices)
router.delete('/deletePlan/:id',deletePlan)
router.get('/getPlans',getPlans)


// Add a new accommodation
router.post('/addAccommodation', addAccommodation);

// Update an accommodation
router.put('/updateAccommodation/:id', updateAccommodation);

// Delete an accommodation
router.delete('/deleteAccommodation/:id',deleteAccommodation);

// Get all accommodations
router.get('/getAccommodations',getAccommodations);



router.post('/guide-speaker', guidelineController.createSpeaker);
router.post('/guide-poster', guidelineController.createPoster);
router.post('/guide-chair', guidelineController.createChair);
router.post('/guide-virtual', guidelineController.createVirtual);

// GET endpoints
router.get('/guide-speaker', guidelineController.getSpeaker);
router.get('/guide-poster', guidelineController.getPoster);
router.get('/guide-chair', guidelineController.getChair);
router.get('/guide-virtual', guidelineController.getVirtual);


router.post('/privacy', createPrivacy);
router.post('/termsConditions', createTermsConditions);
router.post('/cancellation', createCancellation);

router.get('/privacy', getPrivacy);
router.get('/termsConditions',getTermsConditions);
router.get('/cancellation',getCancellation);

router.post("/register-and-pay", registerUserAndInitiatePayment);
router.post("/webhook", express.raw({ type: "application/json" }), handleWebhook);
router.get("/registrations", getRegistrations);

module.exports = router 