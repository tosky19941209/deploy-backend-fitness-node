exports.setFeedback = async (req, res) => {
    const header = req.body.header
    const updateData = req.body.updateData
    const { email, password } = header
    const feedback = require('../model/feedback')
    const users = require("../model/users")
    const resultUser = await users.findOne({ email: email, password: password })
    if (resultUser === null) return
    const newFeedback = new feedback({
        userid: resultUser._id,
        year: updateData.year,
        month: updateData.month,
        date: updateData.date,
        hour: updateData.hour,
        minute: updateData.minute,
        feedback: updateData.feedback
    })

    await newFeedback.save()
        .then(() => {
            res.send({
                message: "success"
            })
        })
}