const express = require('express')
const config = require('../config/env/config')
const { json } = require('body-parser')
const router = express.Router()
const path = require('path')
const { rmSync } = require('fs')


router.get('/test', (req, res) => {
    res.send("Welcome to dashboard 1.3")
})

router.get('/video_load', (req, res) => {
    const data = req.query
    const category = data.category
    const exercise = data.exercise
    const index = data.index
    const videoPath = path.join(__dirname, `../sample_video/${index}/${category}`, `${exercise}.mp4`)
    res.sendFile(videoPath)
})

router.post('/signup', (req, res) => {
    const user = require('../config/model/users')
    const newData = req.body
    const { username, password, email, height, weight } = newData
    user.findOne({ email })
        .then((response) => {
            if (response) {
                res.send({
                    message: "User is already existed"
                })
            } else {
                const newUser = new user(newData)
                newUser.save()
                    .then(() => {
                        res.send({
                            message: "success"
                        })
                    })
                    .catch((err) => {
                        console.log("err: ", err)
                    })
            }
        })
})

router.post('/signupUpdate', (req, res) => {
    const user = require('../config/model/users')
    const header = req.body.header
    const updateData = req.body.updateData
    const { email, password } = header
    user.findOneAndUpdate({
        email: email,
        password: password
    }, updateData, { new: true })
        .then((response) => {
            if (response) {
                res.send({
                    message: "success"
                })
            } else {
                res.send({
                    message: "Email or password is not correct."
                })
            }
        })
        .catch((err) => {
            console.log(err)
        });
})

router.post('/setlogs', (req, res) => {
    const logs = require('../config/model/logs')
    const user = require('../config/model/users')
    const newData = req.body
    const header = newData.header
    const updateData = newData.updateData
    const { email, password } = header

    let state = true

    user.findOne({ email, password })
        .then((result) => {
            const newlog = new logs({
                ...updateData,
                userid: result._id
            })

            console.log(newlog)
            newlog.save()
                .then(() => {
                    res.send({
                        message: "success"
                    })
                })
        })

})

router.post('/setdiet', (req, res) => {
    const user = require('../config/model/users')
    const diet = require('../config/model/diet')
    const newData = req.body
    const updateData = newData.updateData
    const header = newData.header
    const { email, password } = header

    console.log("setdiet: ", header)
    console.log("setdiet: ", updateData)

    user.findOne({ email: email, password: password })
        .then(async (result) => {
            if (result === null) {
                res.send({
                    message: "User is not registed."
                })
                return
            }

            let addStatus = null

            await diet.find({ userid: result._id })
                .then((response) => {
                    if (response.length === 0) {
                        addStatus = true
                    } else {

                        addStatus = true

                        const currentData = {
                            year: String(updateData.year),
                            month: String(updateData.month),
                            date: String(updateData.date),
                            day: String(updateData.day),
                        }

                        response.map((item, index) => {
                            const existData = {
                                year: item.year,
                                month: item.month,
                                date: item.date,
                                day: item.day,
                            }
                            const string1 = JSON.stringify(existData)
                            const string2 = JSON.stringify(currentData)
                            if (string1 === string2) {
                                addStatus = false
                            }
                        })
                    }
                })

            if (addStatus === true) {
                const newDiet = new diet({
                    userid: result._id,
                    year: updateData.year,
                    month: updateData.month,
                    date: updateData.date,
                    day: updateData.day,
                    meal: updateData.meal
                })
                newDiet.save()
                    .then(() => {
                        res.send({
                            message: "added"
                        })
                    })
            }
            else {
                await diet.findOneAndUpdate(
                    {
                        userid: result._id,
                        year: updateData.year,
                        month: updateData.month,
                        date: updateData.date,
                        day: updateData.day
                    },
                    updateData,
                    { new: true })
                    .then(() => {
                        res.send({
                            message: "Updated"
                        })
                    })
                    .catch((err) => {
                        res.send({
                            message: "failed"
                        })
                    })
            }
        })
})


