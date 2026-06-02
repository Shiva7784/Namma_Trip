import jsPDF from 'jspdf';
import {imgData} from './PdfImg'

export const GeneratePdf = ({ tourPackages, selectedPackage, pPrice, numPeople, equipmentList, equipment, handleFee, vat, totalPrice }) => {

    const doc = new jsPDF();
    
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        
        const imgWidth = 156;
        const imgHeight = 156;
        const xPos = (pageWidth - imgWidth) / 2;
        const yPos = (pageHeight - imgHeight) / 2;
        doc.setGState(new doc.GState({ opacity: 0.3 }));
        doc.addImage(imgData, 'png', xPos, yPos, imgWidth, imgHeight);

        doc.setGState(new doc.GState({ opacity: 1.0 })); // Reset opacity
        
        doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
    
        doc.setFontSize(30);
        doc.text('Quotation', pageWidth / 2, 25, { align: 'center' });
        
        doc.setFontSize(15);
        doc.text("Package Name", 25, 50);
        doc.text("Number of People", 95, 50);
        doc.text("Price (INR) ", 170, 50);
        doc.line(23, 52, 198, 52);

    
        const packageName = tourPackages.find(pkg => pkg._id === selectedPackage)?.package_Title || 'No packages';
        const wrappedPackageName = doc.splitTextToSize(packageName, 70);

        doc.setFontSize(12);
        doc.text(wrappedPackageName, 20, 60);
        doc.text(`${numPeople}`, 100, 60);
        doc.text(`${pPrice.toFixed(2)}`, 173, 60); 
        
        let equipmentYPos = 100;
        doc.setFontSize(15);
        doc.text("Equipment Name", 25, equipmentYPos);
        doc.text("Number of Items", 95, equipmentYPos);
        doc.text("Price (INR)", 170, equipmentYPos);
        doc.line(23, 102, 198, 102);

        equipmentList.forEach((equipmentItem, index) => {
            const eqName = equipment.find(eq => eq._id === equipmentItem.selectedEquipment)?.equipmentName || 'No Items';
            equipmentYPos += 10;
            doc.setFontSize(12);
            doc.text(eqName, 20, equipmentYPos);
            doc.text(`${equipmentItem.numItems ? equipmentItem.numItems : 'No Items'}`, 100, equipmentYPos);
            doc.text(`${equipmentItem.eqPrice.toFixed(2)}`, 173, equipmentYPos);
        });

        let pricingYPos = equipmentYPos + 30;

        doc.setFontSize(13);
        doc.text("Handling Fee (INR):", 120, pricingYPos);
        doc.text(`${handleFee.toFixed(2)}`, 173, pricingYPos);
        
        pricingYPos += 10;
        doc.text("5% GST (INR):", 120, pricingYPos);
        doc.text(`${vat.toFixed(2)}`, 173, pricingYPos);
        
        pricingYPos += 20;
        doc.setFontSize(15);
        doc.text("Total Price (INR):", 120, pricingYPos);
        doc.text(`${totalPrice.toFixed(2)}`, 170, pricingYPos);

        doc.setFontSize(12);
        doc.text("Note: The prices mentioned in this quotation are subject to change without prior notice due to", 15, pageHeight - 40);
        doc.text("fluctuations in market conditions, availability, or other unforeseen circumstances. Please confirm", 15, pageHeight - 33);
        doc.text("the prices before proceeding with the booking.", 15, pageHeight - 26);

        doc.save('quotation.pdf');


}