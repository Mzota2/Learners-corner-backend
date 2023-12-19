const Lesson = require('../Models/Lesson');
const multer = require('multer');


//multer storage

const storage = multer.diskStorage({
    destination:'uploads',
    filename:(req, file, callback)=>{
        callback(null, Date.now() +'-'+file.originalname);
    }
});

const upload = multer({
    storage,
}).single('file');


const createLesson = async(req, res)=>{
    try {
        
        upload(req, res, async(error)=>{
            const{title, contents, subjectId, backgroundImage, userId, subTitle} = req.body;
            if(error){
                console.log(error)
                
            }

            else if(! title && content && subjectId && backgroundImage){
                res.json('Fill all required fields');
            }

            else{
                const newLesson = await Lesson.create({
                title,
                contents,
                subTitle,
                subjectId,
                userId,
                backgroundImage:req.file?.path
            });

            res.json(newLesson);
        }
        })

    
        
    } catch (error) {
        console.log(error);
    }
}


const deleteLesson = async(req, res)=>{
    try {
        const {id} = req.params;
        const foundLesson = await Lesson.findOneAndDelete({_id:id});
        if (!foundLesson){
            res.json('lesson not found').status(404);
        }
        res.json(foundLesson);
        
    } catch (error) {
        
    }
}


const updateLesson = async(req, res)=>{

    try {
        upload(req, res, async(error)=>{
            if(error){
                console.log(error);
                res.status(400);
            }
            const {id} = req.params;
            const {title, contents, backgroundImage, userId, subjectId, subTitle} = req.body;

            const foundLesson = await Lesson.findOneAndUpdate({_id:id}, {
                
                title,
                contents,
                subTitle,
                backgroundImage:req.file?.path,
                subjectId,
                userId
            }, {returnOriginal:false});

            res.json(foundLesson)
        })
        
    } catch (error) {
        console.log(error);
        
    }
}


const getAllLessons = async(req, res)=>{
    try {

        const allLessons = await Lesson.find();
        if(allLessons.length){
            res.json(allLessons);
        }

        else{
            json('No lessons');
        }
        
    } catch (error) {
        console.log(error);
    }
}

const getLesson = async(req, res)=>{
    try {
        const {id} = req.params;
        const foundLesson = await Lesson.findOne({_id:id});
        if(!foundLesson){
            res.json('Lesson not found').status(204);
        }

        res.json(foundLesson);
        
    } catch (error) {
        console.log(error);
    }
}


module.exports ={
    createLesson,
    updateLesson,
    deleteLesson,
    getAllLessons,
    getLesson
}