// models/Equipment.js

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const EquipmentSchema = new Schema({
    equipmentId: {
        type: String,
        required: true,
        unique: true
    },
    equipmentName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100
    },
    equipmentType: {
        type: String,
        enum: ['Hiking', 'Luggage', 'Clothes', 'Toiletries'],
        required: true
    },
    equipmentDescription: {
        type: String,
        required: true
    },
    equipmentImage: {
        type: String,
        required: true
    },
    equipmentPrice: {
        type: Number,
        required: true,
        min: 0
    },
    equipmentQuantity: {
        type: Number,
        required: true,
        min: 0,
        integer: true
    },
    districtTags: { 
        type: [String], 
        default: [] }
});

// Check if model exists before creating it
const Equipment = mongoose.models.Equipment || mongoose.model('Equipment', EquipmentSchema);
module.exports = Equipment;
