import Destini from "../model/destiniModel.js"; // Assuming this is your model file

// --- Helper Function: Map FE to Schema Names ---
// This is used internally for POST (Create)
const mapFrontendToSchema = (body) => {
    // Map the fields from the frontend (url, head, desc) to the schema (imgURL, title, description)
    return {
        pass: body.pass,
        imgURL: body.url,        // Maps frontend 'url' to schema 'imgURL'
        title: body.head,        // Maps frontend 'head' to schema 'title'
        description: body.desc,  // Maps frontend 'desc' to schema 'description'
        place: body.place,
        price: body.price,
        gallery: body.gallery || [],
    };
};

// --- GET: Fetch all documents (READ) ---
export const getDestini = async (req, res) => {
    try {
        const destini = await Destini.find({}); // Find all documents
        res.status(200).json(destini);
    } catch (err) {
        // Use 500 for general server/DB errors
        res.status(500).json({ message: 'Error fetching destinations: ' + err.message });
    }
};

// --- POST: Create a new document (CREATE) ---
export const postDestini = async (req, res) => {
    try {
        // 1. Map the received frontend data (req.body) to the expected schema names
        const mappedData = mapFrontendToSchema(req.body);

        // 2. Create the document using the mapped data
        const destini = await Destini.create(mappedData);
        
        res.status(201).json(destini); // 201 Created
    } catch (err) {
        // Mongoose validation errors caught here
        console.error('Destini creation error:', err.message);
        res.status(400).json({ message: 'Validation failed: ' + err.message });
    }
};

// --- PUT: Update a document by ID (UPDATE) ---
export const putDestini = async (req, res) => {
    const { id } = req.params;
    
    // NOTE: For updates, we assume the frontend sends the *schema names* (imgURL, title, etc.)
    // or you must apply the mapping logic here as well if the FE sends the old names.
    // Assuming FE sends schema names (pass, imgURL, title...) for a proper update payload:
    const updateData = req.body; 

    try {
        const destini = await Destini.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true } // new: true returns the updated document, runValidators checks schema rules
        );

        if (!destini) {
            return res.status(404).json({ message: "Destination not found" });
        }

        res.status(200).json(destini);
    } catch (err) {
        // Validation errors during update are caught here
        res.status(400).json({ message: 'Update failed: ' + err.message });
    }
};

// --- DELETE: Delete a document by ID (DELETE) ---
export const deleteDestini = async (req, res) => {
    const { id } = req.params;

    try {
        const destini = await Destini.findByIdAndDelete(id);

        if (!destini) {
            return res.status(404).json({ message: "Destination not found" });
        }

        res.status(200).json({ message: "Destination successfully deleted", deletedDocument: destini });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting destination: ' + err.message });
    }
};