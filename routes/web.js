const express = require("express");
const FrontController = require("../controllers/FrontController");
const route = express.Router();
const checkAuth = require("../middleware/auth");
const CourseController = require("../controllers/CourseController");

// route
route.get("/", FrontController.login);
route.get("/home", checkAuth, FrontController.home);
route.get("/about", checkAuth, FrontController.about);
route.get("/contact", checkAuth, FrontController.contact);
route.get("/register", FrontController.register);
route.post("/userinsert", FrontController.userinsert);
route.post("/verifyLogin", FrontController.verifyLogin);
route.get("/logout", FrontController.logout);

// course
route.post("/course_insert", checkAuth, CourseController.createCourse);
route.get("/courseDisplay", checkAuth, CourseController.courseDisplay);
route.get("/ViewCourse/:id", checkAuth, CourseController.ViewCourse);
route.get("/EditCourse/:id", checkAuth, CourseController.EditCourse);
route.get("/DeleteCourse/:id", checkAuth, CourseController.DeleteCourse);

module.exports = route;
