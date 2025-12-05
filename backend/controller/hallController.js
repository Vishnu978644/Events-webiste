import hallsModel from '../model/hallsModel.js';

export const getHall = async (req, res) => {
    try {
        const hall = await hallsModel.find();
        res.status(200).json(hall);
    } catch (err) {
        console.error("Error retrieving halls:", err);
        res.status(500).json(err);
    }
};

export const postHall = async (req, res) => {
    try {
        const hero = new hallsModel(req.body);
        await hero.save();
        res.status(200).json(hero);
    } catch (err) {
        console.error("Error creating hall:", err);
        res.status(500).json(err);
    }
};

export const deleteHall = async (req, res) => {
    try {
        const hero = await hallsModel.findByIdAndDelete(req.params.id);
        
        if (!hero) {
            return res.status(404).json({ message: "Hall not found for deletion." });
        }
        
        res.status(200).json(hero);
    } catch (err) {
        console.error("Error deleting hall:", err);
        res.status(500).json(err);
    }
};

export const putHall = async (req, res) => {
    try {
        const id = req.params.id;
        const hero = await hallsModel.findByIdAndUpdate(id, req.body, { new: true });
        
        if (!hero) {
            return res.status(404).json({ message: "Hall not found for update." });
        }

        res.status(200).json(hero);
    } catch (err) {
        console.error("Error updating hall:", err);
        res.status(500).json(err);
    }
};