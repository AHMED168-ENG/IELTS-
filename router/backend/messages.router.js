const {
  AllMessageController,
  deleteMessage,
  responsMessage,
  responsMessagePost,
} = require("../../controller/backend/allMessages");
const { isAuthonticate } = require("../../middel_ware/backEnd/isAuthonticate");

const router = require("express").Router();

router.get("/AllMessage", isAuthonticate, AllMessageController);
router.get("/responsMessage/:id", isAuthonticate, responsMessage);
router.post("/responsMessage/:id", isAuthonticate, responsMessagePost);

router.post("/deleteMessage/:id", isAuthonticate, deleteMessage);

module.exports = {
  messagesRouter: router,
};
