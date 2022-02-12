const joi = require("joi");
const {
  Course,
  Content,
  Material,
  User,
  Category,
  StudentCourse,
} = require("../models");
const errorHandler = require("../utils/errorHandler");
const { Op } = require("sequelize");
const { Sequelize } = require("sequelize");

const courseController = {
  createCourse: async (req, res) => {
    const body = req.body;
    const file = req.file;
    try {
      const schema = joi.object({
        title: joi.string().required(),
        image: joi.string().required(),
        description: joi.string().required(),
        user_id: joi.number().required(),
        category_id: joi.number().required(),
      });

      const { error } = schema.validate({
        ...body,
        image: file.path,
        user_id: req.user.id,
      });

      if (error) {
        res.status(400).json({
          status: "Bad Request",
          message: message.error,
          result: {},
        });
      }

      const course = await Course.create({
        ...body,
        image: file.path,
        user_id: req.user.id,
      });
      if (!course) {
        res.status(404).json({
          status: "Not Found",
          message: "Database is empty",
          result: {},
        });
      }

      res.status(201).json({
        status: "success",
        message: "successfully created course",
        result: course,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
  getAllCourses: async (req, res) => {
    let { category, page, limit, keyword } = req.query;
    try {
      let search;
      if (keyword) {
        search = {
          title: {
            [Op.like]: `%${keyword}%`,
          },
        };
      }

      let name;
      if (keyword) {
        name = {
          fullName: {
            [Op.like]: `%${keyword}%`,
          },
        };
      }

      let cat;
      if (category) {
        cat = {
          name: {
            [Op.like]: `%${category}%`,
          },
        };
      } else {
        cat = category;
      }

      if (!page) {
        page = 1;
      }

      let limitation;
      if (!limit) {
        limitation = 8;
      } else {
        limitation = Number(limit);
      }

      const courseCheck = await Course.findOne({
        where: {
          ...search,
        },
      });

      let course;
      if (courseCheck === null) {
        course = await Course.findAll({
          limit: limitation,
          offset: (page - 1) * limitation,
          attributes: {
            exclude: ["createdAt", "updatedAt", "category_id"],
          },
          include: [
            {
              model: Content,
              as: "content",
              include: [
                {
                  model: Material,
                  as: "material",
                  attributes: {
                    exclude: ["createdAt", "updatedAt"],
                  },
                },
              ],
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            },
            {
              model: Category,
              as: "category",
              attributes: ["name"],
              where: {
                ...cat,
              },
            },
            {
              model: User,
              as: "by",
              attributes: {
                exclude: ["email", "password", "createdAt", "updatedAt"],
              },
              where: {
                ...name,
              },
            },
          ],
        });
      } else {
        course = await Course.findAll({
          where: {
            ...search,
          },
          limit: limitation,
          offset: (page - 1) * limitation,
          attributes: {
            exclude: ["createdAt", "updatedAt", "category_id"],
          },
          include: [
            {
              model: Content,
              as: "content",
              include: [
                {
                  model: Material,
                  as: "material",
                  attributes: {
                    exclude: ["createdAt", "updatedAt"],
                  },
                },
              ],
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            },
            {
              model: Category,
              as: "category",
              attributes: ["name"],
              where: {
                ...cat,
              },
            },
            {
              model: User,
              as: "by",
              attributes: {
                exclude: ["email", "password", "createdAt", "updatedAt"],
              },
            },
          ],
        });
      }

      if (course.length == 0) {
        return res.status(404).json({
          status: "Not Found",
          message: "Database is empty",
          result: {},
        });
      }

      res.status(201).json({
        status: "success",
        message: "successfully retrieved course",
        result: course,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
  getCourse: async (req, res) => {
    const { courseId } = req.params;
    try {
      const course = await Course.findOne({
        where: { id: courseId },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        include: [
          {
            model: Content,
            as: "content",
            include: [
              {
                model: Material,
                as: "material",
                attributes: {
                  exclude: ["createdAt", "updatedAt"],
                },
              },
            ],
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        ],
      });

      if (!course) {
        return res.status(404).json({
          status: "Not Found",
          message: "Course Not Found",
          result: {},
        });
      }

      res.status(200).json({
        status: "success",
        message: "successfully retrieved course",
        result: course,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
  updateCourse: async (req, res) => {
    const { courseId: id } = req.params;
    const body = req.body;
    const file = req.file;
    console.log(file);
    console.log(body);
    try {
      const schema = joi.object({
        title: joi.string(),
        image: joi.string(),
        description: joi.string(),
        user_id: joi.number(),
        category_id: joi.number(),
      });

      const { error } = schema.validate(body);
      if (error) {
        return res.status(400).json({
          status: "Bad Request",
          message: error.message,
        });
      }
      let update;
      if (!file) {
        update = await Course.update(
          { ...body },
          {
            where: {
              id,
            },
          },
        );
      } else {
        update = await Course.update(
          { ...body, image: file.path },
          {
            where: {
              id,
            },
          },
        );
      }

      if (update[0] != 1) {
        return res.status(500).json({
          status: "Internal server error",
          message: "Failed update the data / data not found",
          result: {},
        });
      }
      const check = await Course.findOne({
        where: {
          id,
        },
      });
      res.status(200).json({
        status: "Success",
        message: "successfuly update the data",
        result: check,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
  deleteCourse: async (req, res) => {
    const { courseId } = req.params;
    try {
      const course = await Course.destroy({
        where: { id: courseId },
      });

      if (!course) {
        return res.status(404).json({
          status: "Not Found",
          message: "Course does not exist!",
          result: {},
        });
      }

      res.status(200).json({
        status: "success",
        message: "successfully deleted course",
        result: course,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
  getPopupContent: async (req, res) => {
    let { courseId } = req.query;
    try {
      const student = await Course.findOne({
        attributes: ["title"],
        order: [[{ model: Content, as: "content" }, "createdAt", "ASC"]],
        include: [
          {
            model: Content,
            as: "content",
            attributes: ["title"],
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
  getPopupMaterial: async (req, res) => {
    let { courseId } = req.query;
    try {
      const student = await Course.findOne({
        attributes: ["title"],
        include: [
          {
            model: Content,
            as: "content",
            attributes: ["title"],
            include: [
              {
                model: Material,
                as: "material",
                attributes: ["name"],
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
  getTeacherDashboard: async (req, res) => {
    const { user } = req;
    try {
      const teacher = await Course.findAll({
        where: {
          user_id: user.id,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt", "category_id"],
        },
        include: [
          {
            model: StudentCourse,
            as: "enrolledStudent",
            attributes: {
              exclude: ["createdAt", "updatedAt", "course_id"],
            },
          },
        ],
      });
      if (teacher.length == 0) {
        return res.status(404).json({
          status: "Not Found",
          message: "You haven't create course",
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
};

module.exports = courseController;
