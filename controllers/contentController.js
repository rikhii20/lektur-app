const Joi = require("joi");
const { Content, Material, Course } = require("../models");
const errorHandler = require("../utils/errorHandler");

module.exports = {
  createContent: async (req, res) => {
    const body = req.body;
    const file = req.file;
    const { courseId } = req.query;
    try {
      const schema = Joi.object({
        title: Joi.string().required(),
        video: Joi.string().required(),
        description: Joi.string().required(),
        course_id: Joi.number().required(),
      });
      const { error } = schema.validate({
        ...body,
        video: file.path,
        course_id: courseId,
      });
      if (error) {
        return res.status(400).json({
          status: "Bad Request",
          message: error.message,
          result: {},
        });
      }
      const check = await Course.findOne({
        where: {
          id: courseId,
        },
      });
      if (!check) {
        return res.status(404).json({
          status: "Not Found",
          message: `Can't find course with id ${courseId}`,
          result: {},
        });
      }
      const content = await Content.create({
        ...body,
        video: file.path,
        course_id: courseId,
      });
      if (!content) {
        return res.status(500).json({
          status: "Internal server error",
          message: "Failed to create the data",
          result: {},
        });
      }
      res.status(201).json({
        status: "Success",
        message: "Successfuly to create content",
        result: content,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
  getContents: async (req, res) => {
    try {
      const contents = await Content.findAll({
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
      });
      if (contents.length == 0) {
        return res.status(404).json({
          status: "Not Found",
          messsage: "The data is empty",
          result: [],
        });
      }
      res.status(200).json({
        status: "Success",
        message: "Successfully retrieve the data",
        result: contents,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
  getContent: async (req, res) => {
    const { contentId } = req.query;
    try {
      const content = await Content.findOne({
        where: {
          id: contentId,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        include: [
          {
            model: Material,
            as: "materials",
            attributes: ["name", "url"],
          },
        ],
      });
      if (!content) {
        return res.status(404).json({
          status: "Not Found",
          message: `Can't find the data with id ${contentId}`,
          result: {},
        });
      }
      res.status(200).json({
        status: "Success",
        message: "Successfully retrieve the data",
        result: content,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
  updateContent: async (req, res) => {
    const { contentId } = req.query;
    const body = req.body;
    const file = req.file;
    try {
      const schema = Joi.object({
        title: Joi.string(),
        video: Joi.string(),
        description: Joi.string(),
        course_id: Joi.number(),
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
        update = await Content.update(
          { ...body },
          {
            where: {
              id: contentId,
            },
          },
        );
      } else {
        update = await Content.update(
          { ...body, video: file.path },
          {
            where: {
              id: contentId,
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
      const content = await Content.findOne({
        where: {
          id: contentId,
        },
      });
      res.status(200).json({
        status: "Success",
        message: "successfuly update the data",
        result: content,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
  deleteContent: async (req, res) => {
    const { contentId } = req.query;
    try {
      const content = await Content.destroy({
        where: {
          id: contentId,
        },
      });
      if (!content) {
        return res.status(404).json({
          status: "Not Found",
          message: "Content doesn't exist",
          result: {},
        });
      }
      res.status(200).json({
        status: "Success",
        message: "Successfully delete the data",
        result: content,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
};
