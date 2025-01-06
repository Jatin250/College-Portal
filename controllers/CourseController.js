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
}

module.exports = CourseController;
