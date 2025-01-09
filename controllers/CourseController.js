const CourseModel = require("../models/course");

class CourseController {
  static createCourse = async (req, res) => {
    try {
      // console.log(req.body);
      // const course = await CourseModel.create(req.body)
      const { id } = req.udata;
      const { name, email, phone, dob, address, gender, education, course } =
        req.body;
      await CourseModel.create({
        name,
        email,
        phone,
        dob,
        address,
        gender,
        education,
        course,
        user_id: id,
      });
      res.redirect("/courseDisplay");
    } catch (error) {
      console.log(error);
    }
  };
  static courseDisplay = async (req, res) => {
    try {
      // res.send("display");
      const { id, name, image } = req.udata;
      const course = await CourseModel.find({ user_id: id });
      // console.log(course);
      res.render("course/display", { c: course, n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };
  static ViewCourse = async (req, res) => {
    try {
      const { name, image } = req.udata;
      const id = req.params.id;
      // console.log(id);
      const course = await CourseModel.findById(id);
      // console.log(course);
      res.render("course/view", { n: name, i: image, c: course });
    } catch (error) {
      console.log(error);
    }
  };
  static EditCourse = async (req, res) => {
    try {
      const { name, image } = req.udata;
      const id = req.params.id;
      // console.log(id);
      const course = await CourseModel.findById(id);
      // console.log(course);
      res.render("course/view", { n: name, i: image, c: course });
    } catch (error) {
      console.log(error);
    }
  };
  static DeleteCourse = async (req, res) => {
    try {
      const { name, image } = req.udata;
      const id = req.params.id;
      // console.log(id);
      const course = await CourseModel.findByIdAndDelete(id);
      // console.log(course);
      res.render("course/view", { n: name, i: image, c: course });
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = CourseController;
