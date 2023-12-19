const User = require('../Models/User');
const bcrypt = require('bcrypt');
const {verify} = require('jsonwebtoken');
const crypto = require('crypto');
const {generateAccessToken, generateRefreshToken, verifyEmail} = require('../Auth/Auth');
const nodemailer = require('nodemailer');
const multer = require('multer');

const storage = multer.diskStorage({
    destination:'uploads',
    filename:(req, file, callback)=>{
        callback(null, Date.now() +"-"+ file.originalname);
    }
});

const upload = multer({
    storage,
}).single('file');

const signUp = async(req,res)=>{
    try {
        const {username, password, email, role, token,
            fullname, about, skills, interests, experience,
            linkedInLink, twitterLink
        
        } = req.body;
        const foundUser = await User.findOne({username});
        const foundEmail = await User.findOne({email});
        if(foundUser && foundEmail){
            res.json({msg:'The email and username belong to another account', user:''});
        }
        else if(foundUser){
            res.json({msg:'Username is already taken', user:''});
        }

        else if(foundEmail){
            res.json({msg:'The email belongs to another account', user:''})
        }
        const hash = await bcrypt.hash(password, 10);
        if(username && email && password ){
            const newUser = await User.create({
                username,
                email,
                role,
                token:crypto.randomBytes(16).toString('hex'),
                password:hash,
                fullname,
                about,
                skills, interests, experience, linkedInLink, twitterLink
            });

            const link = `${process.env.FRONT_END_URL}learners-corner/user/confirm/${newUser.token}`
            await verifyEmail(email, link);
            res.json({user:newUser, msg:'Email sent check your inbox or spam folder', token:newUser.token});

        }
        
    } catch (error) {
        console.log(error);
        
    }
}

const validateAccount = async(req, res)=>{
    try {
        const {token} = req.params;
        const foundUser = await User.findOne({token:token});
        if(foundUser){
            const updateUser = await User.findOneAndUpdate({token}, {
                verified:true,
                token:null
            }, {returnOriginal:false});

            res.json('Email Verified');

        }    
        else{
            res.json('Invalid Token');
        }    
    } catch (error) {
        res.status(400);
        console.log(error)
    }
}
 
const signIn = async(req, res)=>{
    try {
        const {email, password} = req.body;
        const foundUser = await User.findOne({email});
        if(!foundUser){
            res.json({msg:'You have typed the wrong email or password', user:'', token:''}).status(204);
        }

        const match = await bcrypt.compareSync(password, foundUser.password);

        if(!match){
            res.json({msg:'You have typed the wrong email or password', user:'', token:''});
        }
        else if(email && password){
            if(foundUser.verified){
                const accessToken = generateAccessToken(foundUser);
                const refreshToken = generateRefreshToken(foundUser);
        
                res.cookie('refresh-token', refreshToken, {httpOnly:true, maxAge:1000*60*60*24}).json({token:accessToken, msg:'Successfully signed in', user:foundUser});
            }
            else{
                res.json({msg:'Email sent please verify your account', token:'', foundUser:{}})
            }
           
        
        }

        
    } catch (error) {
        
    }
}
const updateUser = (req, res)=>{
    try {
        upload(req, res, async(error)=>{
            const {id}= req.params;
            const {
                password, username, email,
                about, interests, skills,
                experience, linkedInLink,
                twitterLink, whatsapp, fullname
            
            }= req.body;


            if(error){
                console.log(error);
            }

            const foundUser = await User.findOne({_id:id});
            const foundUsername =await User.find({username});

            console.log(foundUsername);
            if(!foundUser){
                res.json('User not found');
            }
           
            if(foundUsername.length && foundUsername.length !== 1){
                
                res.json('Username has been taken')
            }

          
            else{
                const updatedUser = await foundUser.updateOne({
                    username, about, interests, skills, experience,
                    linkedInLink, twitterLink, whatsapp,
                    password,
                    fullname,
                    profileImage:req.file?.path
                }, {returnOriginal:false});
    
                res.json(updatedUser);

            }
        

        })
        
    } catch (error) {
        console.log(error);
    }
}

const getUser = async(req, res)=>{
    try {
        const id = req.id;
        const foundUser = await User.findOne({_id:id});
        if(!foundUser){
            res.json('User not found').status(204);
        }
        res.json(foundUser)
        
    } catch (error) {
        console.log(error)
    }
}

const logOut = async(req, res)=>{
    try {
        const refreshToken = req.cookies['refresh-token'];
        if(!refreshToken){
            res.status(401);
        }

        verify(refreshToken, process.env.REFRESH_KEY, (error, decoded)=>{
            if(error){
                console.log(error);
                res.status(403);
            }

            else if(decoded){
                res.clearCookie('refresh-token',{maxAge:1000*60*60*24}).json('Logged out successfully');

            }
        })

        
    } catch (error) {
        console.log(error)
    }
}

const deleteUser = async(req, res)=>{
    try {
        const {id} = req.params;
        const foundUser = await User.findOne({_id:id});
        if(!foundUser){
            res.json('User not found');
        }

        await User.findOneAndDelete({_id:id});
        res.json('Your account was deleted successfully');

    } catch (error) {
        console.log(error);
    }
}


const getAllUsers = async(req, res)=>{
    try {
        const allUsers = await User.find();
        res.json(allUsers);
        
    } catch (error) {
        console.log(error);
    }
}

module.exports ={
    signIn,
    signUp,
    updateUser,
    getUser, 
    logOut,
    deleteUser,
    getAllUsers,
    validateAccount

}