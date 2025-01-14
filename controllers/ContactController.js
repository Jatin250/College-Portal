const ContactModel = require("../models/contact");

class ContactController {
  // contactByUser
  static contactByUser = async (req, res) => {
    try {
      //   console.log(req.body);
      const { firstName, lastName, userName, email, address } = req.body;

      if (!firstName || !lastName || !userName || !email || !address) {
        req.flash("error", "All fields are Required.");
        return res.redirect("/contact");
      }

      const contactData = await ContactModel.create({
        firstName,
        lastName,
        userName,
        email,
        address,
      });
      req.flash("success", "Submitted Successfully !");
      res.redirect("/contact");
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = ContactController;
