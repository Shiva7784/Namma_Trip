const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const destinationSchema = new Schema({

    destinationID : {
        type : String,
        required: true
    },

    dTitle : {
        type : String,
        required: true
    },

    dDescription : {
        type : String,
        required: true
    },

    dThumbnail : {
        type : String,
        required: true
    },

    dExtImage : {
        type : String,
        required: true
    },

    dDistrict : {
        type : String,
        required: true
    },

    dProvince : {
        type : String,
        required: true
    },

    longitude: { 
        type: Number, 
        required: true },

    latitude: { 
        type: Number, 
        required: true },

    clickCount : {
        type : Number,
        default: 0,
    },

    creationDate : {
        type : Date,
        default: Date.now
    },

});

// Check if model exists before creating it
const Destination = mongoose.models.Destination || mongoose.model("Destination", destinationSchema);

module.exports = Destination;