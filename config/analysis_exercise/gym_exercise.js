const config = require('../env/config')
const {Angle_3_point} = require("./basic_function")
const decimal_point = 3
let counter = 0
let state_counter = true
let isformatvalue = true
let prevstatevalue = null
exports.exercise1 = (pose_data, state_change_exercise) => {
    if( prevstatevalue === state_change_exercise){
        prevstatevalue = state_change_exercise
    }
    else {
        counter = 0
        state_counter = true
        prevstatevalue = state_change_exercise
    }
    landmark1 = config.index_landmark.right_shoulder
    landmark2 = config.index_landmark.right_hip
    landmark3 = config.index_landmark.right_ankle

    const angle_1 = Angle_3_point(pose_data, landmark1, landmark2, landmark3)
    const accuracy = (180 - angle_1) * 100 / 90
    
    if (accuracy > 80 && state_counter === false) {
        counter = counter + 1;
        state_counter = true;
    }

    else if (accuracy < 20) {
        state_counter = false;
    }
    return {accuracy:accuracy, counter:counter, state:state_change_exercise}
}



exports.exercise2 = (pose_data, state_change_exercise) => {
    if( prevstatevalue === state_change_exercise){
        prevstatevalue = state_change_exercise
    }
    else {
        counter = 0
        state_counter = true
        prevstatevalue = state_change_exercise
    }


    landmark1 = config.index_landmark.right_shoulder
    landmark2 = config.index_landmark.right_hip
    landmark3 = config.index_landmark.right_ankle

    const angle_1 = Angle_3_point(pose_data, landmark1, landmark2, landmark3)
    const accuracy = (180 - angle_1) * 100 / 90
    
    if (accuracy > 80 && state_counter === false) {
        counter = counter + 1;
        state_counter = true;
    }

    else if (accuracy < 20) {
        state_counter = false;
    }
    return {accuracy:accuracy, counter:counter, state:state_change_exercise}
}

exports.exercise3 = (pose_data, state_change_exercise) => {
    if( prevstatevalue === state_change_exercise){
        prevstatevalue = state_change_exercise
    }
    else {
        counter = 0
        state_counter = true
        prevstatevalue = state_change_exercise
    }


    landmark1 = config.index_landmark.right_wrist
    landmark2 = config.index_landmark.right_elbow
    landmark3 = config.index_landmark.right_shoulder

    const angle_1 = Angle_3_point(pose_data, landmark1, landmark2, landmark3)
    const accuracy = (180 - angle_1) * 100 / 90
    
    if (accuracy > 80 && state_counter === false) {
        counter = counter + 1;
        state_counter = true;
    }

    else if (accuracy < 20) {
        state_counter = false;
    }
    return {accuracy:accuracy, counter:counter, state:state_change_exercise}
}