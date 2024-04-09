const router = require("express").Router()
const exerciseCtrl = require("../controller/exercise.controller")

router.post("/setlogs", exerciseCtrl.setExerciseLogs);
router.post("/setexercise", exerciseCtrl.setExercisePlan);
router.get("/getexercise", exerciseCtrl.getExercisePlan)
router.get("/getweeklyhistory", exerciseCtrl.getWeeklyExerciseHistory);

module.exports = router;