import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  
    firstName: {
        type: String,
        required: true,
      
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true,
       
    },
    emailAddress: {
        type: String,
        required: true,
        
    },
    
   
    subjectLine: {
        type: String,
        required: true,
       
    },
    messageBody: {
        type: String,
        required: true
    },

   isRead: {
        type: Boolean,
        required: true, 
        default: false // <-- Mongoose automatically applies this default
    },
    dateSent: {
        type: Date,
        required: true,
        default: Date.now // <-- Mongoose automatically applies the current date/time
    }
}, {
  
});


export default mongoose.model('Contact', contactSchema);
