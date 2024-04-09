exports.setDietPlan = async (req, res) => {
    const user = require('../model/users')
    const diet = require('../model/diet')
    const newData = req.body
    const updateData = newData.updateData
    const header = newData.header
    const { email, password } = header
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
                    meal: updateData.meal,
                    amount: updateData.amount
                })
                newDiet.save()
                    .then(() => {
                        res.send({
                            message: "added"
                        })
                    })
            }
            else {
                if (updateData.meal.breakfast.length === 0 &&
                    updateData.meal.snack1.length === 0 &&
                    updateData.meal.lunch.length === 0 &&
                    updateData.meal.snack2.length === 0 &&
                    updateData.meal.dinner.length === 0) {
                    await diet.findOneAndDelete(
                        {
                            userid: result._id,
                            year: updateData.year,
                            month: updateData.month,
                            date: updateData.date,
                            day: updateData.day
                        })
                        .then(() => {
                            res.send({
                                message:"deleted"
                            })
                        })
                } else {
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
            }
        })
}

exports.getDietPlan = async (req, res) => {
    const header = req.query.header;
    const getData = req.query.getData;
    const diet = require('../model/diet');
    const user = require('../model/users');
    if (getData.year === '') {
        return;
    }
    let userid = '';
    const dietMenuModel = require('../model/dietmenu')

    const resultDietMenu = await dietMenuModel.aggregate([
        {
            $group: {
                _id: null,
                foodName: { $push: "$foodName" },
                kcal: { $push: "$kcal" },
                protein: { $push: "$protein" },
                water: { $push: "$water" },
                mineral: { $push: "$mineral" }
            }
        },
    ]);

    // console.log(resultDietMenu.length)
    if( resultDietMenu.length === 0) {
        res.send({
            message: "ExercisePlan is not exist"
        })
        return
    }

    const dietMenu = {
        foodName: resultDietMenu[0].foodName,
        kcal: resultDietMenu[0].kcal,
        protein: resultDietMenu[0].protein,
        water: resultDietMenu[0].water,
        mineral: resultDietMenu[0].mineral
    }

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
        const result = await diet.find({ userid: userid, year: getData.year, month: getData.month, date: getData.date })
        if (result.length !== 0) {
            res.send({
                message: "success",
                result: {
                    plandiet: result[0],
                    dietMenu: dietMenu
                }
            })
        } else {
            res.send({
                message: "There is no plan",
                result: {
                    dietMenu: dietMenu
                }
            })
        }
    }
}

exports.setDietMenu = async (req, res) => {
    const dietMenu = require('../model/dietmenu')
    const dietFood = req.body
    const { foodName, kcal, protein, water, mineral } = dietFood
    const result = await dietMenu.findOne({ foodName, kcal })
    if (result) {
        res.send({
            message: "duplicate"
        })
        return
    }
    const newFood = new dietMenu({
        foodName: foodName,
        kcal: kcal,
        protein: protein,
        water: water,
        mineral: mineral
    })

    newFood.save()
        .then((result) => {
            res.send({
                message: 'success'
            })
        })
}

exports.getDietMenu = async (req, res) => {
    const dietMenu = require('../model/dietmenu')

    const result = await dietMenu.aggregate([
        {
            $match:
            {

            }
        },
        {
            $group:
            {
                _id:
                {
                    foodName: "$foodName",
                    kcal: "$kcal"
                }
            }
        },
        {
            $sort:
            {
                "foodName": -1
            }
        }
    ])

    res.send({
        result: result
    })
}

exports.getWeeklyTotalData = async (req, res) => {
    const user = require('../model/users')
    const diet = require('../model/diet')
    const header = req.query.header
    const updateData = req.query.updateData

    const year = updateData.year
    const month = updateData.month
    const date = updateData.date

    const userlist = await user.findOne({ email: header.email, password: header.password })
    const result = await diet.aggregate([
        {
            $match: {
                userid: userlist._id,
                $expr: {
                    $and: [
                        { $gte: [{ $toInt: "$year" }, Number(year[0])] },
                        { $lte: [{ $toInt: '$year' }, Number(year[6])] },
                        { $gte: [{ $toInt: '$month' }, Number(month[0])] },
                        { $lte: [{ $toInt: '$month' }, Number(month[6])] },
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
                    date: "$date",
                    meal: "$meal",
                    amount: "$amount"
                },
                data: { $push: "$$ROOT" }
            }
        },
        {
            $sort: {
                "_id.year": -1,
                "_id.month": -1,
                "_id.date": -1
            }
        }
    ])


    // const result = await diet.aggregate([
    //     {
    //         $match: {
    //             userid: userlist._id,
    //             $expr: {
    //                 $and: [
    //                     { $gte: [{ $toInt: "$year" }, Number(year[0])] },
    //                     { $lte: [{ $toInt: "$year" }, Number(year[6])] },
    //                     { $gte: [{ $toInt: "$month" }, Number(month[0])] },
    //                     { $lte: [{ $toInt: "$month" }, Number(month[6])] },
    //                     { $gte: [{ $toInt: "$date" }, Number(date[0])] },
    //                     { $lte: [{ $toInt: "$date" }, Number(date[6])] }
    //                 ]
    //             }
    //         }
    //     },
    //     {
    //         $group: {
    //             _id: {
    //                 year: "$year",
    //                 month: "$month",
    //                 date: "$date"
    //             },
    //             data: { $push: "$$ROOT" }
    //         }
    //     },
    //     { $sort: { "_id.year": -1, "_id.month": -1, "_id.date": -1 } }
    // ])

    res.send({
        message: 'success',
        result: result
    })
}

exports.setTargetKcal = async ( req, res ) => {
    const header = req.body.header
    const updateData = req.body.updateData
    const userModel = require('../model/users')
    const targetkcalModel = require('../model/targetkcal')
    const userlist = await userModel.findOne({ email: header.email, password: header.password })

    const searchResult = await targetkcalModel.findOne({ userid: userlist._id })

    if (searchResult === null) {
        const setTargetKcal = new targetkcalModel({
            userid: userlist._id,
            targetKcal: updateData.targetKcal
        })
        setTargetKcal.save()
            .then(() => {
                console.log("success")
            })
    }
    else {
        await targetkcalModel.findOneAndUpdate({ userid: userlist._id }, updateData, { new: true })
        res.send({
            message: "updated"
        })
    }
}

exports.getTargetKcal = async (req, res) => {
    const header = req.query.header
    const userModel = require('../model/users')
    const targetKcalModel = require('../model/targetkcal')
    const user = await userModel.findOne({ email: header.email, password: header.password })
    const result = await targetKcalModel.findOne({ userid: user._id })
    if (result !== null) {
        res.send({
            message: "success",
            result: result
        })
    } else {
        res.send({
            message: 'failed'
        })
    }
}