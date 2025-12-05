import clientModel from "../model/clientModel.js";

// GET ALL clients (READ)
export const getClient = async (req, res) => {
    try {
        const clients = await clientModel.find();
        res.status(200).json(clients);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST a new client (CREATE)
export const postClient = async (req, res) => {
    const newClient = new clientModel({
        name: req.body.name,
        review: req.body.review,
        rating: req.body.rating,
    });

    try {
        const savedClient = await newClient.save();
        res.status(201).json(savedClient);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// PUT/UPDATE an existing client by ID (UPDATE)
export const putClient = async (req, res) => {
    const clientId = req.params.id; 

    try {
        const updatedClient = await clientModel.findByIdAndUpdate(
            clientId,
            req.body,
            { new: true, runValidators: true } // Return updated doc and validate
        );

        if (!updatedClient) {
            return res.status(404).json({ message: "Client not found" });
        }

        res.status(200).json(updatedClient);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// DELETE a client by ID (DELETE)
export const deleteClient = async (req, res) => {
    const clientId = req.params.id;

    try {
        const result = await clientModel.findByIdAndDelete(clientId);

        if (!result) {
            return res.status(404).json({ message: "Client not found" });
        }

        res.status(200).json({ message: "Client successfully deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};