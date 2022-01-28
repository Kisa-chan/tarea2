class Inicio extends Phaser.Scene {
    constructor() {
        super({ key: "Inicio" });
    }

    preload() {
        this.load.image("bg-1", "res/sky.png");
    }

    create() {
        var bg_1 = this.add.tileSprite(
            windows.width/2,
            windows.height/2,
            windows.width,
            windows.height,
            "bg-1"
        );
        const pressButton = this.add.text(
            this.sys.game.config.width / 2 - 200,
            this.sys.game.config.height / 2,
            "PRESS ANY BUTTON",
            {
                fontSize: "40px",
                fill: "#000",
                fontFamily: "verdana, arial, sans-serif",
            }
        );

        this.tweens.add({
            targets: pressButton,
            alpha: 0,
            ease: (x) => (x < 0.5 ? 0 : 1),
            duration: 500,
            yoyo: true,
            repeat: -1,
        });
        this.input.keyboard.on("keydown-RIGHT", () => {
            this.iniciarJuego();
        });
        this.input.keyboard.on("keydown-LEFT", () => {
            this.iniciarJuego();
        });
        this.input.keyboard.on("keydown-UP", () => {
            this.iniciarJuego();
        });
        this.input.keyboard.on("keydown-DOWN", () => {
            this.iniciarJuego();
        });

        this.input.keyboard.on("keydown-ENTER", () => {
            this.iniciarJuego();
        });
        this.input.on("pointerdown", () => {
            this.iniciarJuego();
        });
    }
    iniciarJuego() {
        this.scene.start("MainScene");
    }
}
