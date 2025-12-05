import Bridemakeup from '../model/bridemakeupModel.js'

// GET all bridal makeup entries (READ)
export const getBridemakeup = async (req, res) => {
    try {
        const bridemakeup = await Bridemakeup.find()
        res.status(200).json(bridemakeup)
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching makeup entries.' }) // Use 500 for server/DB errors
    }
}

// POST a new bridal makeup entry (CREATE)
export const postBridemakeup = async (req, res) => {
    const newBridemakeup = new Bridemakeup(req.body)

    try {
        await newBridemakeup.save()
        // Success code for creation
        res.status(201).json(newBridemakeup) 
    } catch (error) {
        // Use 400 for validation errors or 500 for general server errors
        res.status(400).json({ message: 'Validation failed or entry already exists.' }) 
    }
}

// DELETE a bridal makeup entry
export const deleteBridemakeup = async (req, res) => {
    const { id } = req.params // Destructure ID for clarity

    try {
        // findByIdAndDelete is preferred over findByIdAndRemove (does not run pre-remove hooks)
        const deletedItem = await Bridemakeup.findByIdAndDelete(id) 
        
        if (!deletedItem) {
            return res.status(404).json({ message: 'Bridemakeup entry not found.' })
        }
        
        res.status(200).json({ message: 'Bridemakeup deleted successfully', deletedId: id })
    } catch (error) {
        // Use 400 for invalid ID format or 500 for server error
        res.status(400).json({ message: error.message }) 
    }
}

// PUT / PATCH an existing bridal makeup entry (UPDATE)
export const putBridemakeup = async (req, res) => {
    const { id } = req.params
    const updateData = req.body // Contains fields like url, title, description, price

    try {
        // Use findByIdAndUpdate to perform a single update query efficiently
        const updatedBridemakeup = await Bridemakeup.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true } // 'new: true' returns the updated document
        );

        if (!updatedBridemakeup) {
            return res.status(404).json({ message: 'Bridemakeup entry not found.' })
        }

        res.status(200).json(updatedBridemakeup)
    } catch (error) {
        // Catch validation errors (400) or general server errors (500)
        res.status(400).json({ message: error.message }) 
    }
}