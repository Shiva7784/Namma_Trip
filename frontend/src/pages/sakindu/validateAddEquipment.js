export default function ValidateAddEquipment(equipment) {
    const errors = {};
  
    
    if (!equipment.equipmentId) {
      errors.equipmentId = "Equipment ID is required";
    }
  
    
    if (!equipment.equipmentName) {
      errors.equipmentName = "Equipment Name is required";
    } else if (equipment.equipmentName.length < 3) {
      errors.equipmentName = "Equipment Name must be at least 3 characters long";
    }
  
    
    if (!equipment.equipmentType) {
      errors.equipmentType = "Equipment Type is required";
    }
  
    
    if (!equipment.equipmentDescription) {
      errors.equipmentDescription = "Equipment Description is required";
    } else if (equipment.equipmentDescription.length < 10) {
      errors.equipmentDescription = "Description must be at least 10 characters long";
    }
  
    
    if (!equipment.equipmentPrice) {
      errors.equipmentPrice = "Equipment Price is required";
    } else if (isNaN(equipment.equipmentPrice) || equipment.equipmentPrice <= 0) {
      errors.equipmentPrice = "Price must be a valid positive number";
    }
  
    
    if (!equipment.equipmentQuantity) {
      errors.equipmentQuantity = "Equipment Quantity is required";
    } else if (isNaN(equipment.equipmentQuantity) || equipment.equipmentQuantity <= 0) {
      errors.equipmentQuantity = "Quantity must be a valid positive number";
    }
  

  
    return errors;
  }
  