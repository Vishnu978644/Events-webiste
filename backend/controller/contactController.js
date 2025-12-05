import contactModel from "../model/contactModel.js";

export const getContact = async (req, res) => {
    try {
        const contacts = await contactModel.find();
        res.status(200).json(contacts);
    } catch (err) {
        console.error("Error retrieving contacts:", err);
        res.status(500).json({ message: "Failed to retrieve contact messages.", error: err.message });
    }
};

// contactController.js

export const postContact = async (req, res) => {
    
    // 1. Destructure all fields from the request body
    const { 
        firstName, lastName, phoneNumber, 
        emailAddress, subjectLine, messageBody 
    } = req.body;

    // 2. Define the payload for the Mongoose model.
    //    We explicitly add the required backend-only fields with default values.
    const contactPayload = {
        firstName,
        lastName,
        phoneNumber,
        emailAddress,
        subjectLine,
        messageBody,
        // --- ADD THE REQUIRED DEFAULT FIELDS ---
        isRead: false,          // Default value for a new message
        dateSent: new Date(),   // Timestamp for the new message
        // ----------------------------------------
    };

    try {
        // 3. Create and save the new contact using the complete payload
        const newContact = new contactModel(contactPayload);
        const savedContact = await newContact.save();
        
        res.status(201).json(savedContact);
        
    } catch (err) {
        console.error("Error creating contact message:", err);
        
        // Handle Mongoose Validation Errors (400)
        if (err.name === 'ValidationError') {
            return res.status(400).json({ 
                message: "Validation Failed. Check required fields.", 
                errors: err.errors
            });
        }
        
        // Handle other server errors (500)
        res.status(500).json({ message: "Internal server error.", error: err.message });
    }
};
export const putContact = async (req, res) => {
    try {
        const contactId = req.params.id; 
        
        const updatedContact = await contactModel.findByIdAndUpdate(
            contactId,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        
        res.status(200).json(updatedContact);
    } catch (err) {
       
        res.status(400).json({ message: "Failed to update contact message.", error: err.message });
    }
};

export const deleteContact = async (req, res) => {
    try {
        const contactId = req.params.id; 

        const deletedContact = await contactModel.findByIdAndDelete(contactId);
        res.status(200).json({ message: "Contact message successfully deleted.", deleted: deletedContact });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete contact message.", error: err.message });
    }
};