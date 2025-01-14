const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      Required: true,
    },
    lastName: {
      type: String,
      Required: true,
    },
    userName: {
      type: String,
      Required: true,
    },
    email: {
      type: String,
      Required: true,
    },
    address: {
      type: String,
      Required: true,
    },
  },
  { timestamps: true }
); //jb ham insert krege to 2 field dega createdadd -->date time btyegi or update
const ContactModel = mongoose.model("contact", ContactSchema);
module.exports = ContactModel;
