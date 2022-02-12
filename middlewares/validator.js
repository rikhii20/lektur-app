<<<<<<< HEAD
module.exports.validate = (schema) => {
    return async (req, res, next) => {
      try {
        const body = await req.body;
=======
const errorHandler = require("../utils/errorHandler")

module.exports.validate = (schema) => {
    return (req, res, next) => {
      try {
        const body = req.body;
>>>>>>> 82648780c2b4a24f9722723c6ae0c118f33736e6
        const { error } = schema.validate(body);
        if (error)
          return res.status(400).json({
            status: "Bad Request",
            message: error.message,
          });
        next();
<<<<<<< HEAD
      } catch (err) {
        next(err);
=======
      } catch (error) {
        errorHandler(error, res);
>>>>>>> 82648780c2b4a24f9722723c6ae0c118f33736e6
      }
    };
  };
  