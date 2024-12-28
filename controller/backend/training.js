const {
    tryError,
    handel_validation_errors,
    removeImg,
    Rename_uploade_img,
    returnWithMessage,
    removeImgFiled,
    Rename_uploade_img_multiFild,
} = require("../../Helper/helper");
const TrainingModel = require("../../models/training");
const DisabilityModel = require("../../models/disability");
const SectionsModel = require("../../models/sections");


const { validationResult } = require("express-validator");

const AllTrainingController = async (req, res, next) => {
    try {
        const Training = await TrainingModel.find()
        .populate({
          path: 'disability', // مرجع إلى disability
          model: 'Disability',
          as: 'trainingDisability',
          select: 'name', // تحديد الحقول المراد جلبها
        });

        res.render("backEnd/training/showAll", {
            title: "All Training",
            URL: req.url,
            notification: req.flash("notification")[0],
            admin: req.cookies.Admin,
            Training: Training,
        });
    } catch (error) {
        tryError(res, error);
    }
};

const addTrainingController = async (req, res, next) => {
    try {
        const disability = await DisabilityModel.find({ active: true });
        const sections = await SectionsModel.find();

        res.render("backEnd/training/addTraining", {
            title: "add Training",
            URL: req.url,
            notification: req.flash("notification")[0],
            validationError: req.flash("validationError")[0],
            admin: req.cookies.Admin,
            disability,
            sections,
        });
    } catch (error) {
        tryError(res, error);
    }
};

const addTrainingControllerPost = async (req, res, next) => {
    try {
        const errors = validationResult(req).errors;
        if (errors.length > 0) {
            handel_validation_errors(req, res, errors, "/dashboard/addTraining");
            removeImgFiled([req.files.image, req.files.video]);
            return;
        }

        var file = Rename_uploade_img_multiFild([
            req.files.image,
            req.files.video,
        ]);
        req.body.image = file.image ? file.image : "";
        req.body.video = file.video ? file.video : "";
        req.body.active = true;
        req.body.otherDisabilities = req.body.otherDisabilities
            ? req.body.otherDisabilities.length == 1
                ? req.body.otherDisabilities.split(",")
                : req.body.otherDisabilities
            : [];
        req.body.isOther = req.body.isOther ? true : false;
        await TrainingModel.create(req.body);
        returnWithMessage(
            req,
            res,
            "/dashboard/addTraining",
            "تم اضافه تدريب جديده بنجاح",
            "success"
        );
    } catch (error) {
        tryError(res, error);
    }
};

const EditTrainingController = async (req, res, next) => {
    try {
        const Training = await TrainingModel.findOne({
            where: {
                id: req.params.id,
            },
        });
        const disability = await TrainingModel.findAll({
            where: {
                active: true,
            },
        });
        res.render("backEnd/training/editTraining", {
            title: "edit Training",
            URL: req.url,
            notification: req.flash("notification")[0],
            admin: req.cookies.Admin,
            Training,
            validationError: req.flash("validationError")[0],
            disability,
        });
    } catch (error) {
        tryError(res, error);
    }
};

const EditTrainingControllerPost = async (req, res, next) => {
    try {
        var errors = validationResult(req).errors;
        if (errors.length > 0) {
            removeImgFiled([req.files.image, req.files.video]);
            handel_validation_errors(
                req,
                res,
                errors,
                "/dashboard/EditTraining/" + req.params.id
            );
            return;
        }

        var files = Rename_uploade_img_multiFild([
            req.files.image,
            req.files.video,
        ]);
        if (files.image) {
            removeImg(req, "trainingImage/", req.body.oldImage);
            req.body.image = files.image;
        } else {
            req.body.image = req.body.OlduserImage;
        }
        if (files.video) {
            if (req.body.oldVideo)
                removeImg(req, "trainingImage/", req.body.oldVideo);
            req.body.video = files.video;
        } else {
            req.body.video = req.body.oldVideo;
        }
        req.body.active = req.body.active ? true : false;
        req.body.otherDisabilities = req.body.otherDisabilities
            ? req.body.otherDisabilities.length == 1
                ? req.body.otherDisabilities.split(",")
                : req.body.otherDisabilities
            : [];
        req.body.isOther = req.body.isOther ? true : false;
        await Training.findByIdAndUpdate(req.params.id, req.body, { new: true });
        returnWithMessage(
            req,
            res,
            "/dashboard/EditTraining/" + req.params.id,
            "تم تعديل الببنات بنجاح",
            "success"
        );
    } catch (error) {
        tryError(res, error);
    }
};

const activeTraining = async (req, res, next) => {
    try {
        await Training.findByIdAndUpdate(
            req.params.id,
            { active: req.query.isActive === "true" ? false : true },
            { new: true }
          );

        returnWithMessage(
            req,
            res,
            "/dashboard/AllTraining",
            req.query.isActive == "false"
                ? "تم التفعيل بنجاح"
                : "تم الغاء التفعيل بنجاح",
            "success"
        );
    } catch (error) {
        tryError(res, error);
    }
};

const deleteTraining = async (req, res, next) => {
    try {
        await Training.findByIdAndDelete(req.params.id);
        removeImg(req, "trainingImage/", req.body.oldImage);
        if (req.body.oldVideo)
            removeImg(req, "trainingImage/", req.body.oldVideo);
        returnWithMessage(
            req,
            res,
            "/dashboard/AllTraining",
            "تم الحذف بنجاح",
            "danger"
        );
    } catch (error) {
        tryError(res, error);
    }
};

module.exports = {
    AllTrainingController,
    addTrainingController,
    EditTrainingControllerPost,
    EditTrainingController,
    addTrainingControllerPost,
    activeTraining,
    deleteTraining,
};
