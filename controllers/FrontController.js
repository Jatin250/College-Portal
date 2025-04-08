const UserModel = require("../models/user");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary");
const jwt = require("jsonwebtoken");
const CourseModel = require("../models/course");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");

// configuration Setup
cloudinary.config({
  cloud_name: "dkpr89ars",
  api_key: "525114599641279",
  api_secret: "T96YdvUrKMsDhb1vxfsux2sbftA",
});

class FrontController {
  static home = async (req, res) => {
    try {
      const { name, image, email, id } = req.udata;
      const btech = await CourseModel.findOne({ user_id: id, course: "btech" });
      const bca = await CourseModel.findOne({ user_id: id, course: "bca" });
      const mca = await CourseModel.findOne({ user_id: id, course: "mca" });
      // console.log(btech)
      res.render("home", {
        n: name,
        i: image,
        e: email,
        btech: btech,
        bca: bca,
        mca: mca,
      });
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
      res.render("contact", {
        n: name,
        i: image,
        msg: req.flash("success"),
        msg1: req.flash("error"),
      });
    } catch (error) {
      console.log(error);
    }
  };

  static register = async (req, res) => {
    try {
      res.render("register", {
        msg: req.flash("error"),
        msg1: req.flash("success"),
      });
    } catch (error) {
      console.log(error);
    }
  };

