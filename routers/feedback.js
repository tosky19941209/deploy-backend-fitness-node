const router = require("express").Router();
const feedbackCtrl = require("../controller/feedback.controller");

router.post("/setfeedback", feedbackCtrl.setFeedback);

module.exports = router;