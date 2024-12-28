const {
    tryError,
    handel_validation_errors,
    removeImg,
    Rename_uploade_img,
    returnWithMessage,
    removeImgFiled,
    Rename_uploade_img_multiFild,
    removeFiles,
} = require("../../Helper/helper");
const Testing = require("../../models/testing");
const Section = require("../../models/sections");
const Question = require("../../models/question");

const { validationResult } = require("express-validator");

const AllTestingController = async (req, res, next) => {
    try {
        const testing = await Testing.find()
        res.render("backEnd/testing/showAll", {
            title: "All Testing",
            URL: req.url,
            notification: req.flash("notification")[0],
            admin: req.cookies.Admin,
            Testing: testing,
        });
    } catch (error) {
        tryError(res, error);
    }
};

const addTestingController = async (req, res, next) => {
    try {
        const sections = await Section.find();
        res.render("backEnd/testing/addTesting", {
            title: "add Testing",
            URL: req.url,
            notification: req.flash("notification")[0],
            validationError: req.flash("validationError")[0],
            admin: req.cookies.Admin,
            sections,
        });
    } catch (error) {
        tryError(res, error);
    }
};

const addTestingControllerPost = async (req, res) => {
    try {
        const { examName, examType, questions } = req.body;

        const newExam = await Testing.create({ name: examName, type: examType });
        if (questions && typeof questions === 'object' && Object.keys(questions).length > 0) {
            const sectionPromises = Object.entries(questions).map(async ([sectionId, sectionQuestions]) => {
                const questionPromises = sectionQuestions.map(async (questionData) => {
                    return await Question.create({
                        ...questionData,
                        section: sectionId,
                        exam: newExam._id, 
                    });
                });
                return await Promise.all(questionPromises);
            });

            // انتظار إنشاء جميع الأسئلة
            await Promise.all(sectionPromises);
        }

        // إرسال استجابة بالنجاح
        res.status(201).json({
            success: true,
            message: "Exam and questions created successfully.",
            examId: newExam._id,
        });
    } catch (error) {
        console.error("Error creating exam:", error);

        // إرسال استجابة بالخطأ
        res.status(500).json({
            success: false,
            message: "An error occurred while creating the exam.",
        });
    }
};

const EditTestingController = async (req, res, next) => {
    try {
        const Testing = await Testing.findOne({
            where: {
                id: req.params.id,
            },
        });
        const disability = await DisabilityModel.findAll({
            where: {
                active: true,
            },
        });
        res.render("backEnd/testing/editTesting", {
            title: "edit Testing",
            URL: req.url,
            notification: req.flash("notification")[0],
            admin: req.cookies.Admin,
            Testing,
            validationError: req.flash("validationError")[0],
            disability,
        });
    } catch (error) {
        tryError(res, error);
    }
};

const EditTestingControllerPost = async (req, res, next) => {
    try {
        var errors = validationResult(req).errors;
        if (errors.length > 0) {
            handel_validation_errors(
                req,
                res,
                errors,
                "dashboard/EditTesting/" + req.params.id
            );
            return;
        }
        req.body.active = req.body.active ? true : false;
        req.body.exam = req.body.exam.split(",");
        await Testing.update(req.body, {
            where: {
                id: req.params.id,
            },
        });
        returnWithMessage(
            req,
            res,
            "dashboard/EditTesting/" + req.params.id,
            "تم تعديل الببنات بنجاح",
            "success"
        );
    } catch (error) {
        tryError(res, error);
    }
};

const activeTesting = async (req, res, next) => {
    try {
        console.log(req.params.id)
        console.log(req.query.isActive)
        await Testing.updateOne({_id: req.params.id} , { active: req.query.isActive == "true" ? false : true });
        res.status(200).json({
            success: true,
            message: `Exam is ${req.query.isActive == "true" ? "dis active" : "active"}`,
        });
    } catch (error) {
        tryError(res, error);
    }
};

const deleteTesting = async (req, res, next) => {
    try {
        const exam = await Testing.findById(req.params.id);
        if (!exam) {
            return res.status(404).json({
                success: false,
                message: "Exam not found.",
            });
        }

        const questions = await Question.find({ exam: req.params.id });

        const fileDeletionPromises = questions.map((question) => {
            if (question.file) {
                console.log(question.file)
                return removeFiles(req, question.file); 
            }
            return Promise.resolve(); 
        });

        await Promise.all([
            Promise.all(fileDeletionPromises), 
            Question.deleteMany({ exam: req.params.id }), 
            Testing.findByIdAndDelete(req.params.id), 
        ]);

        res.status(200).json({
            success: true,
            message: "Exam and associated questions deleted successfully.",
        });
    } catch (error) {
        console.error("Error deleting exam:", error);

        res.status(500).json({
            success: false,
            message: "An error occurred while deleting the exam.",
        });
    }
};




module.exports = {
    AllTestingController,
    addTestingController,
    EditTestingControllerPost,
    EditTestingController,
    addTestingControllerPost,
    activeTesting,
    deleteTesting,
};
