const AddTicketValidation = (subject, description, priority, customerEmail) => {
    const errors = {};

    const subjectPattern = /^.{3,100}$/;

    const descriptionPattern = /^.{20,500}$/;
    // Email pattern for validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validate subject
    if (!subjectPattern.test(subject)) {
        errors.subject = "Subject must be between 3 and 100 characters.";
    }

    // Validate description
    if (!descriptionPattern.test(description)) {
        errors.description = "Description must be between 20 and 500 characters.";
    }

    // Validate priority
    const validPriorities = ["Low", "Medium", "High"];
    if (!validPriorities.includes(priority)) {
        errors.priority = "Please select a valid priority.";
    }

    // Validate customer email
    if (!emailPattern.test(customerEmail)) {
        errors.customerEmail = "Please enter a valid email address.";
    }

    return errors;
};

export default AddTicketValidation;
