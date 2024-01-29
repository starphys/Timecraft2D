// import TimeManager from './TimeManager'

export default class MapManager {
    constructor () {
        // this.timeManager = TimeManager(Clock.now())
        this.mapStack = []

        this.startTime = Date.now()
        this.index = 0
        this.baseIndex = this.index
        this.stepSize = 1000

        this.manage()
    }

    generateRandomMap () {
        let arr = []
        for(let i = 0; i < 800; i++) {
            let temp = []
            for(let j = 0; j < 600; j++) {
                const rand = Phaser.Math.Between(1,30)
                
                if (rand === 1) {
                    temp.push(59)
                }
                else if (rand < 5){
                    temp.push(55)
                }
                else if (rand < 7) {
                    temp.push(66)
                }
                else {
                    temp.push(12)
                }
            }
            arr.push(temp)
        }
        // 12 for regular, 61 for floating chunk

        return arr
    }

    manage () {
        const delta = Date.now() - (this.startTime + this.stepSize * this.index)

        if (delta < this.stepSize) { return }

        this.index += Math.floor(delta / this.stepSize)
    
        this.updateMap()
        this.drawMap()
    }

    getMap () {
        // return this.mapStack[this.timeManager.timeIndex]
    }

    storeMap (index, map) {
        if (index += this.mapStack.length)
        {
            this.mapStack.push(map)
        } else {
            this.mapStack[index] = map
        }
    }

    updateMap () {
        const mapLen = this.mapStack.length
        if (this.index < mapLen) { return }

        for (let i = 0; i < this.index - mapLen; i++) {
            const map = this.generateRandomMap()
            this.storeMap(mapLen + 1, map)
        }
    }

    drawMap () {
        console.log(this.mapStack.length)
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