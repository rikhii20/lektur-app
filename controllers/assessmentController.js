const { Assessment, Question, Option, Course, User } = require("../models");
const errorHandler = require("../utils/errorHandler");
const joi = require("joi");

const AssessmentController = {
  createAssessment: async (req, res) => {
    const { courseId } = req.query;
    const body = req.body;
    try {
      const schema = joi.object({
        course_id: joi.number().required(),
      });
      const { error } = schema.validate({
        course_id: courseId,
      });
      if (error) {
        return res.status(400).json({
          message: error.message,
          status: "Bad Request",
          result: {},
        });
      }
      const newAssessment = await Assessment.create({
        course_id: courseId,
      });
      if (!newAssessment) {
        return res.status(500).json({
          message: error.message,
          status: "internal Server error",
          result: {},
        });
      }
      for await (const quest of body) {
        const getAssessmentId = await Assessment.findAll();
        await Question.create({
          assessment_id:
            getAssessmentId[getAssessmentId.length - 1].dataValues.id,
          question: quest.question,
          remarks: quest.remarks,
        });
        const getQuestionId = await Question.findAll();
        for await (const option of quest.options) {
          await Option.create({
            question_id: getQuestionId[getQuestionId.length - 1].dataValues.id,
            option: option,
            isTrue: false,
          });
        }
      }
      res.status(201).json({
        message: "Create Assessment Success",
        status: "OK Assemenst done Create",
        result: newAssessment,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
  getAssessment: async (req, res) => {
    const { courseId } = req.query;
    try {
      const getAssessment = await Course.findOne({
        where: { id: courseId },
        include: [
          {
            model: Assessment,
            as: "assessment",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
            include: [
              {
                model: Question,
                as: "questions",
                attributes: {
                  exclude: ["createdAt", "updatedAt", "remarks"],
                },
                include: [
                  {
                    model: Option,
                    as: "options",
                    attributes: {
                      exclude: ["createdAt", "updatedAt", "isTrue"],
                    },
                  },
                ],
              },
            ],
          },
        ],
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      if (!getAssessment) {
        return res.status(404).json({
          status: "Not Found",
          message: `Can't find the course with id ${courseId}`,
          result: {},
        });
      }
      res.status(200).json({
        status: "success",
        message: "successfully retrieved Assessment",
        result: getAssessment,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
  getAssessmentKey: async (req, res) => {
    const { courseId } = req.query;
    try {
      const getAssessment = await Course.findOne({
        where: { id: courseId },
        include: [
          {
            model: User,
            as: "by",
            attributes: ["id", "fullName"],
          },
          {
            model: Assessment,
            as: "assessment",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
            include: [
              {
                model: Question,
                as: "questions",
                attributes: {
                  exclude: ["createdAt", "updatedAt"],
                },
                include: [
                  {
                    model: Option,
                    as: "options",
                    attributes: {
                      exclude: ["createdAt", "updatedAt"],
                    },
                  },
                ],
              },
            ],
          },
        ],
        attributes: {
          exclude: ["createdAt", "updatedAt", "user_id"],
        },
      });
      if (!getAssessment) {
        return res.status(404).json({
          status: "Not Found",
          message: `Can't find the course with id ${courseId}`,
          result: {},
        });
      }
      res.status(200).json({
        status: "success",
        message: "successfully retrieved Assessment",
        result: getAssessment,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
  updateQuestion: async (req, res) => {
    const body = req.body;
    const { questionId } = req.query;
    try {
      const schema = joi.object({
        question: joi.string(),
        remarks: joi.string(),
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
            id: questionId,
          },
        },
      );
      console.log(checkUpdate);
      if (checkUpdate[0] != 1) {
        return res.status(500).json({
          status: "Internal Server Error",
          message: "Failed to Update assessment",
          result: {},
        });
      }
      const updateQuestion = await Question.findOne({
        where: {
          id: questionId,
        },
      });
      res.status(200).json({
        status: "success",
        message: "success Update assessment",
        result: updateQuestion,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
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
      const checkUpdate = await Option.update(
        { ...body },
        {
          where: {
            id: optionId,
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
          id: optionId,
        },
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
  deleteAssessment: async (req, res) => {
    const { question_id } = req.params;
    try {
      const deleteAssessment = await Assessment.destroy({
        where: { question_id },
      });
      if (!deleteAssessment) {
        return res.status(404).json({
          status: "Not Found",
          message: "Assessment does not exist!",
          result: {},
        });
      }

      res.status(200).json({
        status: "success",
        message: "succussfully deleted Assessment",
        result: {},
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
};
module.exports = AssessmentController;
