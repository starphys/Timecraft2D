class TimeManager {
    constructor (startTime, stepSize = 100) {
        this.startTime = startTime
        this.index = 0
        this.baseIndex = this.index
        this.stepSize = stepSize
    }

    updateStartTime (currentTime, newBaseIndex) {
        this.startTime = currentTime
        this.baseIndex = newBaseIndex
    }

    updateTimeIndex (target) {
        this.index = this.baseIndex + target
        // Update everything which depends on time
    }

    setStepSize (newStepSize) {
        this.stepSize = newStepSize
    }
}