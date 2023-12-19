const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quizSchema = new Schema ({
    
    question:{
        type:String,
        required:true
    },

    choices:{
        type:Array,
        required:true,
        default:[
            {answer:'', correct:false},
            {answer:'', correct:false},
            {answer:'', correct:false},
            {answer:'', correct:true}
        ]
    },

    subjectId:{
        type:String,
        required:true
    },

    userId:{
        type:String,
        required:true
    }

},
{timestamps:true});

const quizModel = mongoose.model('quizze', quizSchema);
module.exports = quizModel;