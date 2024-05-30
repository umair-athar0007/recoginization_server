let mongoose = require('mongoose');


let faceSchema = mongoose.Schema({
    
    password: {
        type: String, trim: true, required: true
    },
    faceImageUrl :{
        type: String, trim: true, required: true
    },

}, { timestamps: true });




module.exports = mongoose.model('Face', faceSchema);




