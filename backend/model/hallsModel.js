import mongoose from "mongoose"

const hallSchema=new mongoose.Schema({
    title: {
    type: String, 
    required: [true],
  
  },
  
  price: {
    type: String, 
    required: [true]
  },
  description: {
    type: String,
    required: [true ],
    
  },

  mainImageUrl: {
    type: String,
    required: [true]
  },
  
  thumbnailUrls: {
    type: [String],
    required: [true],
    
  },
});

export default mongoose.model("Hall",hallSchema)