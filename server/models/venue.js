
const mongoose =require('mongoose')

const VenueSchema =new mongoose.Schema({
    address:{
        type:String
    },
    image1:{
        type:String
    },
    image2:{
        type:String
    },
    image3:{
        type:String
    },
    hotelLocation:{
        type:String
    }
})

module.exports = mongoose.model('Venue',VenueSchema)