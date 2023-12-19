const Quiz = require('../Models/Quiz');

const createQuiz = async(req, res)=>{
    try {
        const {question, choices, userId, subjectId} = req.body;
        if(! question && userId && choices && subjectId){
            res.json('Fill all required fields');
        }
        const newQuiz = await Quiz.create({
            question,
            choices,
            userId,
            subjectId
        });

        res.json(newQuiz);
        
    } catch (error) {
        console.log(error);
    }
}

const updateQuiz = async(req, res)=>{
    try {
        const {question, choices, userId, subjectId} = req.body;
        const {id} = req.params;

        const foundQuiz = await Quiz.findOneAndUpdate({_id:id}, {
            question,
            choices,
            userId,
            subjectId,
        }, {returnOriginal:false});

        if (!foundQuiz){
            res.json('Quiz not found').status(204);
        }

        res.json(foundQuiz)

        
    } catch (error) {
        console.log(error);
    }
}


const deleteQuiz = async(req, res)=>{
    try {
        const {id} = req.params;
        const foundQuiz = await Quiz.findOneAndDelete({_id:id});
        if(!foundQuiz){
            res.json('Quiz not found').status(204);
        }
        res.json(foundQuiz);

    
    } catch (error) {
        console.log(error);
        
    }
}

const getAllQuizzes = async(req, res)=>{
    try {
        const allQuiz = await Quiz.find();
        res.json(allQuiz);
    } catch (error) {
        console.log(error);
    }
}

const getQuiz = async(req, res)=>{
    try {
        const {id} = req.params;
        const foundQuiz = await Quiz.findOne({_id:id});
        if(!foundQuiz){
            res.json('Quiz not found').status(204);
        }

        res.json(foundQuiz);
        
    } catch (error) {
        console.log(error);
    }
}

module.exports ={
    createQuiz,
    updateQuiz,
    deleteQuiz,
    getAllQuizzes,
    getQuiz
}