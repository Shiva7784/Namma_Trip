const router = require('express').Router();
let TourPackage = require('../models/tourPackage.js');
const multer = require('multer');
const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
const path = require('path');

function deleteImage(filePath) {
    fs.unlink(path.join(__dirname, '..', 'TourPackageImages', filePath), (err) => {
        if (err) {
            console.error('Failed to delete the file:', err);
        }
    });
}

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "./TourPackageImages");
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname + "_" + Date.now() +"_" + file.originalname);
    } 
});

var upload = multer({
    storage: storage
}).single("pImage");


router.post('/AddTPackage', upload, async (req, res) => {
    try {

        const existingPackage = await TourPackage.findOne({ packageId: req.body.packageId });
        if (existingPackage) {
            deleteImage(req.file.filename);
            return res.status(400).json({ error: 'Package ID already exists.' });
        }

        const newPackage = new TourPackage({
            packageId: req.body.packageId,
            package_Title: req.body.package_Title,
            pCreateDate: req.body.pCreateDate,
            packageDes: req.body.packageDes,
            pCategory: req.body.pCategory,
            pImage: req.file.filename,
            packagePrice: Number(req.body.packagePrice),
            pDestination: req.body.pDestination,
            pDays: Number(req.body.pDays)
        });

        await newPackage.save();
        res.status(200).json(newPackage);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.route('/').get((req, res) => {

    TourPackage.find().then(tourPackages =>{
        res.json(tourPackages)
    }).catch(err => {
        console.log(err)
    });

});

router.put("/update/:id", upload, async(req, res) => {

    let fetchPackageID = req.params.id;
    const {packageId, package_Title, pCreateDate, packageDes, pCategory, packagePrice, pDestination, pDays} = req.body;
    const pImage = req.file ? req.file.filename : req.body.pImage;

    const updatePackage = {
        packageId,
        package_Title,
        pCreateDate,
        packageDes,
        pCategory,
        pImage,
        packagePrice,
        pDestination,
        pDays
    };
    
    try {
        const updatedPackage = await TourPackage.findByIdAndUpdate(fetchPackageID, updatePackage, { new: true });
        res.status(200).send({message: "Package Updated Successfully!", package: updatedPackage});
    }catch(err) {
        console.log(err);
        res.status(500).send({message: "Error with Updating Package", error: err.message});
    };

});

router.route("/delete/:id").delete(async (req, res) => {
    
    let fetchPackageID = req.params.id;

    try {
        const packageToDelete = await TourPackage.findById(fetchPackageID);

        if (!packageToDelete) {
            return res.status(404).send({ status: "Package not found!" });
        }

        if (packageToDelete.pImage) {
            deleteImage(packageToDelete.pImage);
        }

        await TourPackage.findByIdAndDelete(fetchPackageID);
        res.status(200).send({ status: "Package deleted!" });

    } catch (err) {
        console.log(err.message);
        res.status(500).send({ status: "Error with deleting package", error: err.message });
    }
});

router.route("/get/:id").get(async(req, res) => {
    let fetchPackageID = req.params.id;

    try {
        const fetchPackage = await TourPackage.findById(fetchPackageID);

        if (fetchPackage) {
            res.status(200).send({ status: "Package fetched!", package: fetchPackage });
        } else {
            res.status(404).send({ status: "Package not found" });
        }
    } catch (err) {
        res.status(500).send({ status: "Error fetching package", error: err.message });
    }
});

module.exports = router;