import bridejewel1Model from "../model/bridejewel1Model.js";

// GET
export const getBridejewel1 = async (req, res) => {
    try {
        const bridejewel1 = await bridejewel1Model.find();
        res.status(200).json(bridejewel1);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// POST
export const postBridejewel1 = async (req, res) => {
    try {
        const { url, title, description, price } = req.body;

        const bridejewel1 = await bridejewel1Model.create({
            url,
            title,
            description,
            price
        });

        res.status(200).json(bridejewel1);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// PUT
export const putBridejewel1 = async (req, res) => {
    try {
        const id = req.params.id;

        const bridejewel1 = await bridejewel1Model.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );

        res.status(200).json(bridejewel1);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// DELETE
export const deleteBridejewel1 = async (req, res) => {
    try {
        const id = req.params.id;

        const bridejewel1 = await bridejewel1Model.findByIdAndDelete(id);

        res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
