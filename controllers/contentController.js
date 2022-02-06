const Joi = require("joi");
const { Content, Material } = require("../models");
const errorHandler = require("../utils/errorHandler");

module.exports = {
  createContent: async (req, res) => {
    const body = req.body;
    const file = req.file;
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
      });
      if (error) {
        return res.status(400).json({
          status: "Bad Request",
          message: error.message,
        });
      }
      const content = await Content.create({
        ...body,
        video: file.path,
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
    const { id } = req.params;
    try {
      const content = await Content.findOne({
        where: {
          id,
        },
      });
      if (!content) {
        return status(404).json({
          status: "Not Found",
          message: `Can't find the data with id ${id}`,
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
    const { id } = req.params;
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
        });
      }
      let update;
      if (!file) {
        update = await Content.update(
          { ...body },
          {
            where: {
              id,
            },
          },
        );
      } else {
        update = await Content.update(
          { ...body, video: file.path },
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
      const content = await Content.findOne({
        where: {
          id,
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
    const { id } = req.params;
    try {
      const content = await Content.destroy({
        where: {
          id,
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
