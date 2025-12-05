import Groomdress from "../model/groomdressModel.js"

export const getGroomdress = async (req, res) => {
    try {
        const groomdress = await Groomdress.find()
        res.status(200).json(groomdress)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const postGroomdress = async (req, res) => {
    const groomdress = new Groomdress({
        url: req.body.url,
        title: req.body.title,
        description: req.body.description,
        price: req.body.price
    })

    try {
        await groomdress.save()
        res.status(201).json(groomdress)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export const deleteGroomdress = async (req, res) => {
    try {
        const groomdress = await Groomdress.findByIdAndDelete(req.params.id)
        res.status(200).json(groomdress)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const putGroomdress = async (req, res) => {
    try {
        const groomdress = await Groomdress.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.status(200).json(groomdress)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}
