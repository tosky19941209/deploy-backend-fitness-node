const mongoose = require('mongoose');

const fitnessSchema = new mongoose.Schema({
    username: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: false
    },
    exercise_history: {
        exercise_kind: {
            type: String,
            required: false
        },
        exercise_data: {
            type: Date,
            required:false,
            default: Date.now
        }
    }
});

const FitnessModel = mongoose.model('FitnessModel', fitnessSchema);

module.exports = FitnessModel;