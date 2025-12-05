import recentModel from "../model/recentModel.js";

export const getRecent = async (req, res) => {
  try {
    const recent = await recentModel.find();
    res.status(200).json(recent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const postRecent = async (req, res) => {
  try {
    const { url, head, desc, date, location } = req.body;

    const recent = await recentModel.create({
      url,
      head,
      desc,
      date,
      location
    });

    res.status(201).json(recent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteRecent = async (req, res) => {
  try {
    const { id } = req.params;
    await recentModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const putRecent = async (req, res) => {
  try {
    const { id } = req.params;
    const { url, head, desc, date, location } = req.body;

    const recent = await recentModel.findByIdAndUpdate(
      id,
      { url, head, desc, date, location },
      { new: true }
    );

    res.status(200).json(recent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
