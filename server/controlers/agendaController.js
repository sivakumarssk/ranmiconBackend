const mongoose =require('mongoose')
const Agenda = require('../models/agenda')
const { uploadFile, deleteFile } = require('../middlewares/filehandle')



const addAgenda = async (req, res) => {
    try {
        const { date } = req.body;
        const file = req.files?.pdfFile;

        if (!file) {
            return res.status(400).send({ message: 'PDF file is required' });
        }

        // Upload the file and get the URL
        const pdfUrl = await uploadFile(file, 'agenda');

        const agendaItem = { date, pdf: pdfUrl };

        let agendaDoc = await Agenda.findOne();
        if (!agendaDoc) {
            agendaDoc = new Agenda({ agenda: [] });
        }

        agendaDoc.agenda.push(agendaItem);
        await agendaDoc.save();

        res.status(201).send({ message: 'Agenda added successfully', agenda: agendaDoc});
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error', error });
    }
}


const deleteAgenda = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).send({ message: 'Id is required' });
        }

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ message: 'Invalid ObjectId format' });
        }

        let agendaDoc = await Agenda.findOne();
        if (!agendaDoc) {
            return res.status(404).send({ message: 'No agendas found' });
        }

        // Find the index of the agenda item with the matching ObjectId
        const agendaIndex = agendaDoc.agenda.findIndex(
            (item) => item._id.toString() === id
        );

        if (agendaIndex === -1) {
            return res.status(404).send({ message: 'Agenda not found' });
        }

        // Delete the associated PDF file
        const pdfUrl = agendaDoc.agenda[agendaIndex].pdf;
        await deleteFile(pdfUrl);

        // Remove the agenda item
        agendaDoc.agenda.splice(agendaIndex, 1);
        await agendaDoc.save();

        res.status(200).send({ message: 'Agenda deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error', error });
    }
};



const getAgenda = async (req, res) => {
    try {
        const agendaDoc = await Agenda.findOne();
        if (!agendaDoc) {
            return res.status(404).send({ message: 'No agendas found' });
        }

        res.status(200).send({ agendas: agendaDoc.agenda });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error', error });
    }
}



module.exports = {
    addAgenda,
    deleteAgenda,
    getAgenda
}