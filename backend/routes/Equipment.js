const router = require('express').Router();
const Equipment = require('../models/Equipment');
const PDFDocument = require('pdfkit');
const multer = require('multer');
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const Destination = require('../models/destination');

const app = express();
app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./EquipmentImages");
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

var upload = multer({
    storage: storage
}).single("equipmentImage");

function deleteImage(filePath) {
    fs.unlink(path.join(__dirname, '..', 'EquipmentImages', filePath), (err) => {
        if (err) {
            console.error('Failed to delete the file:', err);
        }
    });
}


router.post('/add', upload, async (req, res) => {
    try {
        // Parse tags (districtTags) if they're sent as a JSON string
        const tags = req.body.districtTags ? JSON.parse(req.body.districtTags) : [];

        const newEquipment = new Equipment({
            equipmentId: req.body.equipmentId,
            equipmentName: req.body.equipmentName,
            equipmentType: req.body.equipmentType,
            equipmentDescription: req.body.equipmentDescription,
            equipmentImage: req.file.filename,
            equipmentPrice: Number(req.body.equipmentPrice),
            equipmentQuantity: Number(req.body.equipmentQuantity),
            districtTags: tags // Add the district tags
        });

        await newEquipment.save();
        res.status(200).json(newEquipment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.route('/').get((req, res) => {
    Equipment.find()
        .then(equipment => res.json(equipment))
        .catch(err => res.status(400).json('Error: ' + err));
});


router.route("/update/:id").put(upload, async (req, res) => {
    let fetchequipmentID = req.params.id;
    const { equipmentName, equipmentType, equipmentDescription, equipmentPrice, equipmentQuantity } = req.body;

    try {
        const existingEquipment = await Equipment.findById(fetchequipmentID);
        
        // If no image is uploaded, use the existing image
        const equipmentImage = req.file ? req.file.filename : existingEquipment.equipmentImage;

        // Update equipment with the new fields
        const updateEquipment = {
            equipmentName,
            equipmentType,
            equipmentDescription,
            equipmentImage,
            equipmentPrice: Number(equipmentPrice),
            equipmentQuantity: Number(equipmentQuantity),
            districtTags: req.body.districtTags ? JSON.parse(req.body.districtTags) : existingEquipment.districtTags // Handle districtTags if present
        };

        // Update the equipment document in the database
        const updatedEquipment = await Equipment.findByIdAndUpdate(fetchequipmentID, updateEquipment, { new: true });

        // Send response with updated equipment data
        res.status(200).json({ status: "Equipment updated", equipment: updatedEquipment });
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: "Error with updating data", error: err.message });
    }
});


router.route("/delete/:id").delete(async(req, res) =>{

    let fetchequipmentID = req.params.id;

   
    try {
        const equipmentToDelete = await Equipment.findById(fetchequipmentID);

        if (!equipmentToDelete) {
            return res.status(404).send({ status: "Equipment not found!" });
        }

        if (equipmentToDelete.equipmentImage) {
            deleteImage(equipmentToDelete.equipmentImage);
        }

        await Equipment.findByIdAndDelete(fetchequipmentID);
        res.status(200).send({ status: "Equipment deleted!" });

    } catch (err) {
        console.log(err.message);
        res.status(500).send({status: "Error with deleting Equipment", error: err.message});
    }
});

router.route("/get/:id").get(async(req, res) => {
    let fetchEquipmentID = req.params.id;

    try {
        const fetchEquipment = await Equipment.findById(fetchEquipmentID);
        console.log(fetchEquipment); 

        if (fetchEquipment) {
            res.status(200).send({ status: "Equipment fetched!", equipment: fetchEquipment });
        } else {
            res.status(404).send({ status: "Equipment not found" });
        }
    } catch (err) {
        res.status(500).send({ status: "Error fetching equipment", error: err.message });
    }
});




router.get('/report', async (req, res) => {
    try {
        const lowStockEquipment = await Equipment.find({ equipmentQuantity: { $lt: 5 } });
        const pdfDoc = new PDFDocument({
            size: 'A4',
            margins: { top: 50, bottom: 50, left: 50, right: 50 }
        });
        let filename = 'low_stock_equipment_report.pdf';
        res.setHeader('Content-Disposition', 'attachment; filename="' + filename + '"');
        res.setHeader('Content-Type', 'application/pdf');

        pdfDoc.pipe(res);

        
        const logoPath = path.join(__dirname, '/logo.png');
        const newImageWidth = 200;
        pdfDoc.image(logoPath, pdfDoc.page.width / 2 - newImageWidth / 2, 50, { fit: [200, 200], align: 'center' });

        
        pdfDoc.moveDown(6);
        pdfDoc.font('Helvetica-Bold').fontSize(20).text('Low Stock Equipment Report', { align: 'center' });
        pdfDoc.moveDown(1);

        
        pdfDoc.fontSize(12).text(`Date: ${new Date().toLocaleDateString()}`, { align: 'right' });
        pdfDoc.moveDown(1);

        
        const tableTop = 220;
        const idX = 50;
        const descriptionX = 200;
        const quantityX = 450;
        const rowHeight = 25;

        
        const addTableHeader = (y) => {
            pdfDoc.font('Helvetica-Bold').fontSize(14);
            pdfDoc.text('Equipment ID', idX, y);
            pdfDoc.text('Equipment Name', descriptionX, y);
            pdfDoc.text('Quantity', quantityX, y);
            pdfDoc.moveTo(50, y + 20).lineTo(pdfDoc.page.width - 50, y + 20).stroke();
            return y + 30;
        };

        let yPosition = addTableHeader(tableTop);
        let currentPage = 1;

        // Add table content
        pdfDoc.font('Helvetica').fontSize(12);

        for (let i = 0; i < lowStockEquipment.length; i++) {
            const item = lowStockEquipment[i];

            // Check if we need a new page or if we've reached the footer area
            if (yPosition > pdfDoc.page.height - 100) {
                if (currentPage === 1) {
                    // Add footer to the first page before adding a new page
                    addFooter(pdfDoc, currentPage);
                    pdfDoc.addPage();
                    yPosition = 50;
                    yPosition = addTableHeader(yPosition);
                    currentPage++;
                } else {
                    // If we're already on the second page, stop adding items
                    break;
                }
            }

            // Add light gray background for even rows
            if (i % 2 === 0) {
                pdfDoc.rect(50, yPosition - 5, pdfDoc.page.width - 100, rowHeight).fill('#f2f2f2');
            }

            pdfDoc.fillColor('black');
            pdfDoc.text(item.equipmentId.toString(), idX, yPosition, { width: 140, ellipsis: true });
            pdfDoc.text(item.equipmentName, descriptionX, yPosition, { width: 240, ellipsis: true });
            pdfDoc.text(item.equipmentQuantity.toString(), quantityX, yPosition);

            yPosition += rowHeight;
        }

    

        pdfDoc.end();
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});



router.get('/recommend/:destinationID', async (req, res) => {
    try {
        // Find the destination by ID
        const destination = await Destination.findById(req.params.destinationID);

        if (!destination) {
            return res.status(404).json({ message: 'Destination not found' });
        }

        const destinationDistrict = destination.dDistrict;

        // Find all equipment that has district tags matching the destination district
        const recommendedEquipment = await Equipment.find({ districtTags: destinationDistrict });

        // If no equipment is found, send an empty array
        if (recommendedEquipment.length === 0) {
            return res.status(200).json({ message: 'No relevant equipment found for this destination', equipment: [] });
        }

        // Send the recommended equipment back
        res.status(200).json({ equipment: recommendedEquipment });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;