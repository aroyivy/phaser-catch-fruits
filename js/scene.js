class Scene extends Phaser.Scene {
    constructor() {
        super({
            key: 'gameScene',
            active: true
        });
        this.cursors = null;
        this.platforms = null;
        this.bombs = null;
        this.fruits = null;
        this.score = 0;
        this.playerLevel = 1;
        this.playerLife = 1;
        this.numberOfBombs = 1;
        this.randomX = null;
    }
    preload() {
        this.load.image('bg', '../assets/bg.jpg');
        this.load.image('ground', '../assets/ground.png');
        this.load.image('fruit1', '../assets/fruit1.png');
        this.load.image('bomb', '../assets/bomb.png');
        this.load.spritesheet('player', '../assets/player.png', {
            frameWidth: 32,
            frameHeight: 48
        });

        this.load.on("progress", (percent) => {
            // console.log(percent);
        });
        this.load.on("complete", () => {

        });
    }

    create() {
        
        this.randomX = Phaser.Math.FloatBetween(0, this.sys.game.canvas.width);
        // adding keyboard events
        this.cursors = this.input.keyboard.createCursorKeys();
        // adding static sprites
        this.add.sprite(400, 300, 'bg');
        this.platforms = this.physics.add.staticGroup();
        this.ground = this.platforms.create(400, 550, 'ground').setScale(1.7).refreshBody();

        // adding dynamic collision objects
        // creating fruits
        this.fruits = this.createSpriteGroup('fruit1', 2, this.randomX*0.2, 0, 200);
        this.fruits.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
            child.setScale('.2');
            child.setCollideWorldBounds(true);
        });

        // creating bombs
        this.bombs = this.createSpriteGroup('bomb', 0, this.randomX, 0, 200);
        this.bombs.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.1, 0.2));
            child.setScale('.1');
            child.setCollideWorldBounds(true);
        });

        // creating player and player-animation
        this.player = this.physics.add.sprite(100, 450, 'player');
        this.player.setBounce('.1');
        this.player.setCollideWorldBounds(true);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', {
                start: 0,
                end: 3
            }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'turn',
            frames: [{
                key: 'player',
                frame: 4
            }],
            frameRate: 20
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', {
                start: 5,
                end: 8
            }),
            frameRate: 10,
            repeat: -1
        });

        // creating texts
        this.scoreText = this.createTextBox(`Score: ${this.score}`, 16, 16, '25px', '#000', 5);
        this.playerLevelText = this.createTextBox(`Level: ${this.playerLevel}`,200, 16, '25px', '#000', 5);
        this.playerLifeText = this.createTextBox(`Life: ${this.playerLife}`,400, 16, '25px', '#000', 5);        
        this.playerGameOverText = this.createTextBox("",160, 200, '50px', '#fff', 5);

        // creating game colliders 
        this.physics.add.collider(this.fruits, this.ground);
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.bombs, this.ground);

        // creating functions for collition objects
        this.physics.add.overlap(this.player, this.fruits, this.collectFruits, null, this);
        this.physics.add.overlap(this.player, this.bombs, this.bombHitPlayer, null, this);
    }

    update() {

        this.randomX = Phaser.Math.FloatBetween(0, this.sys.game.canvas.width);
        // animate player
        this.animatePlayer();

        // drop more fruits
        if (this.fruits.children.size < 3) {

            console.log('enter', this);
            this.fruits.create(this.randomX, 68, 'fruit1').setScale('.2').setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        }
        if (this.bombs.children.size < this.numberOfBombs) {
            this.bombs.create(this.randomX, 68, 'bomb').setScale('.1').setBounceY(Phaser.Math.FloatBetween(0.1, 0.2));
        }

        // increase bomb count
        // if (this.score) {

        // }
        // destroy bomb on time out
        this.bombs.children.iterate(function (child) {
            console.log("bomb iterate")
            setTimeout(() => {
                child.destroy();
            }, 10000);
        });

    }

    collectFruits(player, fruit) {
        console.log("runninf collect function")
        
        fruit.destroy();
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);
    }
    bombHitPlayer(player, bomb) {
        console.log("runninf bomb function")
        bomb.destroy();
        this.playerLife -= 1;
        this.playerLifeText.setText('Life: ' + this.playerLife);
        if(this.playerLife === 0){
            this.scene.pause();
            this.playerGameOverText.setText('GAME OVER');
        }
    }
    animatePlayer() {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);

            this.player.anims.play('left', true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);

            this.player.anims.play('right', true);
        } else {
            this.player.setVelocityX(0);

            this.player.anims.play('turn');
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-150);
        }

    }

    createSpriteGroup(name, repeatInt, xPos, yPos, stepX) {
        const newGroup = this.physics.add.group({
            key: name,
            repeat: repeatInt,
            setXY: {
                x: xPos,
                y: yPos,
                stepX: stepX
            }
        });
        return newGroup;
    }
    
    createTextBox(initialText, xPos, yPos, fontSize, color, strokeThickness){
        const scoreText = this.add.text(xPos, yPos, initialText, {
            fontSize: fontSize,
            fill: color,
            strokeThickness: strokeThickness
        });
        return scoreText;
    }
}