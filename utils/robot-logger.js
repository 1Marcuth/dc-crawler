function createRobotLogger(robotName) {
    function log(message) {
        console.log(`> [${robotName}-robot] ${message}`)
    }

    function error(message) {
        console.error(`> [${robotName}-robot-error] ${message}`)
    }

    return {
        log,
        error
    }
}

export default createRobotLogger