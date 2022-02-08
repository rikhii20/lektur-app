const { Question } = require("../models");
const errorHandler = require("../utils/errorHandler");
const joi = require('joi')

const AssessmentController = {
    createAssessment: async (req, res) => {
        const body = req.body;
        try {
            const schema = joi.object({
                description: joi.string().required(),
                remark: joi.string().required(),
                correctAnswer: joi.string().required(),
                course_id: Joi.number().required(),
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
            const newQuestion = await Question.create({
                ...body,
            })
            if (!newQuestion) {
                return res.status(500).json({
                    message: error.message,
                    status: "internal Server error",
                    result: {}
                })
            }
            res.status(201).json({
                message: "Create Question Success",
                status: "OK Assemenst done Create",
                result: newQuestion
            })
        } catch (error) {
            errorHandler(error, res);
        }
    },

    getAllAssessment: async (req, res) => {
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
                message: "successfully Get Assemenst All",
                result: getAllQuestion
            })
        } catch (error) {
            errorHandler(error, res);
        }
    },

    getAssessment: async (req, res) => {
        const { id: id } = req.params;
        try {
            const getQuestion = await Question.findOne({
                // include: [
                //     {
                //         model: Answer,
                //         as: "multi Answer",
                //         attributes: [
                //             "description"
                //         ],
                //     },
                // ],
                where: {
                    id: id
                },

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
                message: "successfully Get Assemenst id",
                result: getQuestion
            })
        } catch (error) {
            errorHandler(error, res);
        }
    },

    updateAssessment: async (req, res) => {
        const body = req.body
        const {
            id: id
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
                    id: id
                }
            })

            if (checkUpdate[0] != 1) {
                return res.status(500).json({
                    status: "Internal Server Error",
                    message: "Failed to Update assessment",
                    result: checkUpdate
                })
            }

            const updateQuestion = await Question.findByPk(id)
            res.status(201).json({
                status: "success",
                message: "success Update assessment",
                result: updateQuestion
            })
        } catch (error) {
            errorHandler(error, res);
        }
    },

    deleteAssessment: async (req, res) => {
        const { id: id } = req.params;
        try {
            const deleteQouestion = await Question.destroy({
                where: { id: id }
            })

            if (!deleteQouestion) {
                return res.status(404).json({
                    status: "Not Found",
                    message: "Qouestion does not exist!",
                    result: {}
                })
            }

            res.status(200).json({
                status: "success",
                message: "succussfully deleted Question",
                result: deleteQouestion
            })
        } catch (error) {
            errorHandler(error, res);
        }
    },
}

module.exports = AssessmentController