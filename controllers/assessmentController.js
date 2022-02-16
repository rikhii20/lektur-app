const { Question, Answer } = require("../models");
const errorHandler = require("../utils/errorHandler");
const joi = require("joi");

const AssessmentController = {
  createAssessment: async (req, res) => {
    const body = req.body;
    try {
      const schema = joi.object({
        description: joi.string().required(),
        remark: joi.string().required(),
        correctAnswer: joi.string().required(),
        course_id: joi.number().required(),
      });
      const { error } = schema.validate({
        ...body,
        course_id: req.course.id,
      });
      if (error) {
        return res.status(400).json({
          message: error.message,
          status: "Bad Request",
          result: {},
        });
      }
      const newQuestion = await Question.create({
        ...body,
        course_id: req.course.id,
      });
      if (!newQuestion) {
        return res.status(500).json({
          message: error.message,
          status: "internal Server error",
          result: newQuestion,
        });
      }
      res.status(201).json({
        message: "Create Question Success",
        status: "OK Assemenst done Create",
        result: newQuestion,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
  getAllAssessment: async (req, res) => {
    try {
      const getAllQuestion = await Question.findAll({
        order: [["createdAt", "ASC"]],
        attributes: { exclude: ["createdAt", "updateAt", "value"] },
        include: [
          {
            model: Answer,
            as: "answer",
            attributes: ["description"],
          },
        ],
      });
      if (!getAllQuestion.length) {
        res.status(404).json({
          status: "Not Found",
          message: "Data is Empty",
          result: getAllQuestion,
        });
      }
      res.status(201).json({
        status: "successfully",
        message: "successfully Get Assemenst All",
        result: getAllQuestion,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
  getAssessment: async (req, res) => {
    const { question_id } = req.query;
    try {
      const getQuestion = await Question.findOne({
        include: [
          {
            model: Answer,
            as: "answer",
            attributes: ["id", "question_id", "description", "value"],
          },
        ],
        where: { question_id },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      if (!getQuestion.length) {
        res.status(404).json({
          status: "Not Found",
          message: "Data is Empty",
          result: getQuestion,
        });
      }
      res.status(201).json({
        status: "successfully",
        message: "successfully Get Assessment id",
        result: getQuestion,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
  updateAssessment: async (req, res) => {
    const body = req.body;
    const { question_id } = req.query;
    try {
      const schema = joi.object({
        description: joi.string().required(),
        remark: joi.string().required(),
        correctAnswer: joi.string().required(),
        course_id: joi.number().required(),
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
            question_id,
          },
        },
      );
      if (!checkUpdate[0]) {
        return res.status(500).json({
          status: "Internal Server Error",
          message: "Failed to Update assessment",
          result: checkUpdate,
        });
      }
      const updateQuestion = await Question.findByPk(question_id);
      res.status(201).json({
        status: "success",
        message: "success Update assessment",
        result: updateQuestion,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
  deleteAssessment: async (req, res) => {
    const { question_id } = req.query;
    try {
      const deleteQuestion = await Question.destroy({
        where: { question_id },
      });
      if (!deleteQuestion) {
        return res.status(404).json({
          status: "Not Found",
          message: "Qouestion does not exist!",
          result: deleteQuestion,
        });
      }
      res.status(200).json({
        status: "success",
        message: "succussfully deleted Question",
        result: deleteQuestion,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
  deleteAnswer: async (req, res) => {
    const { answer_id } = req.query;
    try {
      const deleteAnswer = await Question.destroy({
        where: { answer_id },
      });
      if (!deleteAnswer) {
        return res.status(404).json({
          status: "Not Found",
          message: "Answer does not exist!",
          result: deleteAnswer,
        });
      }
      res.status(200).json({
        status: "success",
        message: "succussfully deleted Answer",
        result: deleteAnswer,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
  createAnswer: async (req, res) => {
    const body = req.body;
    try {
      const schema = joi.object({
        description: joi.string().required(),
        question_id: joi.string().required(),
        value: joi.number().required(),
      });
      const { error } = schema.validate({
        ...body,
        question_id: req.question.id,
      });
      if (error) {
        return res.status(400).json({
          message: error.message,
          status: "Bad Request",
          result: {},
        });
      }
      const newAnswer = await Answer.create({
        ...body,
        question_id: req.question.id,
      });
      if (!newAnswer) {
        return res.status(400).json({
          message: error.message,
          status: "internal Server error",
          result: newAnswer,
        });
      }
      res.status(201).json({
        message: "Create Question Success",
        status: "OK Answer done Create",
        result: newAnswer,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
};

module.exports = AssessmentController;
