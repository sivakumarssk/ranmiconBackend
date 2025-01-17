const mongoose =require('mongoose')

const HomeSchema =new mongoose.Schema({

    //main
    backgroundImage:{
        type:String,
    },
    logo:{
        type:String,
    },
    email:{
        type:String,
    },
    conferenceHead:{
        type:String,
    },
    conferenceHead2:{
        type:String,
    },
    conferencedate:{
        type:String,
    },
    conferencepalce:{
        type:String,
    },

    //about
    aboutHeading:{
        type:String
    },
    aboutDes:{
        type:String
    },
    aboutImage1:{
        type:String
    },
    aboutImage2:{
        type:String
    },

    //topics
    topicsList1:[],
    topicsList2:[],
    topicsList3:[],

    //shedule

    day1:{
        dayDate:{
            type:String
        },
        list:[{ head:{
            type:String
        },
        date:{
            type:String
        }}]
       
    },
    day2:{
        dayDate:{
            type:String
        },
        list:[{ head:{
            type:String
        },
        date:{
            type:String
        }}]
       
    },
    day3:{
        dayDate:{
            type:String
        },
        list:[{ head:{
            type:String
        },
        date:{
            type:String
        }}]
       
    },


    //speakers

    KeynoteSpeakers:[{
        image:{
            type:String
        },
        name:{
            type:String
        },
        description:{
            type:String
        },
        speakerId:{
            type:String
        }
    }],

    speaker:[{
        image:{
            type:String
        },
        name:{
            type:String
        },
        description:{
            type:String
        },
        speakerId:{
            type:String
        }
    }],

    //pass

    pass1:[{
        name:{
            type:String
        },
        price:{
            type:Number
        },
        benifits:[]
    }
    ],
    pass2:[{
        name:{
            type:String
        },
        price:{
            type:Number
        },
        benifits:[]
    }],
    pass3:[{
        name:{
            type:String
        },
        price:{
            type:Number
        },
        benifits:[]
    }]
})


module.exports = mongoose.model('Home',HomeSchema)