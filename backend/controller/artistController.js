import artistModel from "../model/artistModel.js";

// --- READ (GET) ---
export const getArtist = async (req, res) => {
    try {
        const artists = await artistModel.find();
        res.status(200).json(artists);
    } catch (err) {
        // Use 500 for server-side operational errors like database connection issues
        res.status(500).json({ message: err.message });
    }
};

// --- CREATE (POST) ---
export const postArtist = async (req, res) => {
    // Destructure fields from the request body
    const { url, title, description, price } = req.body;
    
    try {
        // Validation check for required fields (optional, but good practice)
        if (!url || !title || !description || !price) {
            return res.status(400).json({ message: "All fields (url, title, description, price) are required." });
        }
        
        const newArtist = await artistModel.create({
            url,
            title,
            description,
            price
        });
        
        res.status(201).json(newArtist); // Use 201 for successful creation
    } catch (err) {
        // Use 400 for errors related to invalid input (e.g., failed Mongoose validation)
        res.status(400).json({ message: err.message });
    }
};

// --- UPDATE (PUT/PATCH) ---
export const putArtist = async (req, res) => {
    const { id } = req.params.id;
   try {
        const updatedArtist = await artistModel.findByIdAndUpdate(id,req.body);

        if (!updatedArtist) {
            return res.status(404).json({ message: "Artist not found." });
        }

        res.status(200).json(updatedArtist);
    } catch (err) {
        // Use 400 for validation errors or 500 for server errors
        res.status(400).json({ message: err.message });
    }
};

// --- DELETE (DELETE) ---
export const deleteArtist = async (req, res) => {
    // Get the ID of the artist to delete from the URL parameters
    const { id } = req.params;

    try {
        const deletedArtist = await artistModel.findByIdAndDelete(id);

        if (!deletedArtist) {
            return res.status(404).json({ message: "Artist not found." });
        }

        // Return a 200 with a success message (or the deleted object)
        res.status(200).json({ message: "Artist deleted successfully." });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};