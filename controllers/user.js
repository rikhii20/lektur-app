const jwt = require("jsonwebtoken");
const { User, ForgotPassword } = require("../models");
const bcrypt = require("bcrypt");
const errorHandler = require("../utils/errorHandler");
const randomstring = require("randomstring");
const sendMail = require("../middlewares/send-mail");

module.exports = {
  register: async (req, res) => {
    const body = req.body;
    try {
      if (body.role == "student") {
        const check = await User.findOne({
          where: {
            email: body.email,
          },
        });
        if (check) {
          return res.status(400).json({
            status: "Bad Request",
            message: "Email already exists",
            result: {},
          });
        }
        const hashedPassword = await bcrypt.hash(body.password, 10);
        const user = await User.create({
          fullName: body.fullName,
          email: body.email,
          password: hashedPassword,
          role: body.role,
        });
        const token = jwt.sign(
          {
            id: user.id,
            email: user.email,
          },
          process.env.SECRET_TOKEN,
          { expiresIn: "24h" }
        );
        res.status(200).json({
          status: "Success",
          message: "Successfully to create an student account",
          result: {
            token,
            user: {
              id: user.id,
              fullName: user.fullName,
              email: user.email,
              image: user.image,
              role: user.role,
            },
          },
        });
      } else if (body.role == "teacher") {
        const check = await User.findOne({
          where: {
            email: body.email,
          },
        });
        if (check) {
          return res.status(400).json({
            status: "Bad Request",
            message: "Email already exists",
            result: {},
          });
        }
        const hashedPassword = await bcrypt.hash(body.password, 10);
        const user = await User.create({
          fullName: body.fullName,
          email: body.email,
          password: hashedPassword,
          role: body.role,
        });
        const token = jwt.sign(
          {
            id: user.id,
            email: user.email,
          },
          process.env.SECRET_TOKEN,
          { expiresIn: "24h" }
        );
        res.status(200).json({
          status: "Success",
          message: "Successfully to create an teacher account",
          result: {
            token,
            user: {
              id: user.id,
              fullName: user.fullName,
              email: user.email,
              image: user.image,
              role: user.role,
            },
          },
        });
      } else {
        return res.status(400).json({
          status: "Bad Request",
          message: "role only student and teacher",
          result: {},
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
          email : email.trim().toLowerCase(),
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
        { expiresIn: "24h" }
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
            role: user.role,
          },
        },
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
  forgotPassword: async (req, res) => {
    const { email } = req.body;
    try {
      const user = await User.findOne({
        where: {
          email: email,
        },
      });
      if (!user) {
        return res.status(404).json({
          status: "bad request",
          message: "email not found",
          result: {},
        });
      }

      const passwordReset = await ForgotPassword.create({
        email,
        validationCode: randomstring.generate(50),
        isDone: false,
      });
      await sendMail(
        email,
        "Password Reset",
        `<h1>Password Reset Confirmation</h1>
        <a href="https://localhost:5000/api/v1/user/forgot?code=${passwordReset.validationCode}">Click Here</a>
        `
      );
      res.status(200).json({
        status: "Success",
        message: "Successfully sent validation code",
        result: {},
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
  resetPassword: async (req, res) => {
    const { validationCode, password } = req.body;
    try {
      const validate = await ForgotPassword.findOne({
        where: {
          validationCode,
          isDone: false,
        },
      });
      if (!validate) {
        return res.status(404).json({
          status: "Not Found",
          message: "Invalid code validation",
          result: {},
        });
      }
      const hashPassword = await bcrypt.hash(password, 10);

      await User.update(
        { password: hashPassword },
        { where: { email: validate.email } }
      );
      await ForgotPassword.update(
        { isDone: true },
        {
          where: {
            validationCode,
          },
        }
      );

      res.status(200).json({
        status: "Success",
        message: "Successfully change the password",
        result: {},
      });
    } catch (error) {
      catchError(error, res);
    }
  },
  loginGoogle : async (req, res) => {
    try {
      let payload = {
        id : req.user.id,
        email : req.user.email
      };
      const token = jwt.sign(payload, process.env.SECRET_TOKEN)
      res.status(200).json({
        status: "Success",
        message: "Successfully logged in",
        result: {
          token,
        },
      });
    } catch (error){
      catchError(error, res)
    }
  }
}