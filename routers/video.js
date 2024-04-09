router = require("express").Router()

videoCtrl = require("../controller/video.controller")

router.get("/video_load",  videoCtrl.video_load)

module.exports = router