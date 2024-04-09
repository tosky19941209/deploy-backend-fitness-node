exports.setExerciseLogs = async (req, res) => {

    console.log("exercise is up to day")

    const logs = require('../model/logs')
    const user = require('../model/users')
    const newData = req.body
    const header = newData.header
    const updateData = newData.updateData

    console.log(updateData)
    const { email, password } = header

    let state = true

    user.findOne({ email, password })
        .then((result) => {
            const newlog = new logs({
                ...updateData,
                userid: result._id
            })

            newlog.save()
                .then(() => {
                    res.send({
                        message: "success"
                    })
                })
        })
}

exports.setExercisePlan =  (req, res) => {
    const user = require('../model/users')
    const exercise = require('../model/exercise')
    const newData = req.body

    // console.log(newData)

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
}


exports.getExercisePlan = async (req, res) => {
    const header = req.query.header;
    const getData = req.query.getData;

    const exercise = require('../model/exercise');
    const user = require('../model/users');
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
}


exports.getWeeklyExerciseHistory = async (req, res) => {
    const user = require('../model/users')
    const logs = require('../model/logs')

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
}

