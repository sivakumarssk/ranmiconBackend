const Abstract = require('../models/abstract');

const {uploadFile} =require('../middlewares/filehandle')

exports.addTopics = async (req, res) => {
    const { topics } = req.body;

    // console.log(topics);

    // if (!Array.isArray(JSON.parse(topics))){
    //     return res.status(400).json({ error: 'Invalid topics data. Must be an array.' });
    // }

    try {

        // let parsedValue =JSON.parse(topics);

        let abstract = await Abstract.findOne();
        if (!abstract) {
            abstract = new Abstract({ topics: [] });
        }

        abstract.topics.push(topics);
        await abstract.save();

        res.status(200).json({ message: 'Topics added successfully.', topics: abstract.topics });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteTopic = async (req, res) => {
    const { topic } = req.body;

    if (!topic) {
        return res.status(400).json({ error: 'Topic is required.' });
    }

    try {
        const abstract = await Abstract.findOne();
        if (!abstract) {
            return res.status(404).json({ error: 'Abstract document not found.' });
        }

        abstract.topics = abstract.topics.filter((t) => t !== topic); // Remove the specified topic
        await abstract.save();

        res.status(200).json({ message: 'Topic deleted successfully.', topics: abstract.topics });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTopic =async(req, res)=>{
    try {
        const abstract = await Abstract.findOne();
        if (!abstract) {
            return res.status(404).json({ error: 'Abstract document not found.' });
        }

        res.status(200).send(abstract.topics)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.uploadAbstract = async (req, res) => {
    const { title, name, email, organization, phone, country, interestedIn, session } = req.body;
    const file = req.files?.attachFile;

    if (!file) {
        return res.status(400).json({ error: 'File is required and must be a PDF.' });
    }

    try {
        const filePath = await uploadFile(file, 'abstract');
        if (!filePath) {
            return res.status(500).json({ error: 'Error uploading file.' });
        }

        const abstractData = {
            title,
            name,
            email,
            organization,
            phone,
            country,
            interestedIn,
            session,
            attachFile: filePath,
        };

        const newAbstract = new Abstract(abstractData);
        await newAbstract.save();

        res.status(200).json({ message: 'Abstract uploaded successfully.', abstract: newAbstract });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllAbstractData = async (req, res) => {
    try {
        const abstracts = await Abstract.find(); // Fetch all documents from the Abstract collection

        if (!abstracts || abstracts.length === 0) {
            return res.status(404).json({ error: 'No abstract data found.' });
        }

        res.status(200).json({ abstracts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


