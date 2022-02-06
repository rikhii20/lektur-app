const { Question } = require("../models");
const errorHandler = require("../utils/errorHandler");
const joi = require('joi')

const AssignmentController = {

    createAssignment: async (req, res) => {
        const body = req.body
        try {
            const schema = joi.object({
                description: joi.string().required(),
                remark: joi.string().required(),
                correctAnswer: joi.string().required(),
                course_id: joi.number().required(),
            })
            const { error } = schema.validate({ ...body })
            if (error) {
                return res.status(400).json({
                    message: error.message,
                    status: "Bad Request",
                    result: {}
                })
            }
            const newQuestion = await Question.create({ ...body })
            if (!newQuestion) {
                return res.status(500).json({
                    message: error.message,
                    status: "internal Server error",
                    result: {}
                })
            }
            res.status(201).json({
                message: "Create Question Success",
                status: "OK Assemenst",
                result: newQuestion
            })
        } catch (error) {
            errorHandler(error, res);
        }
    },

    getAllAssignment: async (req, res) => {
        try {
            const getAllQuestion = await Question.findAll()
            if (getAllQuestion.length == 0) {
                res.status(404).json({
                    status: "Not Found",
                    message: "Data is Empty",
                    result: {}
                })
            }
            res.status(201).json({
                status: "successfully",
                message: "successfully Get Assemenst",
                result: getAllQuestion
            })
        } catch (error) {
            errorHandler(error, res);
        }
    },

    getAssignment: async (req, res) => {
        const { questionId } = req.params
        try {
            const getQuestion = await Question.findOne({
                where: { questionId },
                include: [
                    { model: Question }
                ]
            })
            if (!getQuestion.length == 0) {
                res.status(404).json({
                    status: "Not Found",
                    message: "Data is Empty",
                    result: {}
                })
            }
            res.status(201).json({
                status: "successfully",
                message: "successfully Get Assemenst",
                result: getQuestion
            })
        } catch (error) {
            errorHandler(error, res);
        }
    },

    updateAssignment: async (req, res) => {
        const body = req.body

        const {
            questionId
        } = req.params
        try {
            const schema = joi.object({
                description: joi.string().required(),
                remark: joi.string().required(),
                correctAnswer: joi.string().required(),
                course_id: joi.number().required(),
            })
            const { error } = schema.validate({ ...body })
            if (error) {
                return res.status(400).json({
                    message: error.message,
                    status: "Bad Request",
                    result: {}
                })
            }

            const checkUpdate = await Question.update(body, {
                where: {
                    id: questionId
                }
            })

            if (checkUpdate[0] != 1) {
                return res.status(500).json({
                    status: "Internal Server Error",
                    message: "Failed to Update event",
                    result: checkUpdate
                })
            }

            const updateQuestion = await Question.findByPk(questionId)
            res.status(201).json({
                status: "success",
                message: "success Update course",
                result: updateQuestion
            })

        } catch (error) {
            errorHandler(error, res);
        }
    }

}

module.exports = AssignmentController