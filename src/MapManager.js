// import TimeManager from './TimeManager'

export default class MapManager {
  constructor (onDrawMap) {
    // this.timeManager = TimeManager(Clock.now())
    this.mapStack = [this.generateRandomMap()]

    this.startTime = Date.now()
    this.index = 0
    this.baseIndex = this.index
    this.stepSize = 5000

    this.onDrawMap = onDrawMap
  }

  generateRandomMap () {
    const arr = []
    for (let i = 0; i < 800; i++) {
      const temp = []
      for (let j = 0; j < 600; j++) {
        const rand = Phaser.Math.Between(1, 30)

        if (rand < 4) {
          temp.push(59)
        } else if (rand < 5) {
          temp.push(55)
        } else if (rand < 7) {
          temp.push(66)
        } else {
          temp.push(12)
        }
      }
      arr.push(temp)
    }

    return arr
  }

  manage () {
    const delta = Date.now() - (this.startTime + this.stepSize * this.index)

    if (delta < this.stepSize) { return }

    this.index += Math.floor(delta / this.stepSize)

    this.updateMapStack()
    this.drawMap()
  }

  getMap () {
    // return this.mapStack[this.timeManager.timeIndex]
  }

  storeMap (index, map) {
    if (index <= this.mapStack.length) {
      this.mapStack.push(map)
    } else {
      this.mapStack[index] = map
    }
  }

  updateMapStack () {
    const mapLen = this.mapStack.length
    if (this.index < mapLen) { return }

    for (let i = 0; i <= this.index - mapLen; i++) {
      const map = this.generateRandomMap()
      this.storeMap(mapLen + i, map)
    }
  }

  drawMap () {
    this.onDrawMap(this.mapStack[this.index])
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