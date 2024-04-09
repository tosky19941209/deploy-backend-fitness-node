const router = require("express").Router()
const dietCtrl = require("../controller/diet.controller")

router.post("/setdiet", dietCtrl.setDietPlan);
router.post("/setdietmenu", dietCtrl.setDietMenu);
router.post("/settargetkcal", dietCtrl.setTargetKcal);
router.get("/getdiet", dietCtrl.getDietPlan);
router.get("/getdietmenu", dietCtrl.getDietMenu);
router.get("/getweeklytotaldata", dietCtrl.getWeeklyTotalData);
router.get("/gettargetkcal", dietCtrl.getTargetKcal);

module.exports = router