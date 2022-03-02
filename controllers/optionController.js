const { Option } = require("../models");
const errorHandler = require("../utils/errorHandler");
const joi = require("joi");

const OptionController = {
    updateOption: async (req, res) => {
        const body = req.body;
        const { optionId } = req.query;
        try {
            const schema = joi.object({
                question_id: joi.number(),
                option: joi.string(),
                isTrue: joi.boolean(),
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
                        id: optionId
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
            const updateOption = await Option.findOne({
                where: {
                    id: optionId
                }
            });
            res.status(201).json({
                status: "success",
                message: "success Update assessment",
                result: updateOption,
            });
        } catch (error) {
            errorHandler(error, res);
        }
    },
}

module.exports = OptionController;