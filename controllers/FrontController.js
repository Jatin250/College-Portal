const UserModel = require("../models/user");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary");
const jwt = require("jsonwebtoken");

// configuraton Setup
cloudinary.config({
  cloud_name: "dkpr89ars",
  api_key: "525114599641279",
  api_secret: "T96YdvUrKMsDhb1vxfsux2sbftA",
});

class FrontController {
  static home = async (req, res) => {
    try {
      const { name, image } = req.udata;
      res.render("home", { n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };
  static about = async (req, res) => {
    try {
      const { name, image } = req.udata;
      res.render("about", { n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };
  static login = async (req, res) => {
    try {
      res.render("login", {
        msg: req.flash("success"),
        msg1: req.flash("error"),
      });
    } catch (error) {
      console.log(error);
    }
  };
  static contact = async (req, res) => {
    try {
      const { name, image } = req.udata;
      res.render("contact", { n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };
  static register = async (req, res) => {
    try {
      res.render("register", { msg: req.flash("error") });
    } catch (error) {
      console.log(error);
    }
  };
  //user insert
  static userinsert = async (req, res) => {
    try {
      // console.log(req.body);
      const { name, email, password, confirmPassword } = req.body;

      if (!name || !email || !password || !confirmPassword) {
        req.flash("error", "All fields are Required.");
        return res.redirect("/register");
      }
      const isEmail = await UserModel.findOne({ email });
      if (isEmail) {
        req.flash("error", "Email Already Exists.");
        return res.redirect("/register");
      }
      if (password != confirmPassword) {
        req.flash("error", "Password does not match.");
        return res.redirect("/register");
      }

      // image UpLoad
      // console.log(req.files.image);
      const file = req.files.image;
      const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "userprofile",
      });
      // console.log(imageUpload)

      // bcrypt Password
      const hashpassword = await bcrypt.hash(password, 10);

      const data = await UserModel.create({
        name,
        email,
        password: hashpassword,
        image: {
          public_id: imageUpload.public_id,
          url: imageUpload.secure_url,
        },
      });
      req.flash("success", "Register Successfully ! Please login here");
      res.redirect("/"); //route **web
    } catch {
      console.log("error");
    }
  };

  //verify Login
  static verifyLogin = async (req, res) => {
    try {
      // console.log(req.body);
      const { email, password } = req.body;

      // if (!email || !password) {
      //   req.flash("error", "All fields Are Required.");
      //   return res.redirect("/");
      // }
      const user = await UserModel.findOne({ email });
      // console.log(user)
      if (!user) {
        req.flash("error", "You Are not Register User");
        return res.redirect("/");
      } else {
        const isMatch = await bcrypt.compare(password, user.password);
        // console.log(isMatch)
        if (isMatch) {
          const token = jwt.sign(
            { ID: user.id },
            "smjdhc7w8e2wufwoivr8934wr235w"
          );
          // console.log(token);
          res.cookie("token", token);
          return res.redirect("/home");
        } else {
          req.flash("error", "Email or Password does't Match");
          return res.redirect("/");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // logout
  static logout = async (req, res) => {
    try {
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = FrontController;
