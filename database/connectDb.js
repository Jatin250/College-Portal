const mongoose = require("mongoose");
const local_url = "mongodb://localhost:27017/collegePortal";

const connectDb = () => {
  return mongoose
    .connect(local_url)
    .then(() => {
      console.log("connect");
    })
    .catch((error) => {
      console.log(error);
    });
};
module.exports = connectDb;