router.post('/setexercise', (req, res) => {
    const user = require('../config/model/users')
    const exercise = require('../config/model/exercise')
    const newData = req.body
    const header = newData.header
    const { email, password } = header
    const updateData = newData.updateData
    if (updateData.year === '') return
    user.findOne({ email: email, password: password })
        .then(async (result) => {
            if (result === null) {
                res.send({
                    message: "User is not registed."
                })
                return
            }

            let addStatus = null

            await exercise.find({ userid: result._id })
                .then((response) => {
                    if (response.length === 0) {
                        addStatus = true
                    } else {

                        addStatus = true

                        const currentData = {
                            year: String(updateData.year),
                            month: String(updateData.month),
                            date: String(updateData.date),
                            day: String(updateData.day),
                        }
                        response.map((item, index) => {
                            const existData = {
                                year: item.year,
                                month: item.month,
                                date: item.date,
                                day: item.day,
                            }
                            const string1 = JSON.stringify(existData)
                            const string2 = JSON.stringify(currentData)
                            if (string1 === string2) {
                                addStatus = false
                            }
                        })
                    }
                })

            if (addStatus === true) {
                const newExercise = new exercise({
                    userid: result._id,
                    year: updateData.year,
                    month: updateData.month,
                    date: updateData.date,
                    day: updateData.day,
                    exerciseType: updateData.exerciseType
                })
                newExercise.save()
                    .then(() => {
                        res.send({
                            message: "added"
                        })
                    })
            }
            else {
                await exercise.findOneAndUpdate(
                    {
                        userid: result._id,
                        year: updateData.year,
                        month: updateData.month,
                        date: updateData.date,
                        day: updateData.day
                    },
                    updateData,
                    { new: true })
                    .then(() => {
                        res.send({
                            message: "Updated"
                        })
                    })
                    .catch((err) => {
                        res.send({
                            message: "failed"
                        })
                    })
            }
        })
})

router.get('/signin', (req, res) => {
    const users = require('../config/model/users')
    const newData = req.query
    const { email, password } = newData
    users.findOne({ email, password })
        .then((result) => {
            if (result) {
                res.json({
                    name: result.username,
                    message: "success"
                })
            } else {
                res.json({
                    name: '',
                    message: "failed"
                })
            }
        })
})

router.get('/getexercise', async (req, res) => {
    const header = req.query.header;
    const getData = req.query.getData;

    const exercise = require('../config/model/exercise');
    const user = require('../config/model/users');
    if (getData.year === '') {
        return;
    }
    let userid = '';
    await user.findOne({ email: header.email })
        .then(async (result) => {
            if (result) {
                userid = result._id;
            }
        })
        .catch(error => {
            console.error(error);
        });

    if (userid === '')
        res.send({
            message: "ExercisePlan is not exist"
        })
    else {
        await exercise.find({ userid: userid, year: getData.year, month: getData.month, date: getData.date })
            .then((result) => {
                if (result.length !== 0) {
                    res.send({
                        message: "success",
                        result: result[0]
                    })
                } else {
                    res.send({
                        message: "There is no plan"
                    })
                }
            })
    }

});

router.get('/getdiet', async (req, res) => {
    const header = req.query.header;
    const getData = req.query.getData;
    const diet = require('../config/model/diet');
    const user = require('../config/model/users');
    if (getData.year === '') {
        return;
    }
    let userid = '';
    await user.findOne({ email: header.email })
        .then(async (result) => {
            if (result) {
                userid = result._id;
            }
        })
        .catch(error => {
            console.error(error);
        });

    if (userid === '')
        res.send({
            message: "ExercisePlan is not exist"
        })
    else {
        await diet.find({ userid: userid, year: getData.year, month: getData.month, date: getData.date })
            .then((result) => {
                if (result.length !== 0) {
                    res.send({
                        message: "success",
                        result: result[0]
                    })
                } else {
                    res.send({
                        message: "There is no plan"
                    })
                }
            })
    }

});

router.get('/getweeklyhistory', async (req, res) => {
    const user = require('../config/model/users')
    const logs = require('../config/model/logs')

    const header = req.query.header
    const updateData = req.query.updateData
    const { email, password } = header
    const year = updateData.year
    const month = updateData.month
    const date = updateData.date

    const userlist = await user.findOne({ email: email, password: password })


    const result = await logs.aggregate([
        {
            $match: {
                userid: userlist._id,
                $expr: {
                    $and: [
                        { $gte: [{ $toInt: "$year" }, Number(year[0])] },
                        { $lte: [{ $toInt: "$year" }, Number(year[6])] },
                        { $gte: [{ $toInt: "$month" }, Number(month[0])] },
                        { $lte: [{ $toInt: "$month" }, Number(month[6])] },
                        { $gte: [{ $toInt: "$date" }, Number(date[0])] },
                        { $lte: [{ $toInt: "$date" }, Number(date[6])] }
                    ]
                }
            }
        },
        {
            $group: {
                _id: {
                    year: "$year",
                    month: "$month",
                    date: "$date"
                },
                averageCounter: { $avg: { $toInt: "$counter" } },
                averageDurtime: { $sum: { $toInt: "$durtime" } },
                averageAccuracy: { $avg: { $toDouble: "$accuracy" } },
                data: { $push: "$$ROOT" }
            }
        },
        { $sort: { "_id.year": -1, "_id.month": -1, "_id.date": -1 } }
      ])
      

    res.send(result);
})
module.exports = router