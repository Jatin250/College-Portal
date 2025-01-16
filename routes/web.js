const express = require("express");
const FrontController = require("../controllers/FrontController");
const route = express.Router();
const checkAuth = require("../middleware/auth");
const CourseController = require("../controllers/CourseController");
const ContactController = require("../controllers/ContactController");
const AdminController = require("../controllers/admin/AdminController");

// route
route.get("/", FrontController.login);
route.get("/home", checkAuth, FrontController.home);
route.get("/about", checkAuth, FrontController.about);
route.get("/contact", checkAuth, FrontController.contact);
route.get("/register", FrontController.register);
route.post("/userinsert", FrontController.userinsert);
route.post("/verifyLogin", FrontController.verifyLogin);
route.get("/logout", FrontController.logout);

// profile
route.get("/profile", checkAuth, FrontController.profile);
route.post("/changePassword", checkAuth, FrontController.changePassword);
route.post("/updateProfile", checkAuth, FrontController.updateProfile);

// course
route.post("/course_insert", checkAuth, CourseController.createCourse);
route.get("/courseDisplay", checkAuth, CourseController.courseDisplay);
route.get("/ViewCourse/:id", checkAuth, CourseController.ViewCourse);
route.get("/EditCourse/:id", checkAuth, CourseController.EditCourse);
route.get("/DeleteCourse/:id", checkAuth, CourseController.DeleteCourse);
route.post("/courseUpdate/:id", checkAuth, CourseController.courseUpdate);

// contactByUser
route.post("/contactByUser", checkAuth, ContactController.contactByUser);

// adminController
route.get("/admin/dashboard", checkAuth, AdminController.dashboard);

module.exports = route;
