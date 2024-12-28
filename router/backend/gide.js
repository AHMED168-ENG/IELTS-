const {
    AllGideController,
    EditGideController,
    activeGide,
    deleteGide,
    EditGideControllerPost,
    addGideController,
    addGideControllerPost,
} = require("../../controller/backend/gide");
const { uploade_img_multi_fild } = require("../../Helper/helper");
const { isAuthonticate } = require("../../middel_ware/backEnd/isAuthonticate");

const { GideValidation } = require("../../validation/backEnd/Gide.validation");
const {
    EditUserValidation,
} = require("../../validation/backEnd/user.validation");

const router = require("express").Router();

router.get("/AllGide", isAuthonticate, AllGideController);
router.get("/addGide", isAuthonticate, addGideController);
router.post(
    "/addGide",
    isAuthonticate,
    uploade_img_multi_fild(
        [
            {
                name: "image",
            },
            {
                name: "pdf",
            },
        ],
        "public/backEnd/assets/img/gide"
    ),
    GideValidation(),
    addGideControllerPost
);
router.get("/EditGide/:id", isAuthonticate, EditGideController);
router.post(
    "/EditGide/:id",
    isAuthonticate,
    uploade_img_multi_fild(
        [
            {
                name: "image",
            },
            {
                name: "pdf",
            },
        ],
        "public/backEnd/assets/img/gide"
    ),
    GideValidation(),
    EditGideControllerPost
);
router.get("/activeGide/:id", isAuthonticate, activeGide);
router.post("/deleteGide/:id", isAuthonticate, deleteGide);

module.exports = {
    GideRouter: router,
};
