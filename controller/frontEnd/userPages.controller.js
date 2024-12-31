const {
    tryError,
    returnWithMessage,
    handel_validation_errors,
    Rename_uploade_img,
    removeImg,
} = require("../../Helper/helper");
const UsersResultModel = require("../../models/usersresult");
const UserJoinExam = require("../../models/userJoinExam");
const TrainingModel = require("../../models/training");
const BookModel = require("../../models/books");
const GuideLinesModel = require("../../models/guidelines");
const Testing = require("../../models/testing");
const Section = require("../../models/sections");
const ContactUsModel = require("../../models/guidelines");

const paginate = require("express-paginate");
const { validationResult } = require("express-validator");

const bcrypt = require("bcrypt");
const { sendEmail } = require("../../emails/sendEmails");
const { default: mongoose } = require("mongoose");
const homePage = async (req, res, next) => {
    try {
        res.render("frontEnd/userPage/homePage", {
            title: "home",
            URL: req.url,
            notification: req.flash("notification")[0],
            user: req.cookies.User,
        });
    } catch (error) {
        tryError(res, error);
    }
};

const userProfile = async (req, res, next) => {
    try {
        const userResult = await UsersResultModel.find({
            userId: req.cookies.User.id,
            success: true,
          });
          const userDisability = await UserJoinExam.find({
            _id: { $in: req.cookies.User.Disability },
          });
        res.render("frontEnd/userPage/userProfile", {
            title: "user Profile",
            URL: req.url,
            userDisability,
            notification: req.flash("notification")[0],
            validationError: req.flash("validationError")[0],
            user: req.cookies.User,
            userResult,
        });
    } catch (error) {
        tryError(res, error);
    }
};

const changePassword = async (req, res, next) => {
    try {
        var errors = validationResult(req).errors;
        if (errors.length > 0) {
            handel_validation_errors(req, res, errors, "userProfile");
            return;
        }
        var user = req.cookies.User;
        var compPassword = bcrypt.compareSync(req.body.password, user.password);
        if (compPassword) {
            var newPassword = bcrypt.hashSync(req.body.newPassword, 10);
            await UsersResultModel.findByIdAndUpdate(
                user.id,  // تحديد الـ _id للمستخدم
                { password: newPassword },  // تعيين كلمة السر الجديدة
                { new: true }  // لإرجاع الوثيقة المحدثة
              );
            res.clearCookie("User");
            returnWithMessage(
                req,
                res,
                "/userProfile",
                "تم تغير كلمه السر بنجاح",
                "success"
            );
        } else {
            returnWithMessage(
                req,
                res,
                "/userProfile",
                "الرقم السري اللذي ادخلته خاطا",
                "danger"
            );
        }
    } catch (error) {
        tryError(res, error);
    }
};

const ourService = async (req, res, nest) => {
    try {
        res.render("frontEnd/userPage/ourService", {
            title: "our service",
            URL: req.url,
            notification: req.flash("notification")[0],
            validationError: req.flash("validationError")[0],
            user: req.cookies.User,
        });
    } catch (error) {
        tryError(res);
    }
};

const ourTraining = async (req, res, nest) => {
    try {
        var { limit, page } = req.query;
        const allTraining = await TrainingModel.find({
            active: true, // تصفية الفعال
        })
          .skip((parseInt(page) - 1) * limit) // تخطي العناصر بناءً على الصفحة
          .limit(parseInt(limit)) // تعيين الحد الأقصى للعناصر في الصفحة
          .populate("trainingDisability"); // تضمين البيانات المتعلقة بـ "trainingDisability"

        res.render("frontEnd/userPage/training", {
            title: "our service",
            URL: req.url,
            notification: req.flash("notification")[0],
            validationError: req.flash("validationError")[0],
            user: req.cookies.User,
            allTraining,
            page,
            pages: paginate.getArrayPages(req)(
                limit,
                Math.ceil(allTraining.count / limit),
                page
            ),
        });
    } catch (error) {
        tryError(res, error);
    }
};

const yourTraining = async (req, res, nest) => {
    try {
        var { limit, page } = req.query;
        const MyTraining = await TrainingModel.find({
            active: true,
            $or: [
              { disability: { $in: req.cookies.User.Disability } }, // شروط المطابقة لـ Disability
              { 
                otherDisabilities: { $elemMatch: { $in: req.cookies.User.Disability } }, // شرط المطابقة لـ otherDisabilities
                isOther: true 
              },
            ]
          })
            .skip((parseInt(page) - 1) * limit) // تخطي العناصر بناءً على الصفحة
            .limit(parseInt(limit)) // تعيين الحد الأقصى للعناصر في الصفحة
            .populate("trainingDisability"); // تضمين بيانات "trainingDisability"

        res.render("frontEnd/userPage/yourTraining", {
            title: "my Training",
            URL: req.url,
            notification: req.flash("notification")[0],
            validationError: req.flash("validationError")[0],
            user: req.cookies.User,
            MyTraining,
            page,
            pages: paginate.getArrayPages(req)(
                limit,
                Math.ceil(MyTraining.count / limit),
                page
            ),
        });
    } catch (error) {
        tryError(res, error);
    }
};

