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
          message: error.message,
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
            [Op.iLike]: `%${keyword}%`,
          },
        };
      }

      let name;
      if (keyword) {
        name = {
          fullName: {
            [Op.iLike]: `%${keyword}%`,
          },
        };
      }

      let cat;
      if (category) {
        cat = {
          name: {
            [Op.iLike]: `%${category}%`,
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
          order: [["createdAt", "ASC"]],
          limit: limitation,
          offset: (page - 1) * limitation,
          attributes: {
            exclude: ["updatedAt", "category_id"],
          },
          include: [
            {
              model: Content,
              as: "contents",
              include: [
                {
                  model: Material,
                  as: "materials",
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
          order: [["createdAt", "ASC"]],
          limit: limitation,
          offset: (page - 1) * limitation,
          attributes: {
            exclude: ["updatedAt", "category_id"],
          },
          include: [
            {
              model: Content,
              as: "contents",
              order: [["createdAt", "ASC"]],
              include: [
                {
                  model: Material,
                  as: "materials",
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
      res.status(200).json({
        status: "success",
        message: "successfully retrieved course",
        result: course,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
  getCourse: async (req, res) => {
    const { courseId } = req.query;
    try {
      const course = await Course.findOne({
        where: { id: courseId },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        order: [["contents", "id", "ASC"]],
        include: [
          {
            model: Content,
            as: "contents",
            include: [
              {
                model: Material,
                as: "materials",
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
          },
          {
            model: User,
            as: "by",
            attributes: ["fullName", "email", "image", "role"],
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
    const { courseId: id } = req.query;
    const body = req.body;
    const file = req.file;
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
          result: {},
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
    const { courseId } = req.query;
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
        status: "Success",
        message: "successfully deleted course",
        result: course,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
};

module.exports = courseController;
