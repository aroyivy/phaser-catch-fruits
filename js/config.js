var config = {
    type: Phaser.AUTO,
    width: 600,
    height: 500,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 200
            },
            debug: true
        }
    },
    scene: [Scene]
};



var game = new Phaser.Game(config);
