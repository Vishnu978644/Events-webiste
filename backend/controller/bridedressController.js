import Bridedress from "../model/bridedressModel.js"

export const getBridedress = async (req, res) => {
    try {
        const bridedress = await Bridedress.find()
        res.status(200).json(bridedress)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const postBridedress = async (req, res) => {
    const bridedress = new Bridedress({
        url: req.body.url,
        title: req.body.title,
        description: req.body.description,
        price: req.body.price
    })

    try {
        await bridedress.save()
        res.status(201).json(bridedress)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export const deleteBridedress = async (req, res) => {
    try {
        const bridedress = await Bridedress.findByIdAndDelete(req.params.id)
        res.status(200).json(bridedress)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const putBridedress = async (req, res) => {
    try {
        const bridedress = await Bridedress.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.status(200).json(bridedress)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}
