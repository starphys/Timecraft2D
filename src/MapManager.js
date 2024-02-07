export default class MapManager {
  constructor (width, height, onDrawMap) {
    this.width = width
    this.height = height

    this.mapStack = [this.generateRandomMap()]

    this.startTime = Date.now()
    this.index = 0
    this.baseIndex = this.index
    this.stepSize = 3000

    this.onDrawMap = onDrawMap
  }

  generateRandomMap () {
    const { xLower, xUpper, yLower, yUpper } = this.spawnBoxBounds()
    const arr = Array(this.width).fill(0).map((_, i) => Array(this.height).fill(0).map((_, j) => {
      if ((i >= xLower && i <= xUpper) && (j >= yLower && j <= yUpper)) {
        return 12
      }

      const rand = Phaser.Math.Between(1, 30)
      if (rand < 4) {
        return 59 // collides
      } else if (rand < 10) {
        return 55 // dark grass
      } else if (rand < 15) {
        return 66 // light grass
      } else {
        return 12
      }
    }))
    return arr
  }

  spawnBoxBounds () {
    const centerX = Math.round(this.width / 2) - 1
    const centerY = Math.round(this.height / 2) - 1
    const radiusX = Math.round(this.width / 20) || 1
    const radiusY = Math.round(this.height / 20) || 1
    return { xLower: centerX - radiusX, xUpper: centerX + radiusX, yLower: centerY - radiusY, yUpper: centerY + radiusY }
  }

  manage () {
    // How much time since our last start time
    const timeDelta = Date.now() - this.startTime

    // How many steps is that in total
    const stepDelta = Math.floor(timeDelta / this.stepSize)

    // Our last base plus that number of steps should be our new index
    const newIndex = this.baseIndex + stepDelta

    // If our new index is different from our current index, assign and do work, otherwise return
    if (newIndex === this.index) { return }
    this.index = newIndex

    this.updateMapStack()
    this.drawMap()
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

  updateStartTime () {
    this.startTime = Date.now()
    this.baseIndex = this.index
  }

  setStepSize (newStepSize) {
    this.stepSize = newStepSize
  }

  stepBack () {
    this.index = Math.max(this.index - 1, 0)
    this.updateStartTime() // If you step backward constantly you actually pause time at the beginning of the map stack
    this.drawMap()
  }

  stepForward () {
    this.index = Math.min(this.index + 1, this.mapStack.length - 1)
    this.updateStartTime() // If you step forward constantly you actually pause time at the end of the map stack
    this.drawMap()
  }
}
