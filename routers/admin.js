const router = require("express").Router()

var adminCtrl = require("../controller/admin.controller")


router.get("/test", adminCtrl.test);
router.post("/signup", adminCtrl.signup);
router.post("/signupUpdate", adminCtrl.signupUpdate);
router.get("/signin", adminCtrl.signin);


module.exports = router