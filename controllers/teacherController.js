const Joi = require("joi");
const errorHandler = require("../utils/errorHandler");
const {
  Content,
  StudentCourse,
  StudentContent,
  Course,
  Material,
  User,
  Invitation,
} = require("../models");
const sendMail = require("../utils/sendMail");
const { Op } = require("sequelize");

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
        order: [["contents", "createdAt", "ASC"]],
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
    let { courseId, sort, keyword, status } = req.query;
    try {
      let order;
      switch (sort) {
        case "status":
          order = [["enrolledStudents", "status", "DESC"]];
          break;
        case "score":
          order = [["enrolledStudents", "assessmentScore", "DESC"]];
          break;
        case "name":
          order = [["enrolledStudents", "students", "fullName", "ASC"]];
          break;
        default:
          order = [["createdAt", "ASC"]];
      }

      let search;
      if (keyword) {
        search = {
          fullName: {
            [Op.iLike]: `%${keyword}%`,
          },
        };
      }

      let progress;
      if (status) {
        progress = {
          status: status,
        };
      }

      const courses = await Course.findAll({
        where: {
          id: courseId,
          user_id: req.user.id,
        },
        order: order,
        include: [
          {
            model: StudentCourse,
            as: "enrolledStudents",
            where: {
              ...progress,
            },
            attributes: ["id", "status", "assessmentScore"],
            include: [
              {
                model: User,
                as: "students",
                where: {
                  ...search,
                },
                attributes: ["id", "fullName", "email", "image"],
                include: [
                  {
                    model: StudentContent,
                    as: "progress",
                    where: {
                      course_id: courseId,
                    },
                    required: false,
                    attributes: ["course_id"],
                    include: [
                      {
                        model: Content,
                        as: "content",
                        attributes: ["id", "title"],
                        required: false,
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
        attributes: ["id", "title", "description", "image", "description"],
      });
      if (courses.length == 0) {
        return res.status(404).json({
          status: "Bad Request",
          message: "Data not found",
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
  createInvitation: async (req, res) => {
    const { email } = req.body;
    const { user } = req;
    const { courseId } = req.query;
    try {
      const student = await User.findOne({
        where: {
          email,
        },
      });
      let invite;
      if (!student) {
        invite = await Invitation.create({
          studentEmail: email,
          teacher_id: user.id,
          course_id: courseId,
          isApproved: false,
        });
        sendMail(
          email,
          "Course Invitation",
          `
          <h1>You've been invited to join the course</h1>
          <p> click link below to enroll the course</p>
          <a href="https://lektur-app-glints16.herokuapp.com/register">Click Here</a>
          `,
        );
      } else {
        invite = await Invitation.create({
          studentEmail: email,
          teacher_id: user.id,
          course_id: courseId,
          isApproved: false,
        });
        sendMail(
          email,
          "Course Invitation",
          `
          <h1>You've been invited to join the course</h1>
          <p> click link below to enroll the course</p>
          <a href="https://lektur-app-glints16.herokuapp.com/detail">Click Here</a>
          `,
        );
      }
      res.status(200).json({
        status: "Success",
        message: "Successfully sent the invitation email",
        result: invite,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
};
