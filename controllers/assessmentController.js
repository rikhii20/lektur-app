const { Assessment, Question, Option } = require("../models");
const errorHandler = require("../utils/errorHandler");
const joi = require("joi");

const AssessmentController = {
  createAssessment: async (req, res) => {
    const {courseId, assessmentId, questId} = req.query
    const body = req.body
    try {
      const schema = joi.object({
        course_id: joi.number().required(),
      });
      const { error } = schema.validate({
        course_id: courseId,
      });
      console.log(body, courseId)
      if (error) {
        return res.status(400).json({
          message: error.message,
          status: "Bad Request",
          result: {},
        });
      }
      const newAssessment = await Assessment.create({
        course_id: courseId,
      });

      if (!newAssessment) {
        return res.status(500).json({
          message: error.message,
          status: "internal Server error",
          result: {},
        });
      }

      for await (const quest of body){
        await Question.create({
          assessment_id : assessmentId, 
          question : quest.question,
          remarks : quest.remarks
        })	

        for await (const option of quest.options) {
          await Option.create({
            question_id : questId, 
            option : option,
            isTrue : false
          })
        }
        }

      res.status(201).json({
        message: "Create Assessment Success",
        status: "OK Assemenst done Create",
        result: newAssessment,
      });

    } catch (error) {
      console.log(error);
      errorHandler(error, res);
    }
  },
  
  // getAllAssessment: async (req, res) => {
  //   try {
  //     const getAllQuestion = await Question.findAll({
  //       order: [["createdAt", "ASC"]],
  //       attributes: { exclude: ["createdAt", "updateAt", "value"] },
  //       include: [
  //         {
  //           model: Option,
  //           as: "Option",
  //           attributes: ["description"],
  //         },
  //       ],
  //     });
  //     if (!getAllQuestion.length) {
  //       res.status(404).json({
  //         status: "Not Found",
  //         message: "Data is Empty",
  //         result: getAllQuestion,
  //       });
  //     }
  //     res.status(201).json({
  //       status: "successfully",
  //       message: "successfully Get Assemenst All",
  //       result: getAllQuestion,
  //     });
  //   } catch (error) {
  //     errorHandler(error, res);
  //   }
  // },
  
  getAssessment: async (req, res) => {
    const { questionId } = req.query; //
    try {
      const getAssessment = await Assessment.findOne({
        include: [
          {
            model: Question,
            as: "question",
            include: [
              {
                model: Option,
                as: "option"
              }
            ]
          },
        ],
        where: { question_id },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });

      if (!getAssessment.length) {
        res.status(404).json({
          status: "Not Found",
          message: "Data is Empty",
          result: {},
        });
      }

      res.status(201).json({
        status: "success",
        message: "successfully retrieved Assessment",
        result: getAssessment,
      });

    } catch (error) {
      errorHandler(error, res);
    }
  },

  // updateAssessment: async (req, res) => {
  //   const body = req.body;
  //   const { question_id } = req.query;
  //   try {
  //     const schema = joi.object({
  //       description: joi.string().required(),
  //       remark: joi.string().required(),
  //       correctOption: joi.string().required(),
  //       course_id: joi.number().required(),
  //     });
  //     const { error } = schema.validate({ ...body });
  //     if (error) {
  //       return res.status(400).json({
  //         message: error.message,
  //         status: "Bad Request",
  //         result: {},
  //       });
  //     }
  //     const checkUpdate = await Question.update(
  //       { ...body },
  //       {
  //         where: {
  //           question_id,
  //         },
  //       },
  //     );
  //     if (!checkUpdate[0]) {
  //       return res.status(500).json({
  //         status: "Internal Server Error",
  //         message: "Failed to Update assessment",
  //         result: checkUpdate,
  //       });
  //     }
  //     const updateQuestion = await Question.findByPk(question_id);
  //     res.status(201).json({
  //       status: "success",
  //       message: "success Update assessment",
  //       result: updateQuestion,
  //     });
  //   } catch (error) {
  //     errorHandler(error, res);
  //   }
  // },
  
  deleteAssessment: async (req, res) => {
    const { question_id } = req.params;
    try {
      const deleteAssessment = await Assessment.destroy({
        where: { question_id },
      });
      if (!deleteAssessment) {
        return res.status(404).json({
          status: "Not Found",
          message: "Assessment does not exist!",
          result: {},
        });
      }

      res.status(200).json({
        status: "success",
        message: "succussfully deleted Assessment",
        result: {},
      });

    } catch (error) {
      errorHandler(error, res);
    }
  },
};

module.exports = AssessmentController;
