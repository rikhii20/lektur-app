const { Question } = require("../models");
const errorHandler = require("../utils/errorHandler");
const joi = require("joi");

const QuestionController = {
    updateQuestion: async (req, res) => {
        const body = req.body;
        const { questionId } = req.query;
        try {
            const schema = joi.object({
                question: joi.string(),
                remark: joi.string(),
                assessment_id: joi.number(),
            });
            const { error } = schema.validate({ ...body });
            if (error) {
                return res.status(400).json({
                    message: error.message,
                    status: "Bad Request",
                    result: {},
                });
            }
            const checkUpdate = await Question.update(
                { ...body },
                {
                    where: {
                        id: questionId
                    },
                },
            );
            if (checkUpdate[0] != 1) {
                return res.status(500).json({
                    status: "Internal Server Error",
                    message: "Failed to Update assessment",
                    result: {},
                });
            }
            const updateQuestion = await Question.findOne({
                where: {
                    id: questionId
                }
            });
            res.status(201).json({
                status: "success",
                message: "success Update assessment",
                result: updateQuestion,
            });
        } catch (error) {
            errorHandler(error, res);
        }
    },
}

module.exports = QuestionController;