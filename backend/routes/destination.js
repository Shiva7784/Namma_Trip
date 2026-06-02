const router = require('express').Router();
const Destination = require('../models/destination');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const app = express();
const Package = require('../models/tourPackage');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'DestinationImages');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  }
});

const upload = multer({ storage: storage }).single('dThumbnail');

function deleteImage(imagePath) { 
  fs.unlink(path.join(__dirname, '..', 'DestinationImages', imagePath), (err) => {
    if (err) {
      console.error(err);
    }
  });
}

app.use(cors());
app.use(express.json());

// Add a new destination
router.post("/add", upload, [
  // Validation rules
  body('destinationID')
    .matches(/^D\d{3}$/)
    .withMessage('Destination ID must be in the format Dxxx, where xxx is a 3-digit number.'),

  body('dTitle')
    .isString()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters.'),

  body('dDescription')
    .isString()
    .isLength({ min: 20, max: 500 })
    .withMessage('Description must be between 20 and 500 characters.'),

  body('dDistrict')
    .notEmpty()
    .withMessage('District is required.'),

  body('dProvince')
    .notEmpty()
    .withMessage('Province is required.'),

  body('longitude')
    .isNumeric()
    .withMessage('Longitude must be a valid number.'),

  body('latitude')
    .isNumeric()
    .withMessage('Latitude must be a valid number.'),
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { destinationID, dTitle, dDescription, dExtImage, dDistrict, dProvince, longitude, latitude } = req.body;

    const newDestination = new Destination({
      destinationID,
      dTitle,
      dDescription,
      dThumbnail: req.file ? req.file.filename : '', 
      dExtImage,
      dDistrict,
      dProvince,
      longitude,
      latitude,
      clickCount: 0 
    });

    await newDestination.save();
    res.status(201).json("Destination added");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error adding destination" });
  }
});

// Get all destinations
router.get("/", async (req, res) => {
  try {
    const destinations = await Destination.find().select('destinationID dTitle dDescription dThumbnail dExtImage dDistrict dProvince longitude latitude creationDate clickCount');
    res.status(200).json(destinations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching destinations" });
  }
});

// Update an existing destination
router.put("/update/:id", upload, [
  // Validation rules
  body('dTitle')
    .optional()
    .isString()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters.'),

  body('dDescription')
    .optional()
    .isString()
    .isLength({ min: 20, max: 500 })
    .withMessage('Description must be between 20 and 500 characters.'),

  body('dDistrict')
    .optional()
    .notEmpty()
    .withMessage('District is required.'),

  body('dProvince')
    .optional()
    .notEmpty()
    .withMessage('Province is required.'),

  body('longitude')
    .optional()
    .isNumeric()
    .withMessage('Longitude must be a valid number.'),

  body('latitude')
    .optional()
    .isNumeric()
    .withMessage('Latitude must be a valid number.'),
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const destinationID = req.params.id;
    const { dTitle, dDescription, dExtImage, dDistrict, dProvince, longitude, latitude } = req.body;

    const updatedDestination = {
      dTitle,
      dDescription,
      dThumbnail: req.file ? req.file.filename : req.body.dThumbnail, 
      dExtImage,
      dDistrict,
      dProvince,
      longitude,
      latitude
    };

    const result = await Destination.findByIdAndUpdate(destinationID, updatedDestination, { new: true });
    if (!result) {
      return res.status(404).json({ error: "Destination not found" });
    }
    res.status(200).json({ status: "Destination updated", destination: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating destination" });
  }
});

// Delete a destination
router.delete("/delete/:id", async (req, res) => {
  try {
    const destinationID = req.params.id;
    const destination = await Destination.findById(destinationID);
    if (!destination) {
      return res.status(404).json({ error: "Destination not found" });
    }

    if (destination.dThumbnail) {
      deleteImage(destination.dThumbnail);
    }

    await Destination.findByIdAndDelete(destinationID);
    res.status(200).json({ status: "Destination deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting destination" });
  }
});

// Get a specific destination
router.get("/get/:id", async (req, res) => {
  try {
    const destinationID = req.params.id;
    const destination = await Destination.findById(destinationID);
    if (!destination) {
      return res.status(404).json({ error: "Destination not found" });
    }
    res.status(200).json({ status: "Destination fetched", destination });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching destination" });
  }
});

// Route to handle incrementing the click count
router.put('/:id/click', async (req, res) => {
  try {
    const { id } = req.params;
    const destination = await Destination.findById(id);

    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    // Increment the click count
    destination.clickCount = (destination.clickCount || 0) + 1;
    await destination.save();

    res.json({ message: 'Click count updated', clickCount: destination.clickCount });
  } catch (error) {
    res.status(500).json({ message: 'Error updating click count', error });
  }
});

router.get('/byDestination/:destinationId', async (req, res) => {
  const { destinationId } = req.params;

  try {
    // Find the destination by ID
    const destination = await Destination.findById(destinationId);
    
    if (!destination) {
      return res.status(404).json({ error: "Destination not found" });
    }

    const destinationDistrict = destination.dDistrict;
    const destinationProvince = destination.dProvince;

    // Query to find packages where the pDestination contains the district or province
    const packages = await Package.find({
      pDestination: {
        $regex: destinationDistrict, // Match packages that have the district
        $options: 'i' // Case-insensitive matching
      }
    });

    res.json({ packages });
  } catch (err) {
    res.status(500).json({ error: "Error fetching packages" });
  }
});

module.exports = router;
