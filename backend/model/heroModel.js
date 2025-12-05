import mongoose from 'mongoose';

const heroSchema = new mongoose.Schema({
  url: {  // instead of img
    type: String,
    required: true
  },
  title: {  // instead of name
    type: String,
    required: true
  }
});

export default mongoose.model('Hero', heroSchema);
