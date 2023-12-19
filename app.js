const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv').config();
const lessonRoutes = require('./Routes/Lesson');
const quizRoutes = require('./Routes/Quiz');
const subjectRoutes = require('./Routes/Subject');
const userRoutes = require('./Routes/User');
const {refreshToken} = require('./Auth/Auth');
const path = require('path');

//db
const mongoose = require('mongoose');

//middleware
app.use(cors({
    origin:['http://localhost:3000'],
    credentials:true,
}));

app.use(express.static('./Public'));
app.use(express.json());
app.use(cookieParser());

//images
app.get('/learners-corner/uploads/:filename',(req, res)=>{
    const {filename} = req.params;
    res.sendFile(path.resolve(`uploads/${filename}`));
});

//routes
app.use('/learners-corner', lessonRoutes);
app.use('/learners-corner', quizRoutes);
app.use('/learners-corner', subjectRoutes);

app.get('/learners-corner/refresh', refreshToken);

app.use('/learners-corner', userRoutes);
//DB

const connectDB = async()=>{
    const port = process.env.PORT || 2000;
    try {
        const db = await mongoose.connect(process.env.MONGODB_URL, {});
        
        app.listen(port, ()=>{
            console.log(`Connected to MongoDB successfully`);
            console.log(`App running on port ${port}`)
        })
    } catch (error) {
        console.error(error);
    }
}

connectDB();

