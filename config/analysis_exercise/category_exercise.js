const Gym_exercise_analysis = require('./gym_exercise')
const House_exercise_analysis = require('./house_exercise')
exports.Gym_exercise = (pose_data, exercise, state_change_exercise) => {
    if(exercise === 'exercise_1'){
        return Gym_exercise_analysis.exercise_1(pose_data,state_change_exercise)
    }
    
    if(exercise === 'exercise_2'){
        return Gym_exercise_analysis.exercise_2(pose_data,state_change_exercise)
    }
}

exports.House_exercise = (pose_data, exercise, state_change_exercise) => {
    if(exercise === 'exercise_1'){
        return House_exercise_analysis.exercise_1(pose_data, state_change_exercise)
    }
    
    if(exercise === 'exercise_2'){
        return House_exercise_analysis.exercise_2(pose_data, state_change_exercise)
    }
    if(exercise === 'exercise_3'){
        return House_exercise_analysis.exercise_3(pose_data, state_change_exercise)
    }
    if(exercise === 'exercise_4'){
        return House_exercise_analysis.exercise_4(pose_data, state_change_exercise)
    }
}