  //user insert
  static userinsert = async (req, res) => {
    try {
      // console.log(req.body);
      const { name, email, password, confirmpassword } = req.body;

      if (!name || !email || !password || !confirmpassword) {
        req.flash("error", "All fields are Required.");
        return res.redirect("/register");
      }
      const isEmail = await UserModel.findOne({ email });
      if (isEmail) {
        req.flash("error", "Email Already Exists.");
        return res.redirect("/register");
      }
      if (password != confirmpassword) {
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
      if (data) {
        this.sendVerifymail(name, email, data.id);
        req.flash("success", "Your Register Success, Plz verify mail");
        res.redirect("/register");
      } else {
        req.flash("error", "not found");
        req.redirect("/register");
      }
      // req.flash("success", "Register Successfully ! Please login here");
      // res.redirect("/"); //route **web
    } catch {
      console.log("error");
    }
  };

  static sendVerifymail = async (name, email, user_id) => {
    //console.log(name, email, user_id);
    // connenct with the smtp server

    let transporter = await nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,

      auth: {
        user: "jatinpal25072002@gmail.com",
        pass: "alxy hksk zmnl verb",
      },
    });
    let info = await transporter.sendMail({
      from: "test@gmail.com", // sender address
      to: email, // list of receivers
      subject: "For Verification mail", // Subject line
      text: "heelo", // plain text body
      html:
        "<p>Hii " +
        name +
        ',Please click here to <a href="http://localhost:3000/register/verify?id=' +
        user_id +
        '">Verify</a>Your mail</p>.',
    });
    //console.log(info);
  };

  static verifyMail = async (req, res) => {
    try {
      //console.log(req.query.id)
      const updateinfo = await UserModel.findByIdAndUpdate(req.query.id, {
        is_verify: 1,
      });
      // console.log(updateinfo);
      if (updateinfo) {
        let token = jwt.sign({ ID: updateinfo.id }, "sdjhdjwcdsk");
        //console.log(token)middleware
        res.cookie("token", token, token, {
          httpOnly: true,
          secure: true,
          maxAge: 3600000,
        });
        res.redirect("/home");
      }
    } catch (error) {
      console.log(error);
    }
  };

  //verify Login
  static verifyLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (email && password) {
        const user = await UserModel.findOne({ email: email });
        if (user != null) {
          const isMatched = await bcrypt.compare(password, user.password);
          //  console.log(isMatched)
          if (isMatched) {
            if (user.role == "admin" && user.is_verify == 1) {
              //token create
              var jwt = require("jsonwebtoken");
              let token = jwt.sign({ ID: user.id }, "sdjhdjwcdsk");
              //console.log(token)middleware
              res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                maxAge: 3600000,
              });
              res.redirect("/admin/dashboard");
            } else if (user.role == "student" && user.is_verify == 1) {
              //token create
              var jwt = require("jsonwebtoken");
              let token = jwt.sign({ ID: user.id }, "sdjhdjwcdsk");
              //console.log(token)middleware
              // res.cookie('token', token,{maxAge: 60000});
              res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                maxAge: 3600000, // Expires in 1 hrs
              });
              if (req.session) {
                req.session.destroy((err) => {
                  if (err) {
                    console.error("Error destroying session:", err);
                  }
                });
              }
              res.redirect("/home");
            } else {
              req.flash("error", "Please verify your Email.");
              return res.redirect("/");
            }
          } else {
            req.flash("error", "Email and Password is not correct.");
            return res.redirect("/");
          }
        } else {
          req.flash("error", "you are not a register user");
          return res.redirect("/");
        }
      } else {
        req.flash("error", "All fields Required");
        return res.redirect("/");
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

  // profile
  static profile = async (req, res) => {
    try {
      const { name, image, email } = req.udata;
      res.render("profile", {
        n: name,
        i: image,
        e: email,
        msg: req.flash("error"),
        msg1: req.flash("success"),
      });
    } catch (error) {
      console.log(error);
    }
  };

  // changePassword
  static changePassword = async (req, res) => {
    try {
      const { id } = req.udata;
      // console.log(req.body);
      const { op, np, cp } = req.body;
      if (op && np && cp) {
        const user = await UserModel.findById(id);
        const isMatched = await bcrypt.compare(op, user.password);
        //console.log(isMatched)
        if (!isMatched) {
          req.flash("error", "Current password is incorrect ");
          res.redirect("/profile");
        } else {
          if (np != cp) {
            req.flash("error", "Password does not match");
            res.redirect("/profile");
          } else {
            const newHashPassword = await bcrypt.hash(np, 10);
            await UserModel.findByIdAndUpdate(id, {
              password: newHashPassword,
            });
            req.flash("success", "Password Updated successfully ");
            res.redirect("/");
          }
        }
      } else {
        req.flash("error", "ALL fields are required ");
        res.redirect("/profile");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // updateProfile
  static updateProfile = async (req, res) => {
    try {
      const { id } = req.udata;
      const { name, email } = req.body;
      if (req.files) {
        const user = await UserModel.findById(id);
        const imageID = user.image.public_id;
        // console.log(imageID);

        //deleting image from Cloudinary
        await cloudinary.uploader.destroy(imageID);
        //new image update
        const imagefile = req.files.image;
        const imageupload = await cloudinary.uploader.upload(
          imagefile.tempFilePath,
          {
            folder: "userprofile",
          }
        );
        var data = {
          name: name,
          email: email,
          image: {
            public_id: imageupload.public_id,
            url: imageupload.secure_url,
          },
        };
      } else {
        var data = {
          name: name,
          email: email,
        };
      }
      await UserModel.findByIdAndUpdate(id, data);
      req.flash("success", "Update Profile successfully");
      res.redirect("/profile");
    } catch (error) {
      console.log(error);
    }
  };

  // forgot_Password
  static forgetPasswordVerify = async (req, res) => {
    try {
      const { email } = req.body;
      const userData = await UserModel.findOne({ email: email });
      //console.log(userData)
      if (userData) {
        const randomString = randomstring.generate();
        await UserModel.updateOne(
          { email: email },
          { $set: { token: randomString } }
        );
        this.sendEmail(userData.name, userData.email, randomString);
        req.flash("success", "Plz Check Your mail to reset Your Password!");
        res.redirect("/");
      } else {
        req.flash("error", "You are not a registered Email");
        res.redirect("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  static sendEmail = async (name, email, token) => {
    // console.log(name,email,status,comment)
    // connenct with the smtp server

    let transporter = await nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,

      auth: {
        user: "jatinpal25072002@gmail.com",
        pass: "alxy hksk zmnl verb",
      },
    });
    let info = await transporter.sendMail({
      from: "test@gmail.com", // sender address
      to: email, // list of receivers
      subject: "Reset Password", // Subject line
      text: "heelo", // plain text body
      html:
        "<p>Hii " +
        name +
        ',Please click here to <a href="https://college-portal-project.onrender.com/reset-password?token=' +
        token +
        '">Reset</a>Your Password.',
    });
  };

  static reset_Password = async (req, res) => {
    try {
      const token = req.query.token;
      const tokenData = await UserModel.findOne({ token: token });
      if (tokenData) {
        res.render("reset-password", { user_id: tokenData._id });
      } else {
        res.render("404");
      }
    } catch (error) {
      console.log(error);
    }
  };

  static reset_Password1 = async (req, res) => {
    try {
      const { password, user_id } = req.body;
      const newHashPassword = await bcrypt.hash(password, 10);
      await UserModel.findByIdAndUpdate(user_id, {
        password: newHashPassword,
        token: "",
      });
      req.flash("success", "Reset Password Updated successfully ");
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = FrontController;
