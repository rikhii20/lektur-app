const Joi = require("joi");
const errorHandler = require("../utils/errorHandler");
const {
  StudentCourse,
  User,
  Course,
  Content,
  Material,
  StudentContent,
} = require("../models");

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
  getStudentCourses: async (req, res) => {
    const { user } = req;
    try {
      let studentCourse = await StudentCourse.findAll({
        where: {
          student_id: user.id,
        },
        group: "StudentCourse.student_id",
      });
      const studentIds = studentCourse.map((e) => e.student_id);
      const student = await User.findAll({
        where: {
          id: studentIds,
        },
        attributes: ["fullName", "email", "image"],
        include: [
          {
            model: StudentCourse,
            as: "courses",
            attributes: ["id", "status"],
            include: [
              {
                model: Course,
                as: "course",
                attributes: ["id", "title", "image"],
                include: [
                  {
                    model: User,
                    as: "by",
                    attributes: ["id", "fullName"],
                  },
                ],
              },
            ],
          },
        ],
      });
      res.status(200).json({
        status: "Success",
        message: "Successfully retrieve the data",
        result: student,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
  getStudentAssessments: async (req, res) => {
    const { user } = req;
    try {
      let studentCourse = await StudentCourse.findAll({
        where: {
          student_id: user.id,
        },
        group: "StudentCourse.student_id",
      });
      const studentIds = studentCourse.map((e) => e.student_id);
      const student = await User.findAll({
        where: {
          id: studentIds,
        },
        attributes: ["fullName", "email", "image"],
        include: [
          {
            model: StudentQuestion,
            as: "question",
            include: [
              {
                model: Course,
                as: "course",
                attributes: ["id", "title", "image"],
                include: [
                  {
                    model: User,
                    as: "by",
                    attributes: ["id", "fullName"],
                  },
                ],
              },
            ],
          },
        ],
      });
      res.status(200).json({
        status: "Success",
        message: "Successfully retrieve the data",
        result: student,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
  getPopupContent: async (req, res) => {
    let { courseId } = req.query;
    const { user } = req;
    try {
      const student = await Course.findOne({
        where: {
          id: courseId,
        },
        attributes: ["title"],
        include: [
          {
            model: Content,
            as: "contents",
            attributes: ["id", "title"],
            order: [["createdAt", "ASC"]],
          },
          {
            model: StudentContent,
            as: "progress",
            where: {
              student_id: user.id,
            },
            required: false,
            include: [
              {
                model: Content,
                as: "content",
                attributes: ["id", "title"],
              },
            ],
            attributes: {
              exclude: [
                "createdAt",
                "updatedAt",
                "content_id",
                "course_id,",
                "student_id",
                "id",
              ],
            },
          },
        ],
      });
      if (!student) {
        return res.status(404).json({
          status: "Data Not Found",
          message: `Can't find a data with id ${courseId}`,
          result: {},
        });
      }
      res.status(200).json({
        status: "Success",
        message: "Successfully restieve the data",
        result: student,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
  getPopupMaterial: async (req, res) => {
    let { courseId } = req.query;
    try {
      const student = await Course.findOne({
        attributes: ["id"],
        order: [["contents", "materials", "createdAt", "ASC"]],
        include: [
          {
            model: Content,
            as: "contents",
            attributes: ["id", "title"],
            include: [
              {
                model: Material,
                as: "materials",
                attributes: ["id", "name"],
              },
            ],
          },
        ],
        where: {
          id: courseId,
        },
      });
      if (!student) {
        return res.status(404).json({
          status: "Data Not Found",
          message: `Can't find a data with id ${courseId}`,
          result: {},
        });
      }
      res.status(200).json({
        status: "Success",
        message: "Successfully restieve the data",
        result: student,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
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
        return res.status(400).json({
          status: "Bad Request",
          message: `User haven't enroll the course`,
          result: {},
        });
      } else if (checkUser.status == 0) {
        return res.status(400).json({
          status: "Bad Request",
          message: `Waiting approval`,
          result: {},
        });
      }

      const checkStatus = await StudentContent.findOne({
        where: {
          course_id: courseId,
          content_id: contentId,
          student_id: user.id,
        },
      });
      if (checkStatus) {
        return res.status(400).json({
          status: "Bad Request",
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

      let updateStatus;
      if (unlockedContent.count < contents.count) {
        updateStatus = await StudentCourse.update(
          { status: 2 },
          {
            where: {
              student_id: user.id,
              course_id: courseId,
            },
          },
        );
      } else if ((unlockedContent.count = contents.count)) {
        updateStatus = await StudentCourse.update(
          { status: 3 },
          {
            where: {
              student_id: user.id,
              course_id: courseId,
            },
          },
        );
      }

      if (!updateStatus) {
        return res.status(400).json({
          status: "Failed",
          message: "Failed to update the data",
          result: {},
        });
      }
      res.status(201).json({
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
    try {
      let studentCourse = await StudentCourse.findAll({
        where: {
          student_id: user.id,
        },
      });
      const courseIds = studentCourse.map((e) => e.course_id);
      const courses = await Course.findAll({
        where: {
          id: courseIds,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt", "category_id", "user_id"],
        },
        include: [
          {
            model: User,
            as: "by",
            attributes: ["id", "fullName"],
          },
          {
            model: Content,
            as: "contents",
            attributes: ["id", "title"],
            order: [["createdAt", "ASC"]],
          },
          {
            model: StudentContent,
            as: "progress",
            required: false,
            where: {
              student_id: user.id,
            },
            include: [
              {
                model: Content,
                as: "content",
                attributes: ["id", "title"],
              },
            ],
            attributes: {
              exclude: [
                "createdAt",
                "updatedAt",
                "content_id",
                "course_id,",
                "student_id",
                "id",
              ],
            },
          },
          {
            model: StudentCourse,
            as: "status",
            where: {
              student_id: user.id,
            },
            attributes: ["status"],
          },
        ],
      });
      if (courses.length == 0) {
        return res.status(404).json({
          status: "Not Found",
          message: "Can't find student progress / progress is null",
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
