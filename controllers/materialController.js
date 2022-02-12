const Joi = require("joi");
const { Material, Content } = require("../models");
const errorHandler = require("../utils/errorHandler");

module.exports = {
  createMaterial: async (req, res) => {
    const body = req.body;
    const file = req.file;
    const { contentId } = req.query;
    try {
      const schema = Joi.object({
        name: Joi.string().required(),
        url: Joi.string().required(),
        content_id: Joi.string().required(),
      });
      const { error } = schema.validate({
        ...body,
        url: file.path,
        content_id: contentId,
      });
      if (error) {
        return res.status(500).json({
          status: "Bad Request",
          message: error.message,
        });
      }
      const check = await Content.findOne({
        where: {
          id: contentId,
        },
      });
      if (!check) {
        return res.status(404).json({
          status: "Not Found",
          message: `Can't find content with id ${contentId}`,
        });
      }
      const material = await Material.create({
        ...body,
        url: file.path,
        content_id: contentId,
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
  getMaterials: async (req, res) => {
    try {
      const materials = await Material.findAll({
        order: [["createdAt", "ASC"]],
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      if (materials.length == 0) {
        return res.status(404).json({
          status: "Not Found",
          messsage: "The data is empty",
          result: [],
        });
      }
      res.status(200).json({
        status: "Success",
        message: "Successfully retrieve the data",
        result: materials,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
  updateMaterial: async (req, res) => {
    const { materialId } = req.query;
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
          result: {},
        });
      }
      let update;
      if (!file) {
        update = await Material.update(
          { ...body },
          {
            where: {
              id: materialId,
            },
          },
        );
      } else {
        update = await Material.update(
          { ...body, url: file.path },
          {
            where: {
              id: materialId,
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
          id: materialId,
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
    const { materialId } = req.query;
    try {
      const material = await Material.destroy({
        where: {
          id: materialId,
        },
      });
      if (!material) {
        return res.status(404).json({
          status: "Not Found",
          message: `Can't find material with id ${materialId}`,
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
