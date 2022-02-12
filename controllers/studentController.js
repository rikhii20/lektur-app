const Joi = require("joi");
const errorHandler = require("../utils/errorHandler");
const { StudentCourse, User, Course, Content, Material } = require("../models");

module.exports = {
  enrollCourse: async (req, res) => {
    const { courseId } = req.query;
    const { user } = req;
    try {
      const schema = Joi.object({
        student_id: Joi.number().required(),
        course_id: Joi.number().required(),
      });
      const { error } = schema.validate({
        student_id: user.id,
        course_id: courseId,
      });
      if (error) {
        return res.status(400).json({
          status: "Bad Request",
          message: error.message,
          result: {},
        });
      }
      if (user.role == "teacher") {
        return res.status(400).json({
          status: "Bad Request",
          message: "Course is only for student",
          result: {},
        });
      }
      const existStudent = await StudentCourse.findOne({
        where: {
          course_id: courseId,
          student_id: user.id,
        },
      });
      if (existStudent) {
        return res.status(400).json({
          status: "Bad Request",
          message: "You have already enrolled the course",
          result: {},
        });
      }
      const checkCourse = await Course.findOne({
        where: {
          id: courseId,
        },
      });
      if (!checkCourse) {
        return res.status(404).json({
          status: "Bad Request",
          message: `Can't find course with id ${courseId}`,
          result: {},
        });
      }
      const enroll = await StudentCourse.create({
        student_id: user.id,
        course_id: courseId,
      });
      if (!enroll) {
        return res.status(400).json({
          status: "Failed",
          message: "Failed to enroll the course",
          result: {},
        });
      }
      res.status(200).json({
        status: "Success",
        message: "Successfully enrolled!",
        result: enroll,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
  approvedCourse: async (req, res) => {
    const { courseId, studentId } = req.query;
    try {
      const schema = Joi.object({
        student_id: Joi.number(),
        course_id: Joi.number(),
      });
      const { error } = schema.validate({
        student_id: studentId,
        course_id: courseId,
      });
      if (error) {
        return res.status(400).json({
          status: "Bad Request",
          message: error.message,
          result: {},
        });
      }
      const check = await StudentCourse.findOne({
        where: {
          course_id: courseId,
          student_id: studentId,
        },
      });
      if (!check) {
        return res.status(404).json({
          status: "Not Found",
          message: "student haven't registered for course",
          result: {},
        });
      }
      const update = await StudentCourse.update(
        { status: 1 },
        {
          where: {
            course_id: courseId,
            student_id: studentId,
          },
        },
      );
      if (update[0] != 1) {
        return res.status(500).json({
          status: "Internal server error",
          message: "Failed update the data / data not found",
          result: {},
        });
      }
      const approved = await StudentCourse.findOne({
        where: {
          course_id: courseId,
          student_id: studentId,
        },
      });
      res.status(200).json({
        status: "Success",
        message: "successfuly approved the student course",
        result: approved,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
  getStudentDashboard: async (req, res) => {
    const { user } = req;
    try {
      const student = await StudentCourse.findAll({
        where: {
          student_id: user.id,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt", "course_id", "student_id"],
        },
        include: [
          {
            model: User,
            as: "student",
            attributes: {
              exclude: ["createdAt", "updatedAt", "password"],
            },
          },
          {
            model: Course,
            as: "course",
            attributes: {
              exclude: ["createdAt", "updatedAt", "user_id", "category_id"],
            },
            include: [
              {
                model: User,
                as: "by",
                attributes: ["fullName", "role"],
              },
              {
                model: Content,
                as: "content",
                attributes: ["title"],
                order: [["createdAt", "ASC"]],
                include: [
                  {
                    model: Material,
                    as: "material",
                    attributes: ["name", "url"],
                  },
                ],
              },
            ],
          },
        ],
      });
      if (student.length == 0) {
        return res.status(404).json({
          status: "Not Found",
          messsage: "The data is empty",
          result: [],
        });
      }
      res.status(200).json({
        status: "Success",
        message: "Successfully retrieve the data",
        result: student,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
};
