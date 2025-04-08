const express = require("express");
const app = express();
const port = 3000;
const web = require("./routes/web");
const connectDb = require("./database/connectDb");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");

// get token from cookie
app.use(cookieParser());

// image
app.use(fileupload({ useTempFiles: true }));

// connect-flash and express-session
const session = require("express-session");
const flash = require("connect-flash");

//message
app.use(
  session({
    secret: "secret",
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
  })
);
//flash message
app.use(flash());

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// connect database
connectDb();

// link css image
app.use(express.static("public"));

// view ejs set
app.set("view engine", "ejs");

// route load
app.use("/", web);
// server start
app.listen(port, () => {
  console.log(`Server start localhost:${port}`);
});