const yourBooks = async (req, res, nest) => {
    try {
        var { limit, page } = req.query;
        const MyBooks = await BookModel.find({
            active: true,
            $or: [
              { disability: { $in: req.cookies.User.Disability } }, // تطابق مع الـ Disability
              {
                otherDisabilities: { $elemMatch: { $in: req.cookies.User.Disability } }, // تطابق مع الـ otherDisabilities
                isOther: true,
              },
            ],
          })
            .skip((parseInt(page) - 1) * limit) // تخطي العناصر بناءً على الصفحة
            .limit(parseInt(limit)) // تعيين الحد الأقصى للعناصر في الصفحة
            .populate("booksDisability"); // تضمين بيانات "booksDisability"

        res.render("frontEnd/userPage/yourBooks", {
            title: "my Books",
            URL: req.url,
            notification: req.flash("notification")[0],
            validationError: req.flash("validationError")[0],
            user: req.cookies.User,
            MyBooks,
            page,
            pages: paginate.getArrayPages(req)(
                limit,
                Math.ceil(MyBooks.count / limit),
                page
            ),
        });
    } catch (error) {
        tryError(res, error);
    }
};

const yourGide = async (req, res, nest) => {
    try {
        var { limit, page } = req.query;
        const yourGide = await GuideLinesModel.find({
            active: true,
            $or: [
              { disability: { $in: req.cookies.User.Disability } }, // تطابق مع الـ Disability
              {
                otherDisabilities: { $elemMatch: { $in: req.cookies.User.Disability } }, // تطابق مع الـ otherDisabilities
                isOther: true,
              },
            ],
          })
            .skip((parseInt(page) - 1) * limit) // تخطي العناصر بناءً على الصفحة
            .limit(parseInt(limit)) // تعيين الحد الأقصى للعناصر في الصفحة
            .populate("guideLinesDisability"); // تضمين بيانات "guideLinesDisability"

        res.render("frontEnd/userPage/yourGide", {
            title: "my Books",
            URL: req.url,
            notification: req.flash("notification")[0],
            validationError: req.flash("validationError")[0],
            user: req.cookies.User,
            yourGide,
            page,
            pages: paginate.getArrayPages(req)(
                limit,
                Math.ceil(yourGide.count / limit),
                page
            ),
        });
    } catch (error) {
        tryError(res, error);
    }
};

const ExamVoice = async (req, res, nest) => {
    try {
        var { limit, page } = req.query;
        const ExamVoice = await SoundExamModel.find({
        active: true,
        $or: [
            { disability: { $in: req.cookies.User.Disability } }, // تطابق مع الـ Disability
            {
            otherDisabilities: { $elemMatch: { $in: req.cookies.User.Disability } }, // تطابق مع الـ otherDisabilities
            isOther: true,
            },
        ],
        })
        .skip((parseInt(page) - 1) * limit) // تخطي العناصر بناءً على الصفحة
        .limit(parseInt(limit)) // تعيين الحد الأقصى للعناصر في الصفحة
        .populate("soundDisability"); // تضمين بيانات "soundDisability"
        
        res.render("frontEnd/userPage/ExamVoice", {
            title: "my voice exam",
            URL: req.url,
            notification: req.flash("notification")[0],
            validationError: req.flash("validationError")[0],
            user: req.cookies.User,
            ExamVoice,
            page,
            pages: paginate.getArrayPages(req)(
                limit,
                Math.ceil(ExamVoice.count / limit),
                page
            ),
        });
    } catch (error) {
        tryError(res, error);
    }
};

const showTraining = async (req, res, nest) => {
    try {
        const showTraining = await TrainingModel.findOne({
            _id: req.params.id, // البحث باستخدام id
          });
        res.render("frontEnd/userPage/showTraining", {
            title: "show Training",
            URL: req.url,
            notification: req.flash("notification")[0],
            validationError: req.flash("validationError")[0],
            user: req.cookies.User,
            showTraining,
        });
    } catch (error) {
        tryError(res);
    }
};

const allTesting = async (req, res, nest) => {
    try {
        const allTesting = await Testing.find()
        res.render("frontEnd/userPage/allTesting", {
            title: "show Training",
            URL: req.url,
            notification: req.flash("notification")[0],
            validationError: req.flash("validationError")[0],
            user: req.cookies.User,
            allTesting,
        });
    } catch (error) {
        tryError(res, error);
    }
};

