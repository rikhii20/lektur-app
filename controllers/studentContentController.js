const Joi = require("joi");
const errorHandler = require("../utils/errorHandler");
const { StudentContent, Content, StudentCourse } = require("../models");

module.exports = {
  createStudentProgress: async (req, res) => {
    const { user } = req;
    const { courseId, contentId } = req.query;
    try {
      const schema = Joi.object({
        student_id: Joi.number().required(),
        course_id: Joi.number().required(),
        content_id: Joi.number().required(),
      });
      const { error } = schema.validate({
        student_id: user.id,
        course_id: courseId,
        content_id: contentId,
      });
      if (error) {
        return res.status(400).json({
          status: "Bad Request",
          message: error.message,
          result: {},
        });
      }
      if (user.role == "teacher") {
        return res.status(401).json({
          status: "Bad Request",
          message: "Only for student",
          result: {},
        });
      }
      const checkContent = await Content.findOne({
        where: {
          course_id: courseId,
          id: contentId,
        },
      });
      if (!checkContent) {
        return res.status(404).json({
          status: "Bad Request",
          message: `Can't find content with id ${contentId} in the course`,
          result: {},
        });
      }
      const checkUser = await StudentCourse.findOne({
        where: {
          student_id: user.id,
          course_id: courseId,
        },
      });
      if (!checkUser) {
        return res.status(404).json({
          status: "Bad Request",
          message: `User haven't enroll the course`,
          result: {},
        });
      }
      const checkStatus = await StudentContent.findOne({
        where: {
          course_id: courseId,
          content_id: contentId,
        },
      });
      if (checkStatus) {
        return res.status(500).json({
          status: "Internal Server Error",
          message: `You have open this content`,
          result: {},
        });
      }
      const progress = await StudentContent.create({
        student_id: user.id,
        course_id: courseId,
        content_id: contentId,
      });

      if (!progress) {
        return res.status(400).json({
          status: "Failed",
          message: "Failed to create the data",
          result: {},
        });
      }
      res.status(200).json({
        status: "Success",
        message: "Successfully create the data",
        result: progress,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
  getStudentProgress: async (req, res) => {
    const { user } = req;
    const { courseId } = req.query;
    try {
      const status = await StudentCourse.findOne({
        where: {
          course_id: courseId,
        },
        attributes: ["status"],
      });
      if (status.status == 0) {
        return res.status(401).json({
          status: "Unauthorized",
          messsage: "Waiting approval",
          result: [],
        });
      }
      const unlockedContent = await StudentContent.findAndCountAll({
        where: {
          student_id: user.id,
          course_id: courseId,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      const contents = await Content.findAndCountAll({
        where: {
          course_id: courseId,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      if (unlockedContent.count == 0) {
        return res.status(404).json({
          status: "Not Found",
          messsage: "The data is empty",
          result: [],
        });
      }

      res.status(200).json({
        status: "Success",
        message: "Successfully retrieve the data",
        result: {
          unlockedContent,
          contents,
          status,
        },
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
};
