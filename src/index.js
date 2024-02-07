import Phaser from 'phaser'

import MapManager from './MapManager'

class MyGame extends Phaser.Scene {
  constructor () {
    super()
    this.tileWidth = 49
    this.tileHeight = 49
    this.pixelWidth = 16 * this.tileWidth
    this.pixelHeight = 16 * this.tileWidth

    const onDrawMap = (matrix) => matrix.forEach((arr, i) => arr.forEach((e, j) => this.groundLayer.putTileAt(e, i, j)))
    this.mapManager = new MapManager(this.tileWidth, this.tileHeight, onDrawMap)

    window.scene = this
  }

  preload () {
    this.load.image('grass', 'assets/tiles/Grass.png')
    this.load.spritesheet('player', 'assets/sprites/Basic Charakter Spritesheet.png', { frameWidth: 48, frameHeight: 48 })
    this.load.spritesheet('apple', 'assets/sprites/Apple_1_White_Outline.png', { frameWidth: 16, frameHeight: 16 })
  }

  create () {
    this.initWorld()
    this.initPlayer()
    this.initView() //TODO: better function name?

    this.anims.create({
      key: 'decay',
      frames: this.anims.generateFrameNumbers('apple', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: 1
    })

    this.input.on('pointerdown', () => {
      const tile = this.tilemap.getTileAtWorldXY(this.input.mousePointer.x, this.input.mousePointer.y)
      console.log(tile.x, tile.y)
      const apple = this.physics.add.sprite(tile.x, tile.y, 'apple')
    })
  }

  update () {
    this.player.setVelocityX(0)
    this.player.setVelocityY(0)
    this.player.anims.stop()

    let x = 0; let y = 0
    const speed = 100

    if (this.cursorKeys.left.isDown) {
      x = -1
      this.player.anims.play('walk-left', true)
    }
    if (this.cursorKeys.right.isDown) {
      x = 1
      this.player.anims.play('walk-right', true)
    }
    if (this.cursorKeys.up.isDown) {
      y = -1
      this.player.anims.play('walk-up', true)
    }
    if (this.cursorKeys.down.isDown) {
      y = 1
      this.player.anims.play('walk-down', true)
    }

    const mag = Math.sqrt(x * x + y * y || 1)
    this.player.setVelocity(speed * x / mag, speed * y / mag)
    this.mapManager.manage()
    this.timeIndexText.setText(this.mapManager.index)
    this.timeDeltaText.setText((Date.now() - this.mapManager.startTime) - (this.mapManager.stepSize * (this.mapManager.index - this.mapManager.baseIndex)))
  }

  initWorld() {
    this.tilemap = this.make.tilemap({ tileWidth: 16, tileHeight: 16 })
    this.tilemap.addTilesetImage('grass', 'grass', 16, 16)

    const groundLayer = this.tilemap.createBlankLayer('ground', 'grass', 0, 0, this.tileWidth, this.tileHeight)
    this.groundLayer = groundLayer

    // const appleLayer = this.tilemap.createBlankLayer('apples')

    this.physics.world.setBounds(0, 0, this.pixelWidth, this.pixelHeight)

    this.mapManager.manage()
    this.mapManager.drawMap()
  }

  initPlayer() {
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

    this.player = this.physics.add.sprite(Math.round(this.pixelWidth / 2), Math.round(this.pixelHeight / 2), 'player')
    this.player.setSize(10, 10, true)
    this.player.setCollideWorldBounds(this.pixelWidth, this.pixelHeight)

    this.cursorKeys = this.input.keyboard.createCursorKeys()
    this.cursorKeys.shift.on('down', () => this.mapManager.stepBack())
    this.cursorKeys.space.on('down', () => this.mapManager.stepForward())

    this.physics.add.collider(this.player, this.groundLayer)
    this.groundLayer.setCollisionBetween(59, 60)
  }

  initView() {
    this.cameras.main.setBounds(0, 0, this.pixelWidth, this.pixelHeight)
    this.cameras.main.startFollow(this.player, false, 1, 1, 0, 0)
    this.cameras.main.setZoom(2)

    this.timeIndexText = this.add.text(210, 150, '0', { fontSize: '12px', fill: '#fff' })
    this.timeDeltaText = this.add.text(210, 170, '0', { fontSize: '12px', fill: '#fff' })

    this.hud = this.add.container(0, 0, [this.timeIndexText, this.timeDeltaText])
    this.hud.setScrollFactor(0)

    // const debugGraphics = this.add.graphics().setAlpha(0.7)
    // layer.renderDebug(debugGraphics, {
    //     // tileColor: new Phaser.Display.Color(150, 150, 150, 255),
    //     collidingTileColor: new Phaser.Display.Color(100,100,100,255),
    //     faceColor: new Phaser.Display.Color(40, 40, 40, 255)
    // })
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
  render: {
    mipmapFilter: 'NEAREST',
    pixelArt: true
  },
  scene: MyGame
}

const game = new Phaser.Game(config)
