const express = require("express");
const FrontController = require("../controllers/FrontController");
const route = express.Router();

// route
route.get("/", FrontController.login);
route.get("/home", FrontController.home);
route.get("/about", FrontController.about);
route.get("/contact", FrontController.contact);
route.get("/register", FrontController.register);
route.post("/userinsert", FrontController.userinsert);
route.post("/verifyLogin", FrontController.verifyLogin);

module.exports = route;
