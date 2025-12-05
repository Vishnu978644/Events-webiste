import mongoose from "mongoose";

const recentSchema = new mongoose.Schema({
  url: String,
  head: String,
  desc: String,
  date: String,
  location: String
});

export default mongoose.model("Recent", recentSchema);
