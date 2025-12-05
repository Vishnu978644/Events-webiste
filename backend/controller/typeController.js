import typeModel from "../model/typeModel.js";

export const getType = async (req, res) => {
  try {
    const type = await typeModel.find();
    res.status(200).json(type);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const postType = async (req, res) => {
  try {
    const { img, img1, title, details } = req.body;

    const newType = await typeModel.create({
      img,
      img1,
      title,
      details
    });

    res.status(201).json({
      message: "type added successfully",
      type: newType
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const typePut = async (req,res) =>{
  try{
    const id=req.params.id;
    const {img, img1, title, details} = req.body
    const type = await typeModel.findByIdAndUpdate(id, {img, img1, title, details}, {new: true})
    res.status(200).json(type)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const typeDelete=async (req,res)=>{
  try{
const id=req.params.id
const type=await typeModel.findByIdAndDelete(id)
res.status(200).json(type)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
