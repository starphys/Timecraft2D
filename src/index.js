import Phaser from 'phaser'

import MapManager from './MapManager'

class MyGame extends Phaser.Scene {
  constructor () {
    super()
    this.mapManager = new MapManager((matrix) => matrix.forEach((arr, i) => arr.forEach((e, j) => this.layer.putTileAt(e, i, j))))
  }

  preload () {
    this.load.image('grass', 'assets/tiles/Grass.png')
    this.load.spritesheet('player', 'assets/sprites/Basic Charakter Spritesheet.png', { frameWidth: 48, frameHeight: 48 })
  }

  create () {
    const map = this.make.tilemap({ tileWidth: 16, tileHeight: 16 })
    map.addTilesetImage('grass', 'grass', 16, 16)
    const layer = map.createBlankLayer('ground', 'grass', 0, 0, 800, 600)
    this.layer = layer

    this.mapManager.manage()
    this.mapManager.drawMap()

    // Animation for walking down
    this.anims.create({
      key: 'walk-down',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    })

    // Animation for walking up
    this.anims.create({
      key: 'walk-up',
      frames: this.anims.generateFrameNumbers('player', { start: 4, end: 7 }),
      frameRate: 10,
      repeat: -1
    })

    // Animation for walking left
    this.anims.create({
      key: 'walk-left',
      frames: this.anims.generateFrameNumbers('player', { start: 8, end: 11 }), // Next row for left
      frameRate: 10,
      repeat: -1
    })

    // Animation for walking right
    this.anims.create({
      key: 'walk-right',
      frames: this.anims.generateFrameNumbers('player', { start: 12, end: 15 }), // Next row for left
      frameRate: 10,
      repeat: -1
    })

    this.player = this.physics.add.sprite(400, 300, 'player')
    this.player.setSize(10, 10, true)
    this.cursors = this.input.keyboard.createCursorKeys()
    this.cursors.shift.on('down', () => this.mapManager.stepBack())
    this.cursors.space.on('down', () => this.mapManager.stepForward())

    this.physics.add.collider(this.player, layer)
    layer.setCollisionBetween(59, 60)

    // const debugGraphics = this.add.graphics().setAlpha(0.7)
    // layer.renderDebug(debugGraphics, {
    //     tileColor: null,
    //     collidingTileColor: new Phaser.Display.Color(100,100,100,255),
    //     faceColor: new Phaser.Display.Color(40, 40, 40, 255)
    // })

    // this.player.setCollideWorldBounds(true)
  }

  update () {
    this.player.setVelocityX(0)
    this.player.setVelocityY(0)
    this.player.anims.stop()

    let x = 0; let y = 0
    const speed = 100

    if (this.cursors.left.isDown) {
      x = -1
      this.player.anims.play('walk-left', true)
    }
    if (this.cursors.right.isDown) {
      x = 1
      this.player.anims.play('walk-right', true)
    }
    if (this.cursors.up.isDown) {
      y = -1
      this.player.anims.play('walk-up', true)
    }
    if (this.cursors.down.isDown) {
      y = 1
      this.player.anims.play('walk-down', true)
    }

    const mag = Math.sqrt(x * x + y * y || 1)
    this.player.setVelocity(speed * x / mag, speed * y / mag)

    this.mapManager.manage()
  }
}

const config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      // debug:true,
      gravity: { y: 0 }
    }
  },
  scene: MyGame
}

const game = new Phaser.Game(config)
