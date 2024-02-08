import Phaser from 'phaser'

import MapManager from './MapManager'

class MyGame extends Phaser.Scene {
  constructor () {
    super()
    this.tileWidth = 49
    this.tileHeight = 49
    this.pixelWidth = 16 * this.tileWidth
    this.pixelHeight = 16 * this.tileWidth

    this.mapManager = new MapManager(this.tileWidth, this.tileHeight, (matrix) => matrix.forEach((arr, i) => arr.forEach((e, j) => this.layer.putTileAt(e, i, j))))

    window.scene = this
  }

  preload () {
    this.load.image('grass', 'assets/tiles/Grass.png')
    this.load.spritesheet('player', 'assets/sprites/Basic Charakter Spritesheet.png', { frameWidth: 48, frameHeight: 48 })
  }

  create () {
    // Initialize map and layers
    const map = this.make.tilemap({ tileWidth: 16, tileHeight: 16 })
    map.addTilesetImage('grass', 'grass', 16, 16)
    this.layer = map.createBlankLayer('ground', 'grass', 0, 0, this.tileWidth, this.tileHeight)

    // Configure animations
    this.anims.create({
      key: 'walk-down',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'walk-up',
      frames: this.anims.generateFrameNumbers('player', { start: 4, end: 7 }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'walk-left',
      frames: this.anims.generateFrameNumbers('player', { start: 8, end: 11 }), // Next row for left
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'walk-right',
      frames: this.anims.generateFrameNumbers('player', { start: 12, end: 15 }), // Next row for left
      frameRate: 10,
      repeat: -1
    })

    // Configure player
    this.player = this.physics.add.sprite(Math.round(this.pixelWidth / 2), Math.round(this.pixelHeight / 2), 'player')
    this.player.setSize(8, 8)
    this.player.setOffset(20,24)
    this.player.setCollideWorldBounds(this.pixelWidth, this.pixelHeight)

    // Bind keys
    this.cursors = this.input.keyboard.createCursorKeys()
    this.timeKeys = this.input.keyboard.addKeys('Q,E')
    this.timeKeys.Q.on('down', () => this.mapManager.stepBack())
    this.timeKeys.E.on('down', () => this.mapManager.stepForward())

    // Configure camera
    this.cameras.main.setBounds(0, 0, this.pixelWidth, this.pixelHeight)
    this.cameras.main.startFollow(this.player, false, 1, 1, 0, 0)
    this.cameras.main.setZoom(2)

    // Configure physics
    this.physics.world.setBounds(0, 0, this.pixelWidth, this.pixelHeight)
    this.physics.add.collider(this.player, this.layer)
    this.layer.setCollisionBetween(59, 60)

    // Initialize hud
    this.timeIndexText = this.add.text(210, 150, '0', { fontSize: '12px', fill: '#fff' })
    this.timeDeltaText = this.add.text(210, 170, '0', { fontSize: '12px', fill: '#fff' })
    this.hud = this.add.container(0, 0, [this.timeIndexText, this.timeDeltaText])
    this.hud.setScrollFactor(0)

    // Populate and render the map
    this.mapManager.manage()

    // Uncomment for debug
    // const debugGraphics = this.add.graphics().setAlpha(0.7)
    // this.layer.renderDebug(debugGraphics, {
    //     tileColor: null,
    //     collidingTileColor: new Phaser.Display.Color(100,100,100,255),
    //     faceColor: new Phaser.Display.Color(40, 40, 40, 255)
    // })
  }

  update () {
    // Set player movement
    this.updatePlayerMovement()

    // Handle player interaction
    if (this.cursors.space.isDown) {
      const { x, y } = this.getTargetCoord()
      this.mapManager.mutateTile(x, y, -1)
    }

    // Keep map current
    this.mapManager.manage()

    // Update hud
    this.timeIndexText.setText(this.mapManager.index)
    this.timeDeltaText.setText((Date.now() - this.mapManager.startTime) - (this.mapManager.stepSize * (this.mapManager.index - this.mapManager.baseIndex)))
  }

  // This approach has several quirks, and needs to be redone
  getTargetCoord () {
    const center = this.layer.worldToTileXY(this.player.getCenter().x, this.player.getCenter().y)
    const facing = this.player.body.facing

    switch (facing) {
      case Phaser.Physics.Arcade.FACING_LEFT:
        center.x -= 1
        break
      case Phaser.Physics.Arcade.FACING_UP:
        center.y -= 1
        break
      case Phaser.Physics.Arcade.FACING_RIGHT:
        center.x += 1
        break
      case Phaser.Physics.Arcade.FACING_DOWN:
        center.y += 1
        break
      case Phaser.Physics.Arcade.FACING_NONE:
        break
      default:
        break
    }

    return center
  }

  updatePlayerMovement () {
    this.player.setVelocityX(0)
    this.player.setVelocityY(0)

    let x = 0; let y = 0
    const speed = 100

    if (this.cursors.down.isUp && this.cursors.up.isUp && this.cursors.left.isUp && this.cursors.right.isUp) {
      this.player.anims.stop()
    }
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
