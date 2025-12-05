import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema({
  img: {
    type: String,
    required: true
  },
   collectionList: {
    type: [String], // an array of image URLs/paths
    required: true
  }
});

export default mongoose.model("Gallery", gallerySchema);
