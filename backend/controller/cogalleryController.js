import CoGallery from "../model/cogalleryModel.js";

export const getCoGallery = async (req, res) => {
  try {
    const coGallery = await CoGallery.find();
    res.status(200).json(coGallery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const postCoGallery = async (req, res) => {
  try {
    const coGallery = new CoGallery(req.body);
    await coGallery.save();
    res.status(201).json(coGallery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCoGallery = async (req, res) => {
  try {
    const coGallery = await CoGallery.findByIdAndDelete(req.params.id);
    res.status(200).json(coGallery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const putCoGallery = async (req, res) => {
  try {
    const coGallery = await CoGallery.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(coGallery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
