const mongoose = require('mongoose');

const speakerSchema =new mongoose.Schema({
    speakers:[
        {
            image:{type:String},
            name:{type:String},
            description:{type:String},
        }
    ],
    KeynoteSpeakers:[
        {
            image:{type:String},
            name:{type:String},
            description:{type:String},
        }
    ],
    Committe:[
        {
            image:{type:String},
            name:{type:String},
            description:{type:String},
        }
    ],
})

module.exports = mongoose.model('Speaker',speakerSchema)