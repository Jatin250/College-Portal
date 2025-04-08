const mongoose = require("mongoose");
const local_url = "mongodb://localhost:27017/CollegePortal";

const live_url =
  "mongodb+srv://jatinpal25072002:Jatin1234@cluster0.fk1wz.mongodb.net/CollegePortal?retryWrites=true&w=majority&appName=Cluster0";

const connectDb = () => {
  return mongoose
    .connect(live_url)
    .then(() => {
      console.log("Connect");
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = connectDb;
