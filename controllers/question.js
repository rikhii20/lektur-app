const { Question} = require("../models")
const errorHandler = require("../utils/errorHandler")

module.exports = {
    addQuestion : async (req, res) =>{
        try {
            const body = req.body
            const data = await Question.create(
                {
                description: body.description,
                correctAnswer : body.correctAnswer,
                remark : body.remark,
                course_id : body.course_id
                },
            );
            res.status(200).json({
                status : "Success",
                message : "Successfully created question",
                result : data
            })
            
        } catch (error) {
            errorHandler(error, res)
        }
    },
    getQuestions : async (req,res) => {
        try {
            const id = req.params.id
            const dataQuestions = await Question.findAll({
                where : {course_id : id}
            });
            res.status(200).json({
                status : "Success",
                message : "Successfully get Questions",
                result : dataQuestions
            })

        } catch (error) {
            errorHandler(error,res) 
        }
    }
}