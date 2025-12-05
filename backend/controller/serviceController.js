

import serviceModel from "../model/serviceModel.js";

// --- R: READ All Services ---
export const getService = async (req, res) => {
    try {
        // Find all documents
        const services = await serviceModel.find();
        res.status(200).json(services);
    } catch (err) {
        // 500 Internal Server Error
        res.status(500).json({ message: err.message });
    }
};

// --- C: CREATE a New Service ---
export const postService = async (req, res) => {
    // FIX: Extract fields and use the correct name 'features'
    const { head, title, description, price, currency, features, buttonText, variant } = req.body; 

    try {
        const savedService = await serviceModel.create({
            head,
            title,
            description, // Added from schema
            price,
            currency,    // Added from schema
            features,    // Corrected to match model schema (plural)
            buttonText,  // Added from schema
            variant      // Added from schema
        });
        
        // 201 Created
        res.status(201).json(savedService);
    } catch (err) {
        // 400 Bad Request for validation errors
        res.status(400).json({ message: err.message });
    }
};

// --- U: UPDATE a Service by ID ---
export const putService = async (req, res) => {
    const { id } = req.params; 

    try {
        const updatedService = await serviceModel.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true } 
        );

        if (!updatedService) {
            // 404 Not Found
            return res.status(404).json({ message: "Service package not found." });
        }

        // 200 OK
        res.status(200).json(updatedService);
    } catch (err) {
        // 400 Bad Request for validation errors
        res.status(400).json({ message: err.message });
    }
};

// --- D: DELETE a Service by ID ---
export const deleteService = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedService = await serviceModel.findByIdAndDelete(id);

        if (!deletedService) {
            // 404 Not Found
            return res.status(404).json({ message: "Service package not found." });
        }

        // 200 OK 
        res.status(200).json({ message: "Service package successfully deleted." });
    } catch (err) {
        // 500 Internal Server Error
        res.status(500).json({ message: err.message });
    }
}