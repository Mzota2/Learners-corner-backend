const {verify, sign, TokenExpiredError} = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const smtpTransport = require("nodemailer-smtp-transport");

const accessKey = process.env.ACCESS_KEY;
const refreshKey = process.env.REFRESH_KEY;

const generateAccessToken = (user)=>{
    return sign({id:user._id}, accessKey, {expiresIn:'60s'});

}

const generateRefreshToken = (user)=>{
    return sign({id:user._id}, refreshKey, {expiresIn:'1d'});
}

const verifyAccessToken = (req, res, next)=>{
    try {
        const accessToken = req.headers['authorization']?.split(' ')[1];
        if(!accessToken){
            res.status(401);
        }

        verify(accessToken, accessKey, (error, decoded)=>{
            if(error){
                console.log(error)
            }
            else if(decoded){
                req.id = decoded.id;
                next();
            }
        })


    } catch (error) {
        console.log(error)

        res.json('something went wrong').status(400);
    }
}







const verifyEmail = async(email, link)=>{
    try {
        let transporter = nodemailer.createTransport(
            smtpTransport({
              service: "gmail",
              host: "smtp.gmail.com",
              port: 587,
              secure: false,
              auth: {
                user: process.env.USER,
                pass:process.env.PASSWORD,
              },
            })
          );

        //send mail
        let info = await transporter.sendMail({
            from:process.env.USER,
            to:email,
            subject:'Account Verification',
            text:'Welcome',
            html:`
                <div>
                    <a href=${link}>Click here to activate your account </a>
                </div>
            `

        });
        console.log('mail send successfully');
        
    }catch (error) {
        console.log(error)
    }
}

const refreshToken = (req, res)=>{
    const refreshToken = req.cookies['refresh-token'];
    if(!refreshToken){
        res.status(401);
    }

    verify(refreshToken, refreshKey, (error, decoded)=>{
        if(error){
            res.status(403);
        }

        const accessToken = sign({id:decoded.id}, accessKey, {expiresIn:'60s'});
        res.json(accessToken);

    })
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    refreshToken,
    verifyEmail
}