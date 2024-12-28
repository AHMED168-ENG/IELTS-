const { tryError } = require("../../Helper/helper");
const User = require("../../models/users");
const Disability = require("../../models/disability");
const Testing = require("../../models/testing");
const Training = require("../../models/training");

const dashpord_page_controller = async (req, res, next) => {
    try {
        var users = await User.find({});
        var disability = await Disability.find({});
        var testing = await Testing.find({});
        var training = await Training.find({});

        res.render("backEnd/dashboard", {
            title: "dashboard",
            URL: req.url,
            users,
            disability,
            Testing :testing,
            training,
            notification: req.flash("notification")[0],
            admin: req.cookies.Admin,
        });
    } catch (error) {
        tryError(res, error);
    }
};

module.exports = {
    dashpord_page_controller,
};
