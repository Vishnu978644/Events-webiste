import transportModel from "../model/transportModel.js"

// READ ALL (GET)
export const getTransport = async (req, res) => {
    try {
        const transport = await transportModel.find()
        res.status(200).json(transport)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}



// CREATE (POST)
export const postTransport = async (req, res) => {
  const transport = new transportModel({
    url: req.body.url,
    title: req.body.title,
    description: req.body.description,
    price: req.body.price
  });

  try {
    await transport.save();
    res.status(201).json(transport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// UPDATE (PUT/PATCH)
export const putTransport = async (req, res) => {
  try {
    const transport = await transportModel.findByIdAndUpdate(
      req.params.id,
      {
        url: req.body.url,
        title: req.body.title,
        description: req.body.description,
        price: req.body.price
      },
      { new: true }
    );

    if (!transport) return res.status(404).json({ message: "Not found" });
    res.status(200).json(transport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// DELETE (DELETE)
export const deleteTransport = async (req, res) => {
    try {
        const transport = await transportModel.findByIdAndDelete(req.params.id)
        if (transport == null) {
            return res.status(404).json({ message: "Cannot find transport record to delete" });
        }
        res.status(200).json({ message: "Transport record deleted successfully", deletedDocument: transport })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}