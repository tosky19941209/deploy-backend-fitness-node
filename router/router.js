const express = require('express')
const config = require('../config/env/config')
const { Gym_exercise, House_exercise, exercise1 } = require('../config/analysis_exercise/category_exercise')
const { json } = require('body-parser')
const router = express.Router()
const path = require('path')
router.get('/test', (req, res) => {
    res.send(req.query)
})

let state_counter = false
let counter = 0
let decimal_point = 2

router.get('/video_load', (req, res) => {
    const data = req.query
    const category = data.category
    const exercise = data.exercise
    const videoPath = path.join(__dirname,`../sample_video/${category}`, `${exercise}.mp4`)
    res.sendFile(videoPath)
})

router.get('/changed_exercise', (req, res) => {
    Gym_exercise
    res.send("success")
})

router.post('/training', (req, res) => {
    results_data = req.body.data
    kind_exercise = req.body.kind_exercise
    state_change_exercise = req.body.state_change_exercise
    if(kind_exercise.category === 'Gym'){
       const result = Gym_exercise(results_data, kind_exercise.exercise, state_change_exercise)
       res.send(result)
    }
    else if (kind_exercise.category === 'House'){
        const result = House_exercise(results_data, kind_exercise.exercise, state_change_exercise)
        res.send(result)
    }
})

router.post('/webcam_model', (req, res) => {
    results_data = req.body
    res.send(results_data)
})

module.exports = router