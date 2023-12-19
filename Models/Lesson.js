const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lessonSchema = new Schema({

    title:{
        type:String,
        required:true,
    },

    subTitle:{
        type:String,
    },
    backgroundImage:{
        type:String,
    },

    contents:{
        type:String,
    },

    userId:{
        type:String,
        required:true
    },

    subjectId:{
        type:String,
        required:true
    }

},
{timestamps:true});


const lessonModel = mongoose.model('lesson', lessonSchema);

module.exports = lessonModel;