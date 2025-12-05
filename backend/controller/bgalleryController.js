// controller/bgalleryController.js
import bgalleryModel from "../model/bgalleryModel.js";

// GET ALL
export const bgalleryGet = async (req, res) => {
    try {
        const bgallery = await bgalleryModel.find();
        res.status(200).json(bgallery);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// POST NEW
export const bgalleryPost = async (req, res) => {
    try {
        const { img, video } = req.body; 

        const newGallery = await bgalleryModel.create({
            img,
            video
        });

        res.status(201).json(newGallery); // Return the created object directly
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const bgalleryDelete = async (req, res) => {
    try {
        const { id } = req.params;
        await bgalleryModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Gallery deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
    
export const bgalleryPut = async (req, res) => {
    try {
        const { id } = req.params;
        const { img, video } = req.body;
        const bgallery = await bgalleryModel.findByIdAndUpdate(id, { img, video }, { new: true });
        res.status(200).json(bgallery); // Return the updated object directly
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};