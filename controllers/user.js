const jwt = require("jsonwebtoken");
const { User } = require("../models");
const bcrypt = require("bcrypt");
const errorHandler = require("../utils/errorHandler");

module.exports = {
  register: async (req, res) => {
    const body = req.body;
    const { status } = req.query;
    try {
      if (status == 1) {
        const check = await User.findOne({
          where: {
            email: body.email,
          },
        });
        if (check) {
          return res.status(400).json({
            status: "Bad Request",
            message: "Email already exists",
          });
        }
        const hashedPassword = await bcrypt.hash(body.password, 10);
        const user = await User.create({
          fullName: body.fullName,
          email: body.email,
          password: hashedPassword,
          isTeacher: status,
        });
        const token = jwt.sign(
          {
            id: user.id,
            email: user.email,
          },
          process.env.SECRET_TOKEN,
          { expiresIn: "24h" },
        );
        res.status(200).json({
          status: "Success",
          message: "Successfully to create an teacher account",
          result: token,
        });
      } else {
        const check = await User.findOne({
          where: {
            email: body.email,
          },
        });
        if (check) {
          return res.status(400).json({
            status: "Bad Request",
            message: "Email already exists",
          });
        }
        const hashedPassword = await bcrypt.hash(body.password, 10);
        const user = await User.create({
          fullName: body.fullName,
          email: body.email,
          password: hashedPassword,
        });
        const token = jwt.sign(
          {
            id: user.id,
            email: user.email,
          },
          process.env.SECRET_TOKEN,
          { expiresIn: "24h" },
        );
        res.status(200).json({
          status: "Success",
          message: "Successfully to create an student account",
          result: token,
        });
      }
    } catch (error) {
      errorHandler(error, res);
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({
        where: {
          email,
        },
      });
      if (!user) {
        return res.status(401).json({
          status: "Unauthorized",
          message: "Invalid email and password combination",
        });
      }
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(401).json({
          status: "Unauthorized",
          message: "Invalid email and password combination",
          result: {},
        });
      }
      const token = jwt.sign(
        {
          email: user.email,
          id: user.id,
        },
        process.env.SECRET_TOKEN,
        { expiresIn: "24h" },
      );

      res.status(200).json({
        status: "Success",
        message: "Logged in successfully",
        result: {
          token,
          user: {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            image: user.image,
            isTeacher: user.isTeacher,
          },
        },
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
};
