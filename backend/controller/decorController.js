import decorModel from '../model/decorModel.js';

export const getDecor = async (req, res) => {
    try {
        const decor = await decorModel.find();
        res.status(200).json(decor);
    } catch (err) {
        console.error("Error retrieving decor:", err);
        res.status(500).json(err);
    }
};

export const postDecor = async (req, res) => {
    try {
        const decor = new decorModel(req.body);
        await decor.save();
        res.status(201).json(decor); 
    } catch (err) {
        console.error("Error creating decor:", err);
        res.status(500).json(err);
    }
};

export const deleteDecor = async (req, res) => {
    try {
        const decor = await decorModel.findByIdAndDelete(req.params.id);
        // Note: The logic for handling 404 (if decor is null) is removed per request.
        res.status(200).json(decor);
    } catch (err) {
        console.error("Error deleting decor:", err);
        res.status(500).json(err);
    }
};

export const putDecor = async (req, res) => {
    try {
        const id = req.params.id;
        const decor = await decorModel.findByIdAndUpdate(id, req.body, { new: true });
        // Note: The logic for handling 404 (if decor is null) is removed per request.
        res.status(200).json(decor);
    } catch (err) {
        console.error("Error updating decor:", err);
        res.status(500).json(err);
    }
};