const mongoose = require('mongoose')

const fitness_database = mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    exercise_history:{
        exercise_kind:{
            type:String,
            required:true
        },
        exercise_data:{
            type:Date,
            required:Date.now
        }
    }

})