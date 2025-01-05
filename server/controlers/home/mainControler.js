const Home = require("../../models/home");

const {deleteFile,uploadFile} = require('../../middlewares/filehandle');

const uploadMainContent =async (req, res) => {
    const { section } = req.params;
    const updateData = req.body;

    // console.log(updateData);
    

    const validSections = [
        'main', 'about', 'topics', 'schedule', 'speakers', 'passes'
    ];

    // Map sections to schema fields
    const sectionMap = {
        main: ['backgroundImage', 'conferenceNum', 'conferencedate', 'conferencepalce'],
        about: ['aboutHeading', 'aboutDes', 'aboutImage1', 'aboutImage2'],
        topics: ['topicsList1', 'topicsList2', 'topicsList3'],
        schedule: ['day1', 'day2', 'day3'],
        // speakers: ['keyNote', 'speaker'],
        passes: ['pass1', 'pass2', 'pass3']
    };

    if (!validSections.includes(section)) {
        return res.status(400).json({ error: 'Invalid section specified.' });
    }

    const fieldsToUpdate = sectionMap[section];
    const updateFields = {};

    // Handle file uploads and arrays
    for (const key of fieldsToUpdate) {
        if (updateData[key]) {
            let value = updateData[key];

            // Check if value is a stringified array
            if (typeof value === 'string') {
                try {
                    const parsedValue = JSON.parse(value);
                    if (Array.isArray(parsedValue)) {
                        value = parsedValue; 
                    }
                } catch (err) {
                    // Ignore JSON.parse errors; treat as a regular string
                    console.log(err);
                    
                }
            }

            // Append to array or replace
            if (Array.isArray(value)) {
                if (req.query.action === 'append') {
                    updateFields[`$push`] = { [key]: { $each: value } };
                } else {
                    updateFields[key] = value;
                }
            } else {
                updateFields[key] = value;
            }
        }
    }

    try {
        const homeData = await Home.findOneAndUpdate({}, updateFields, { new: true });
        res.status(200).json(homeData);
    } catch (error) {
        
        console.log(error);
        
        res.status(500).json({ error: 'Failed to update home data.' });
    }
}


module.exports={uploadMainContent}