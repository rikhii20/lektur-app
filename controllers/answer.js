const { Answer } = require("../models");
const errorHandler = require("../utils/errorHandler");
const joi = require('joi')

const AnswerController = {
    addAnswer: async (req, res) => {
        const body = req.body;
        try {
            const schema = joi.object({
                description: joi.string().required(),
                question_id: joi.string().required(),
            })
            const { error } = schema.validate({
                ...body,
            })
            if (error) {
                return res.status(400).json({
                    message: error.message,
                    status: "Bad Request",
                    result: {}
                })
            }
            const newAnswer = await Answer.create({
                ...body,
            })
            if (!newAnswer) {
                return res.status(500).json({
                    message: error.message,
                    status: "internal Server error",
                    result: {}
                })
            }
            res.status(201).json({
                message: "Create Question Success",
                status: "OK Assemenst done Create",
                result: newAnswer
            })
        } catch (error) {
            errorHandler(error, res);
        }
    },

    getAnswer: async (req, res) => {
        try {
            const showAnswer = await Answer.findAll()
            if (!showAnswer.length == 0) {
                res.status(404).json({
                    status: "Not Found",
                    message: "Data is Empty",
                    result: {}
                })
            }
            res.status(201).json({
                status: "successfully",
                message: "successfully Get Answer id",
                result: showAnswer
            })
        } catch (error) {
            errorHandler(error, res);
        }
    }
}

module.exports = AnswerController