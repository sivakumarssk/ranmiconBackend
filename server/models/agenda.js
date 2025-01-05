
const mongoose =require('mongoose')

const AgendaSchema = new mongoose.Schema({
    agenda:[
        {
            date:{
                type:String
            },
            pdf:{
                type:String
            }
        }
    ]
})


module.exports = mongoose.model('Agenda',AgendaSchema)