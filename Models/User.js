const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fullname:{
        type:String,
        required:true

    },
    username:{
        type:String,
        unique:true,
        required:true
    },

    password:{
        required:true,
        type:String

    },

    email:{
        required:true,
        type:String,
        unique:true
    },

    verified:{
        type:Boolean,
        default:false
    },

    token:{
        type:String,
        required:true
    },

    //1999 for normal users, //2000 for tutors // 2001 for premium users

    role:{
        type:String,
        required:true,
    },

    about:{
        type:String
    },

    interests:{
        type:String
    },

    skills:{
        type:String
    },

    experience:{
        type:String
    },

    linkedInLink:{
        type:String,
    },

    twitterLink:{
        type:String
    },

    whatsapp:{
        type:String
    },

    joinedCommunity:{
        type:Boolean,
        default:false
    },

    profileImage:{
        type:String,
        default:''
    }
},

{
    timestamps:true
}

)

const userModel = mongoose.model('user', userSchema);
module.exports = userModel;


