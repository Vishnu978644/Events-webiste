import bridejewelModel from "../model/bridejewelModel.js";

// GET
export const getBridejewel = async (req, res) => {
    try {
        const bridejewel = await bridejewelModel.find();
        res.status(200).json(bridejewel);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// POST
export const postBridejewel = async (req, res) => {
    try {
        const { url, title, description, price } = req.body;

        const bridejewel = await bridejewelModel.create({
            url,
            title,
            description,
            price
        });

        res.status(200).json(bridejewel);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// PUT
export const putBridejewel = async (req, res) => {
    try {
        const id = req.params.id;

        const bridejewel = await bridejewelModel.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );

        res.status(200).json(bridejewel);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// DELETE
export const deleteBridejewel = async (req, res) => {
    try {
        const id = req.params.id;

        const bridejewel = await bridejewelModel.findByIdAndDelete(id);

        res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
