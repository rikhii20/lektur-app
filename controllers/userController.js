const jwt = require("jsonwebtoken");
const { User, ForgotPassword } = require("../models");
const bcrypt = require("bcrypt");
const errorHandler = require("../utils/errorHandler");
const randomstring = require("randomstring");
const sendMail = require("../utils/sendMail")
const cloudinary = require("cloudinary")

module.exports = {
  register: async (req, res) => {
    const {fullName, email, role, password} = req.body;
    try {
      if (role == "student") {
        const check = await User.findOne({
          where:
          { 
            email, 
          }
          
        });
        if (check) {
          return res.status(400).json({
            status: "Bad Request",
            message: "Email already exists",
            result: {},
          });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
          fullName: fullName,
          email: email,
          password: hashedPassword,
          role: role,
        }); 
        const token = jwt.sign(
          {
            id: user.id,
            email: user.email,
          },
          process.env.SECRET_TOKEN,
          { expiresIn: "24h" }
        );
        sendMail(
          email,
          "Register Successfully",
          `
          <h1> Wellcome To Lektur </h1>
          <p> hi student </p>
          <p> click link below to login </p>
          <a href="https://lektur-app-glints16.herokuapp.com/login">Login</a>
          <p> Thank you for being a part of lektur </p>
          `,
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
      } else if (role == "teacher") {
        const check = await User.findOne({
          where: {
            email: email,
          },
        });
        if (check) {
          return res.status(400).json({
            status: "Bad Request",
            message: "Email already exists",
            result: {},
          });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
          fullName: fullName,
          email: email,
          password: hashedPassword,
          role: role,
        });
        const token = jwt.sign(
          {
            id: user.id,
            email: user.email,
          },
          process.env.SECRET_TOKEN,
          { expiresIn: "24h" }
        );
        sendMail(
          email,
          "Register Successfully",
          `
          <h1> Wellcome To Lektur </h1>
          <p> hi teacher </p>
          <p> click link below to login </p>
          <a href="https://lektur-app-glints16.herokuapp.com/login">Login</a>
          <p> Thank you for being a part of lektur </p>
          `,
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
      errorHandler(error, res);
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
      errorHandler(error, res)
    }
  },
  loginFacebook : async (req, res) => {
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
      errorHandler(error, res)
    }
  },
  fetchAccountInfo: async (req, res) => {
    try {
      const data = await User.findByPk(req.user.id, {
        attributes: ["fullName", "email", "image"],
      });
      res.status(200).json({
        status: "Success",
        message: "Profile Fetched",
        result: data,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
  editProfile: async (req, res) => {
    try {
      const { fullName, email } = await req.body;
      await User.update(
        {
          fullName : fullName,
          email: email,
        },
        { where: { id: req.user.id } }
      ); 
      res.status(200).json({
        status: "Success",
        message: "Profile updated",
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
  uploadImage: async (req, res) => {
    try {
      const file  = req.file;

      const user = await User.update(
        {
          image: file.path,
        },
        { where: { id: req.user.id } }
      );
      if (user[0] != 1) {
        return res.status(500).json({
          status : "Internal server error",
          message : "Failed update the data",
          result : {},
        })
      }
      const check = await User.findOne({
        where : {
          id : req.user.id
        },
        attributes : {
          exclude : ["updatedAt", "createdAt" , "password"]
        }
      })

      res.status(200).json({
        status: "Success",
        message: "Profile photo updated",
        result: check
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
  deleteImage: async (req, res) => {
    try {
      const { image } = await User.findByPk(req.user.id)
      const public_id = await image.substr(60)
      console.log(public_id)
      await cloudinary.v2.api.delete_resources(public_id); 

      User.update({
        image: "https://res.cloudinary.com/ddvobptro/image/upload/v1642494701/siluet_wni7t4.png"
      }, {
        where: { id: req.user.id }
      })
      res.status(200).json({
        status: "Success",
        message: "image deleted",
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
  changePassword: async (req, res) => {
    try {
      const { newPassword, oldPassword } = await req.body;
      const { password } = await User.findByPk(req.user.id, {
        attributes: ["password"],
      });
      const comp = bcrypt.compareSync(oldPassword, password);
      if (!comp)
        return res.status(500).json({
          status: "failed",
          message: "Password did not match",
        });
      await User.update(
        {
          password: bcrypt.hashSync(newPassword, 10),
        },
        {
          where: {
            id: req.user.id,
          },
        }
      );
      res.status(200).json({
        status: "Success",
        message: "Password updated",
      });
    } catch (error) {
      errorHandler(error, res);
    }
  },
}