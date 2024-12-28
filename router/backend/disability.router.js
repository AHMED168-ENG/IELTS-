const {
  AllDisabilityController,
  EditDisabilityController,
  activeDisability,
  deleteDisability,
  EditdisabilityControllerPost,
  addDisabilityController,
  addDisabilityControllerPost,
} = require("../../controller/backend/dispability");
const { uploade_img } = require("../../Helper/helper");
const { isAuthonticate } = require("../../middel_ware/backEnd/isAuthonticate");
const {
  disabilityValidation,
} = require("../../validation/backEnd/disability.validation");
const {
  EditUserValidation,
} = require("../../validation/backEnd/user.validation");

const router = require("express").Router();

router.get("/AllDisability", isAuthonticate, AllDisabilityController);
router.get("/addDisability", isAuthonticate, addDisabilityController);
router.post(
  "/addDisability",
  isAuthonticate,
  uploade_img("public/backEnd/assets/img/disabilityImage", "image"),
  disabilityValidation(),
  addDisabilityControllerPost
);
router.get("/EditDisability/:id", isAuthonticate, EditDisabilityController);
router.post(
  "/EditDisability/:id",
  isAuthonticate,
  uploade_img("public/backEnd/assets/img/disabilityImage", "image"),
  disabilityValidation(),
  EditdisabilityControllerPost
);
router.get("/activeDisability/:id", isAuthonticate, activeDisability);
router.post("/deleteDisability/:id", isAuthonticate, deleteDisability);

module.exports = {
  dispabilityRouter: router,
};
