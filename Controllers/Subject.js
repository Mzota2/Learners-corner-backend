const Subject = require('../Models/Subject');
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


const createSubject = (req, res)=>{
    try {
        upload(req, res, async(error)=>{
            const {title, description, userId, form} = req.body;
            const foundSubject = await Subject.findOne({title});
            if(error){
                console.log(error);
                res.status(400);
            }
            else if(foundSubject){
                res.json('Subject already exists')
            }

            else{const newSubject = await Subject.create({
                title,
                userId,
                description,
                form,
                subjectImage:req.file?.path || ''
            });

            res.json(newSubject);}
        })
    } catch (error) {
        
    }
}

const verifyUser = (userId, subject, message, res)=>{
    if(userId !==subject.userId){
        res.json(message).status(403);
        return false;
    }

    return true
}

const updateSubject = (req,res)=>{
    try {
        upload(req,res, async(error)=>{
            const {title, description, userId, form} = req.body;
            const {id} = req.params;

            if(error){
                console.log(error)
            }

            const foundSubject = await Subject.findOne({_id:id});

            if(!foundSubject){
                res.json('Subject not found').status(204);
            }

            //proof of ownership
            const isVerified = verifyUser(userId, foundSubject, 'You are not allowed to update this subject', res);

            if(isVerified){
                const sub = await foundSubject.updateOne({
                    title,
                    description,
                    form,
                    subjectImage:req.file?.path 
                }, {returnOriginal:false});
    
                res.json(sub);
    
            }
        })
        
    } catch (error) {
        console.log(error)
    }
}


const deleteSubject = async(req, res)=>{
    try {
        const{id} = req.params;
        const {userId} = req.body;
        const foundSubject = await Subject.findOne({_id:id});

        if(!foundSubject){
            res.json('Subject not found').status(204);
        }

        const isVerified = verifyUser(userId, foundSubject, 'You are not allowed to delete this subject', res);
        if(isVerified){
            const delSub = await foundSubject.deleteOne();
            res.json('deleted successfully')
        }

    } catch (error) {
        
    }
}


const getAllSubjects = async(req, res)=>{
    try {
        const allSub = await Subject.find();
        if(!allSub.length){
            res.json('No subjects found');
        }
        res.json(allSub);
        
    } catch (error) {
        console.log(error)
    }
}


const getSubject = async(req, res)=>{
    try {

        const{id} = req.params;
        const foundSubject = await Subject.findOne({_id:id});
        if(!foundSubject){
            res.json('Subject not found');
        }

        res.json(foundSubject);
        
    } catch (error) {
        console.log(error);
    }
}

module.exports ={
    createSubject,
    updateSubject,
    deleteSubject,
    getAllSubjects,
    getSubject
}