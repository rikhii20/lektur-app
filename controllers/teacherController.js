const Joi = require("joi");
const errorHandler = require("../utils/errorHandler");
const {
  Content,
  StudentCourse,
  StudentContent,
  Course,
  Material,
  User,
} = require("../models");

module.exports = {
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
  getTeacherCourses: async (req, res) => {
    const { user } = req;
    try {
      const teacher = await Course.findAll({
        where: {
          user_id: user.id,
        },
        attributes: ["id", "title", "image"],
        include: [
          {
            model: Content,
            as: "contents",
            attributes: {
              exclude: ["createdAt", "updatedAt", "course_id"],
            },
            include: [
              {
                model: Material,
                as: "materials",
                attributes: {
                  exclude: ["createdAt", "updatedAt", "content_id"],
                },
              },
            ],
          },
          {
            model: StudentCourse,
            as: "enrolledStudents",
            attributes: {
              exclude: ["createdAt", "updatedAt", "course_id"],
            },
          },
        ],
      });
      if (teacher.length == 0) {
        return res.status(404).json({
          status: "Not Found",
          message: "You haven't create a course",
          result: {},
        });
      }
      res.status(200).json({
        status: "Success",
        message: "Successfully retrieve the data",
        result: teacher,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
  getStudents: async (req, res) => {
    const { courseId } = req.query;
    try {
      const courses = await Course.findAll({
        where: {
          id: courseId,
          user_id: req.user.id,
        },
        attributes: ["id", "title", "description"],
        include: [
          {
            model: StudentCourse,
            as: "enrolledStudents",
            attributes: ["id", "status", "assessmentScore"],
            include: [
              {
                model: User,
                as: "students",
                attributes: ["id", "fullName"],
                include: [
                  {
                    model: StudentContent,
                    as: "progress",
                    where: {
                      course_id: courseId,
                    },
                    attributes: ["course_id"],
                    include: [
                      {
                        model: Content,
                        as: "content",
                        attributes: ["id", "title"],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            model: Content,
            as: "contents",
            attributes: ["id", "title"],
          },
        ],
      });
      if (courses.length == 0) {
        return res.status(404).json({
          status: "Bad Request",
          message: "No Students Enrolled",
          result: [],
        });
      }
      res.status(200).json({
        status: "Success",
        message: "Successfully retrieve the data",
        result: courses,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
};