const enterExam = async (req, res, next) => {
    try {
        const userId = req.cookies.User.id;
        const examId = req.params.id;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if the user has entered this exam today
        const existingEntry = await UserJoinExam.findOne({
            user: userId,
            exam: examId,
            createdAt: {
                $gte: today, 
            },
        });

        // if (existingEntry) {
        //     returnWithMessage(
        //         req,
        //         res,
        //         "/allTesting",
        //         "لقد قمت بدخول هذا الامتحان اليوم. الرجاء المحاولة غداً.",
        //         "danger"
        //     );
        //     return;
        // }

        // If the user has not entered today, allow them to proceed

        // Save the user's entry to the Disability table
        await UserJoinExam.create({
            user: userId,
            exam: examId,
        });

        // Fetch sections and exam details
        const sections = await Section.find();
        const examData = await Testing.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(examId),
                },
            },
            {
                $lookup: {
                    from: "questions",
                    localField: "_id",
                    foreignField: "exam",
                    as: "questions",
                    pipeline: [
                        {
                            $sort: {
                                order: 1,
                            },
                        },
                    ],
                },
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    type: 1,
                    shuffle: 1,
                    active: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    questions: 1,
                },
            },
        ]);
        console.log(examData)
        res.render("frontEnd/userPage/enterExam", {
            title: "Show Training",
            URL: req.url,
            notification: req.flash("notification")[0],
            validationError: req.flash("validationError")[0],
            user: req.cookies.User,
            sections,
            examData: examData[0], 
        });
    } catch (error) {
        tryError(res, error);
    }
};

module.exports = enterExam;

  
const sendResult = async (req, res, nest) => {
    try {
        var userResult = await UsersResultModel.findOne({
            userId: req.cookies.User.id,
            test: req.params.id,
          });

        var file = Rename_uploade_img(req);

        if (userResult) {
            removeImg(req, "users/audio/", userResult.audio);
            await UsersResultModel.updateOne(
                { userId: req.cookies.User.id, test: req.params.id },
                { $set: { audio: file } }
            );
        } else {
            await UsersResultModel.create({
                userId: req.cookies.User.id,
                audio: file,
                test: req.params.id,
            });
        }
        res.send("success");
    } catch (error) {
        tryError(res, error);
    }
};

const resultPage = async (req, res, nest) => {
    try {
        var AllUserResult = await UsersResultModel.find({
            userId: req.cookies.User.id,
            success: { $ne: null },
        })
        .populate({
            path: 'ResultTesting',
            select: 'numberOfTest id',
            populate: {
            path: 'TestingDisability',
            select: 'name',
            },
        });

        res.render("frontEnd/userPage/resultPage", {
            title: "show test",
            URL: req.url,
            AllUserResult,
            notification: req.flash("notification")[0],
            validationError: req.flash("validationError")[0],
            user: req.cookies.User,
            allTesting,
        });
    } catch (error) {
        tryError(res, error);
    }
};

const contactUs = async (req, res, nest) => {
    try {
        res.render("frontEnd/userPage/contactUs", {
            title: "show Training",
            URL: req.url,
            notification: req.flash("notification")[0],
            validationError: req.flash("validationError")[0],
            user: req.cookies.User,
            allTesting,
        });
    } catch (error) {
        tryError(res, error);
    }
};

const contactUsPost = async (req, res, nest) => {
    try {
        await ContactUsModel.create({
            userId: req.cookies.User.id,
            message: req.body.message,
          });
        returnWithMessage(
            req,
            res,
            "/contactUs",
            "تم ارسال الرساله بنجاح انتظر الرد علي الايميل اللذي قمت بالتسجيل به علي الموقع",
            "success"
        );
    } catch (error) {
        tryError(res, error);
    }
};

const EditPersonalInformation = async (req, res, nest) => {
    try {
        var disabilitys = await UserJoinExam.find({
            active: true,
          });
          
        res.render("frontEnd/userPage/editPersonalInformation", {
            title: "Edit Personal Information",
            URL: req.url,
            disabilitys,
            notification: req.flash("notification")[0],
            validationError: req.flash("validationError")[0],
            user: req.cookies.User,
        });
    } catch (error) {
        tryError(res);
    }
};
const EditPersonalInformationPost = async (req, res, nest) => {
    try {
        var errors = await validationResult(req).errors;
        if (errors.length > 0) {
            removeImg(req);
            handel_validation_errors(
                req,
                res,
                errors,
                "/editPersonalInformation"
            );
            return;
        }
        var file = Rename_uploade_img(req);
        if (file) {
            removeImg(req, "users/", req.body.oldImage);
        }
        req.body.image = file ? file : req.body.oldImage;
        req.body.gender = req.body.gender == "1" ? true : false;
        console.log(req.body);
        req.body.Disability =
            req.body.Disability.length == 1
                ? [req.body.Disability]
                : req.body.Disability;
        await UsersResultModel.update(req.body, {
            where: {
                id: req.cookies.User.id,
            },
        });
        res.clearCookie("User");

        returnWithMessage(
            req,
            res,
            "/editPersonalInformation",
            "تم تعديل بياناتك بنجاح قم بتسجيل الدخول مره اخري",
            "success"
        );
    } catch (error) {
        tryError(res, error);
    }
};

module.exports = {
    homePage,
    showTraining,
    userProfile,
    changePassword,
    contactUs,
    ourTraining,
    EditPersonalInformation,
    ourService,
    EditPersonalInformationPost,
    ourTraining,
    yourTraining,
    resultPage,
    contactUsPost,
    allTesting,
    enterExam,
    sendResult,
    yourBooks,
    yourGide,
    ExamVoice,
};
