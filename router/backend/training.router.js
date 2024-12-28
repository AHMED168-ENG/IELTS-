const {
  AllTrainingController,
  EditTrainingController,
  activeTraining,
  deleteTraining,
  EditTrainingControllerPost,
  addTrainingController,
  addTrainingControllerPost,
} = require("../../controller/backend/training");
const { uploade_img, uploade_img_multi_fild } = require("../../Helper/helper");
const { isAuthonticate } = require("../../middel_ware/backEnd/isAuthonticate");
const {
  disabilityValidation,
} = require("../../validation/backEnd/disability.validation");
const {
  trainingValidation,
} = require("../../validation/backEnd/training.validation");
const {
  EditUserValidation,
} = require("../../validation/backEnd/user.validation");

const router = require("express").Router();

router.get("/AllTraining", isAuthonticate, AllTrainingController);
router.get("/addTraining", isAuthonticate, addTrainingController);
router.post(
  "/addTraining",
  isAuthonticate,
  uploade_img_multi_fild(
    [
      {
        name: "image",
      },
      {
        name: "video",
      },
    ],
    "public/backEnd/assets/img/trainingImage"
  ),
  trainingValidation(),
  addTrainingControllerPost
);
router.get("/EditTraining/:id", isAuthonticate, EditTrainingController);
router.post(
  "/EditTraining/:id",
  isAuthonticate,
  uploade_img_multi_fild(
    [
      {
        name: "image",
      },
      {
        name: "video",
      },
    ],
    "public/backEnd/assets/img/trainingImage"
  ),
  trainingValidation(),
  EditTrainingControllerPost
);
router.get("/activeTraining/:id", isAuthonticate, activeTraining);
router.post("/deleteTraining/:id", isAuthonticate, deleteTraining);

module.exports = {
  trainingRouter: router,
};
