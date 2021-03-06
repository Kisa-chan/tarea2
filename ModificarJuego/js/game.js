//Configuración de la escena
var windows = {width:800,height: 736}
var config = {
    type: Phaser.AUTO,
    width: windows.width,
    height: windows.height,
    parent: "canvas",
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    scene: [Inicio, MainScene, SecondScene, ThirdScene, BossScene, Gameover, Win],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 },
            debug:true
        }
    }
};

var game = new Phaser.Game(config);
var utils = new Utils();

