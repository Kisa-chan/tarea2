class Gameover extends Phaser.Scene {
    constructor() {
        super({ key: "Gameover" });
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
        this.add.text(
            this.sys.game.config.width / 2 - 170,
            this.sys.game.config.height / 2,
            "GAMEOVER",
            {
                fontSize: "60px",
                fill: "#000",
                fontFamily: "verdana, arial, sans-serif",
            }
        );

        this.evento = setTimeout(() => {
            this.salirEscene();
        }, 5000);

        this.input.keyboard.on("keydown-ENTER", () => {
            this.salirEscene();
        });
        this.input.on("pointerdown", () => {
            console.log("pointerdown");
            this.salirEscene();
        });
    }

    salirEscene() {
        clearTimeout(this.evento);
        this.scene.start("Inicio");
    }
}
