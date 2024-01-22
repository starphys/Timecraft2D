import Phaser from 'phaser'

class MyGame extends Phaser.Scene
{
    constructor () {
        super()
    }

    preload () {
        this.load.image("grass", "assets/tiles/Grass.png")
        this.load.spritesheet("player", "assets/sprites/Basic Charakter Spritesheet.png",{frameWidth:48, frameHeight:48})
    }
      
    create () {
        let arr = []
        for(let i = 0; i < 800; i++) {
            let temp = []
            for(let j = 0; j < 600; j++) {
                if(Phaser.Math.Between(1,30) === 1) {
                    temp.push(59)
                }
                else {
                    temp.push(12)
                }
            }
            arr.push(temp)
        }
        // 12 for regular, 61 for floating chunk
        
        const map = this.make.tilemap({data:arr, tileWidth:16, tileHeight:16})
        map.addTilesetImage("grass", "grass", 16, 16)
        const layer = map.createLayer(0,"grass",0,0)

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
        
        this.player = this.physics.add.sprite(400,300,"player")
        this.cursors = this.input.keyboard.createCursorKeys()

        
    }

    update () {
        this.player.setVelocityX(0)
        this.player.setVelocityY(0)
        this.player.anims.stop()
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160)
            this.player.anims.play('walk-left', true)
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160)
            this.player.anims.play('walk-right', true)
        } else if (this.cursors.up.isDown) {
            this.player.setVelocityY(-160)
            this.player.anims.play('walk-up', true)
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(160)
            this.player.anims.play('walk-down', true)
        }
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
            gravity: { y: 0 },
        },
    },
    scene: MyGame
}

const game = new Phaser.Game(config)    
