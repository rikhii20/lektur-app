const Joi = require("joi");
const { Material } = require("../models");
const errorHandler = require("../utils/errorHandler");

module.exports = {
  createMaterial: async (req, res) => {
    const body = req.body;
    const file = req.file;
    try {
      const schema = Joi.object({
        name: Joi.string().required(),
        url: Joi.string().required(),
        content_id: Joi.string().required(),
      });
      const { error } = schema.validate({
        ...body,
        url: file.path,
      });
      if (error) {
        return res.status(500).json({
          status: "Bad Request",
          message: error.message,
        });
      }
      const material = await Material.create({
        ...body,
        url: file.path,
      });
      if (!material) {
        return res.status(500).json({
          status: "Internal server error",
          message: "Failed to create the data",
          result: {},
        });
      }
      res.status(201).json({
        status: "Success",
        message: "Successfuly to create content",
        result: material,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
  updateMaterial: async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    const file = req.file;
    try {
      const schema = Joi.object({
        name: Joi.string(),
        url: Joi.string(),
        content_id: Joi.number(),
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
        update = await Material.update(
          { ...body },
          {
            where: {
              id,
            },
          },
        );
      } else {
        update = await Material.update(
          { ...body, url: file.path },
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
      const material = await Material.findOne({
        where: {
          id,
        },
      });
      res.status(200).json({
        status: "Success",
        message: "successfuly update the data",
        result: material,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
  deleteMaterial: async (req, res) => {
    const { id } = req.params;
    try {
      const material = await Material.destroy({
        where: {
          id,
        },
      });
      if (!material) {
        return res.status(404).json({
          status: "Not Found",
          message: "Content doesn't exist",
          result: {},
        });
      }
      res.status(200).json({
        status: "Success",
        message: "Successfully delete the data",
        result: material,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
};
