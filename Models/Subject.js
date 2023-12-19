const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subjectSchema = new Schema({
    
    title:{
        type:String,
        required:true,
        unique:true
    },
    subTitle:{
        type:String,

    },
    form:{
        type:String,
        required:true
    },
    
    description:{
        type:String,
        required:true
    },
    subjectImage:{
        type:String,
        required:true,
    },
    userId:{
        type:String,
        required:true
    },
}, 
{
    timestamps:true
});



const subjectModel = mongoose.model('subject', subjectSchema);
module.exports = subjectModel;
