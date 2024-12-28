const {
  tryError,
  handel_validation_errors,
  removeImg,
  Rename_uploade_img,
  returnWithMessage,
} = require("../../Helper/helper");
const { validationResult } = require("express-validator");
const DisabilityModel = require("../../models/disability");
const UserModel = require("../../models/users");


const AllDisabilityController = async (req, res, next) => {
  try {
    const disability = await DisabilityModel.findAll();
    res.render("backEnd/disability/showAll", {
      title: "All Disability",
      URL: req.url,
      notification: req.flash("notification")[0],
      admin: req.cookies.Admin,
      disability: disability,
    });
  } catch (error) {
    tryError(res, error);
  }
};

const addDisabilityController = async (req, res, next) => {
  try {
    res.render("backEnd/disability/addDisability", {
      title: "add Disability",
      URL: req.url,
      notification: req.flash("notification")[0],
      validationError: req.flash("validationError")[0],
      admin: req.cookies.Admin,
    });
  } catch (error) {
    tryError(res, error);
  }
};

const addDisabilityControllerPost = async (req, res, next) => {
  try {
    const errors = validationResult(req).errors;
    if (errors.length > 0) {
      handel_validation_errors(req, res, errors, "/dashboard/addDisability");
      removeImg(req);
      return;
    }

    var file = Rename_uploade_img(req);
    req.body.image = file;
    req.body.active = true;
    await DisabilityModel.create(req.body);
    returnWithMessage(
      req,
      res,
      "dashboard/addDisability",
      "تم اضافه اعاقه جديده بنجاح",
      "success"
    );
  } catch (error) {
    tryError(res, error);
  }
};

const EditDisabilityController = async (req, res, next) => {
  try {
    const disability = await DisabilityModel.findById(req.params.id);

    res.render("backEnd/disability/editDisable", {
      title: "edit User",
      URL: req.url,
      notification: req.flash("notification")[0],
      admin: req.cookies.Admin,
      disability,
      validationError: req.flash("validationError")[0],
    });
  } catch (error) {
    tryError(res, error);
  }
};
const EditdisabilityControllerPost = async (req, res, next) => {
  try {
    var errors = validationResult(req).errors;
    if (errors.length > 0) {
      removeImg(req);
      handel_validation_errors(
        req,
        res,
        errors,
        "dashboard/EditDisability/" + req.params.id
      );
      return;
    }

    var file = Rename_uploade_img(req);
    if (file) {
      removeImg(req, "disabilityImage/", req.body.OlduserImage);
      req.body.image = file;
    } else {
      req.body.image = req.body.OlduserImage;
    }
    req.body.active = req.body.active ? true : false;
    await DisabilityModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    returnWithMessage(
      req,
      res,
      "dashboard/EditDisability/" + req.params.id,
      "تم تعديل الببنات بنجاح",
      "success"
    );
  } catch (error) {
    tryError(res, error);
  }
};

const activeDisability = async (req, res, next) => {
  try {
    await DisabilityModel.findByIdAndUpdate(
      req.params.id,
      { active: req.query.isActive === "true" ? false : true },
      { new: true }
    );

    returnWithMessage(
      req,
      res,
      "dashboard/AllDisability",
      req.query.isActive == "false"
        ? "تم التفعيل بنجاح"
        : "تم الغاء التفعيل بنجاح",
      "success"
    );
  } catch (error) {
    tryError(res, error);
  }
};

const deleteDisability = async (req, res, next) => {
  try {
    await DisabilityModel.findByIdAndDelete(req.params.id);
    removeImg(req, "disabilityImage/", req.body.oldImage);
    returnWithMessage(
      req,
      res,
      "dashboard/AllDisability",
      "تم الحذف بنجاح",
      "danger"
    );
  } catch (error) {
    tryError(res, error);
  }
};

const activeDisable = async (req, res, next) => {
  try {
    await UserModel.findByIdAndUpdate(
      req.params.id,
      { active: req.query.isActive === "true" ? false : true },
      { new: true }
    );

    returnWithMessage(
      req,
      res,
      "dashboard/allUsers",
      req.query.isActive == "false"
        ? "تم التفعيل بنجاح"
        : "تم الغاء التفعيل بنجاح",
      "success"
    );
  } catch (error) {
    tryError(res, error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    await UserModel.findByIdAndDelete(req.params.id);

    removeImg(req, "users/", req.body.oldImage);
    returnWithMessage(
      req,
      res,
      "dashboard/allUsers",
      "تم الحذف بنجاح",
      "danger"
    );
  } catch (error) {
    tryError(res, error);
  }
};

module.exports = {
  AllDisabilityController,
  addDisabilityController,
  EditdisabilityControllerPost,
  EditDisabilityController,
  addDisabilityControllerPost,
  activeDisability,
  deleteDisability,
};
