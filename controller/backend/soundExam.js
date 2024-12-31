const { validationResult } = require("express-validator");
const {
    tryError,
    handel_validation_errors,
    removeImg,
    returnWithMessage,
    removeImgFiled,
    Rename_uploade_img_multiFild
} = require("../../Helper/helper");
const SoundExamModel = require("../../models/soundexam");

const AllSoundController = async (req, res, next) => {
    try {
        const SoundExam = await SoundExamModel.find()
        .populate({
          path: 'disability', // مرجع إلى disability
          model: 'Disability',
          as: 'soundDisability',
        });
        res.render("backEnd/soundExam/showAll", {
            title: "All SoundExam",
            URL: req.url,
            notification: req.flash("notification")[0],
            validationError: req.flash("validationError")[0],
            admin: req.cookies.Admin,
            SoundExam,
        });
    } catch (error) {
        tryError(res, error);
    }
};

const addSoundController = async (req, res, next) => {
    try {
        res.render("backEnd/soundExam/addSound", {
            title: "add SoundExam",
            URL: req.url,
            notification: req.flash("notification")[0],
            validationError: req.flash("validationError")[0],
            admin: req.cookies.Admin,
        });
    } catch (error) {
        tryError(res, error);
    }
};

const EditSoundController = async (req, res, next) => {
    try {
        const sound = await SoundExamModel.findById(req.params.id);
        res.render("backEnd/soundExam/EditSound", {
            title: "update sound",
            URL: req.url,
            notification: req.flash("notification")[0],
            validationError: req.flash("validationError")[0],
            admin: req.cookies.Admin,
            sound,
        });
    } catch (error) {
        tryError(res);
    }
};

const addSoundControllerPost = async (req, res, next) => {
    try {
        var errors = validationResult(req).errors;
        if (errors.length > 0) {
            removeImgFiled([req.files.image, req.files.pdf]);
            handel_validation_errors(req, res, errors, "/dashboard/addSound");
            return;
        }
        var files = Rename_uploade_img_multiFild([
            req.files.image,
            req.files.pdf,
        ]);
        req.body.image = files.image ? files.image : null;
        req.body.pdf = files.pdf ? files.pdf : null;
        req.body.active = true;
        req.body.otherDisabilities = req.body.otherDisabilities
            ? req.body.otherDisabilities.length == 1
                ? req.body.otherDisabilities.split(",")
                : req.body.otherDisabilities
            : [];
        req.body.isOther = req.body.isOther ? true : false;

        await SoundExamModel.create(req.body);
        returnWithMessage(
            req,
            res,
            "/dashboard/AllSound",
            "تم اضافه ملف شرح الصوت بنجاح",
            "success"
        );
    } catch (error) {
        tryError(res, error);
    }
};

const EditSoundControllerPost = async (req, res, next) => {
    try {
        var errors = validationResult(req).errors;
        if (errors.length > 0) {
            removeImgFiled([req.files.image, req.files.pdf]);
            handel_validation_errors(
                req,
                res,
                errors,
                "dashboard/EditSound/" + req.params.id
            );
            return;
        }
        var files = Rename_uploade_img_multiFild([
            req.files.image,
            req.files.pdf,
        ]);
        if (files.image) removeImg(req, "sound/", req.body.oldImage);
        if (files.pdf) removeImg(req, "sound/", req.body.oldPdf);
        req.body.pdf = files.pdf ? files.pdf : req.body.oldPdf;
        req.body.image = files.image ? files.image : req.body.oldImage;
        req.body.active = req.body.active ? true : false;
        req.body.otherDisabilities = req.body.otherDisabilities
            ? req.body.otherDisabilities.length == 1
                ? req.body.otherDisabilities.split(",")
                : req.body.otherDisabilities
            : [];
        req.body.isOther = req.body.isOther ? true : false;
        await SoundExamModel.findByIdAndUpdate(req.params.id, req.body, { new: true });

        returnWithMessage(
            req,
            res,
            "dashboard/EditSound/" + req.params.id,
            "تم تعديل ملف شرح الصوت بنجاح",
            "success"
        );
    } catch (error) {
        tryError(res, error);
    }
};

const activeSound = async (req, res, next) => {
    try {
        await SoundExamModel.findByIdAndUpdate(
            req.params.id,
            { active: req.query.isActive === "true" ? false : true },
            { new: true }
          );

        returnWithMessage(
            req,
            res,
            "dashboard/AllSound",
            req.query.isActive == "false"
                ? "تم التفعيل بنجاح"
                : "تم الغاء التفعيل بنجاح",
            "success"
        );
    } catch (error) {
        tryError(res, error);
    }
};

const deleteSound = async (req, res, next) => {
    try {
        await SoundExamModel.findByIdAndDelete(req.params.id);
        removeImg(req, "sound/", req.body.oldImage);
        if (req.body.oldPdf) removeImg(req, "sound/", req.body.oldPdf);
        returnWithMessage(
            req,
            res,
            "dashboard/AllSound",
            "تم الحذف بنجاح",
            "danger"
        );
    } catch (error) {
        tryError(res, error);
    }
};

module.exports = {
    addSoundController,
    EditSoundController,
    EditSoundControllerPost,
    addSoundControllerPost,
    AllSoundController,
    activeSound,
    deleteSound,
};
