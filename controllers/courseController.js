const joi = require("joi");
const { Course, Content, Material, User } = require("../models");
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
    
<<<<<<< HEAD

=======
>>>>>>> 559c87341a04ebc6a2a9b6b2d197e508a4523179
    try {

      let search;
      if (keyword) {
        search = {
<<<<<<< HEAD
          [Op.or] : [
            {
              title : {
                [Op.iLike] :`%${keyword}%`
              }
            },
            {
              "$by.fullName$" : {
                [Op.iLike] :`%${keyword}%`
              }
            }
          ],
=======
          title: {
            [Op.iLike]: `%${keyword}%`,
          },
>>>>>>> 559c87341a04ebc6a2a9b6b2d197e508a4523179
        };
      }

      let cat;
      if (category) {
        cat = {
          name: {
            [Op.iLike]: category,
          },
        };
      } else {
        cat = category;
      }

<<<<<<< HEAD
      if (!page) {
        page = 1;
      }

      let limitation;
      if (!limit) {
        limitation = 8;
      } else {
        limitation = Number(limit);
      }
=======
if (!page) {
  page = 1;
}

let limitation;
if (!limit) {
  limitation = 8;
} else {
  limitation = Number(limit);
}
>>>>>>> 559c87341a04ebc6a2a9b6b2d197e508a4523179

      const course = await Course.findAll({
        limit: limitation,
        offset: (page - 1) * limitation,
<<<<<<< HEAD

=======
        order: [["createdAt", "DESC"]],
>>>>>>> 559c87341a04ebc6a2a9b6b2d197e508a4523179
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
            where: {
              ...search
            },
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
          {
            model : User,
            as : "by",
          }
        ],
        where: {
          ...search
        },

      });

      if (course.length == 0) {
        return res.status(404).json({
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
  getCourse: async (req, res) => {
    const { courseId } = req.params;
    try {
      const course = await Course.findOne({
        where: { courseId },
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
<<<<<<< HEAD

=======
>>>>>>> 559c87341a04ebc6a2a9b6b2d197e508a4523179
      });

      if (!course) {
        res.status(404).json({
          status: "Not Found",
          message: "Course Not Found",
          result: {},
        });
      }

      res.status(200).json({
        status: "success",
        message: "successfully Retrieved course",
        result: course,
      });
    } catch (error) {
      errorHandler(res, error);
    }
  },
  
  updateCourse: async (req, res) => {
    const body = req.body;
    const { courseId } = req.params;
    const file = req.file;
    try {
      const schema = joi.object({
        title: joi.string(),
        image: joi.string(),
        description: joi.string(),
        teacher_id: joi.number(),
        category_id: joi.number(),
      });

      const { error } = schema.validate(body, { image: file.path });
      if (error) {
        res.status(400).json({
          status: "Bad Request",
          message: error.message,
          result: {},
        });
      }

      if (req.file) {
        body.image = req.file.path;
      }

      const checkUpdate = await Course.update(body, {
        where: {
          id: courseId,
        },
        plain: true,
      });

      if (checkUpdate[0] != 1) {
        return res.status(500).json({
          status: "Internal Server Error",
          message: "Failed to update event",
          result: checkUpdate,
        });
      }

      const updatedCourse = await Course.findByPk(courseId);
      res.status(201).json({
        status: "success",
        message: "successfully updated course",
        result: updatedCourse,
      });
    } catch (error) {
      errorHandler(res, error);
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
      errorHandler(res, error);
    }
  },
};

module.exports = courseController;
