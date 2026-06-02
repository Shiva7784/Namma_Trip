const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tourPackageSchema = new Schema({
    packageId: {
        type: String,
        required: [true, "Tour Package ID is required!"],
        unique: [true, "Tour Package ID is Alredy Exists!"],
    },

    package_Title: {
        type: String,
        required: [true, "Tour Package Title is required!"],
        minlength: [10, "Tour Package Title should be at least 10 characters"]
    },

    pCreateDate: {
        type : String,
        required : true,
        default: Date.now
    },

    packageDes: {
        type: String,
        required: [true, "Tour Package Description is required!"],
        minlength: [100, "Tour Package Description should be at least 100 characters"]
    },

    pCategory: {
        type: String,
        enum: ['Adventure Tours', 'Cultural Tours', 'Wildlife and Nature Tours'],
        required: [true, "Tour Package Category is required!"]
    },

    pImage: {
        type: String,
        required: [true, "Tour Package Image is required!"]
    },

    packagePrice: {
        type: Number,
        required: [true, "Tour Package Price is required!"],
        min: [0, "Tour Package Price must be at least 0"]
    },

    pDestination: {
        type: String,
        required: [true, "Tour Package Destinations are required!"],
    },

    pDays: {
        type: Number,
        required: [true, "Number of days is required!"],
        validate: {
            validator: function(value) {
                return [3, 5, 7].includes(value) || value > 7;
            },
            message: "Tour Package Days must be 3, 5, 7, or more than 7"
        }
    }

});

const TourPackage =  mongoose.models.TourPackage || mongoose.model('TourPackage', tourPackageSchema);

module.exports = TourPackage;
