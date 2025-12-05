import galleryModel from "../model/galleryModel.js";

export const galleryGet = async (req, res) => {
  try {
    const gallery = await galleryModel.find();
    res.status(200).json(gallery);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const galleryPost = async (req, res) => {
  try {
    const { img, collection, category } = req.body; // FIXED

    const newGallery = await galleryModel.create({
      img,
      collection,
     
    });

    res.status(201).json({
      message: "Gallery added successfully",
      gallery: newGallery, // FIXED
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const galleryDelete = async (req, res) => {
  try {
const id=req.params.id
const gallery=await galleryModel.findByIdAndDelete(id)
res.status(200).json(gallery)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const galleryPut = async (req, res) => {
  try {
const id=req.params.id
const gallery=await galleryModel.findByIdAndUpdate(id,req.body)
res.status(200).json(gallery)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
