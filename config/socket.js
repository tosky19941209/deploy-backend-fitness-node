
module.exports = (server) => {
    const config = require('./env/config')
    const { Gym_exercise, House_exercise, exercise1 } = require('./analysis_exercise/category_exercise')


    const WebSocket = require('ws')
    const wss = new WebSocket.Server({ server });
    wss.on('connection', function connection(ws) {
        ws.on('message', (message) => {
            data = JSON.parse(message)
            results_data = data.results_data
            state_change_exercise = data.state_change_exercise
            kind_exercise = data.kind_exercise

            if (kind_exercise.category === 'House') {
                // console.log("ok!!!!!!!")
                const result = House_exercise(results_data, kind_exercise.exercise, state_change_exercise)
                const new_result = JSON.stringify(result)
                ws.send(new_result)
            }
            else if (kind_exercise.category === 'Gym') {
                const result = Gym_exercise(results_data, kind_exercise.exercise, state_change_exercise)
                const new_result = JSON.stringify(result)
                ws.send(new_result)
            }

        })
    });
    console.log("socket is running")
}