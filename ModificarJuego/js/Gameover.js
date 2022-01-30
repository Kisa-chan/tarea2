class Gameover extends Phaser.Scene {
    constructor() {
        super({ key: "Gameover" });
    }

    preload() {
        this.load.image("bg-1", "res/sky.png");
    }

    init(data) {
        this.score = data.score;
    }

    create() {
        this.add.tileSprite(
            windows.width/2,
            windows.height/2,
            windows.width,
            windows.height,
            "bg-1"
        );

        //Se añade el texto a presentar en la pantalla de GameOver
        this.add.text(
            this.sys.game.config.width / 2 - 170,
            this.sys.game.config.height / 2 - 180,
            "GAMEOVER",
            {
                fontSize: "60px",
                fill: "#000",
                fontFamily: "verdana, arial, sans-serif",
            }
        );

        this.add.text(
            this.sys.game.config.width / 2 - 250,
            this.sys.game.config.height / 2 - 100,
            "Puntuacion final: " + this.score,
            {
                fontSize: "60px",
                fill: "#000",
                fontFamily: "verdana, arial, sans-serif",
            }
        );

        var referenceText = "Recursos usados en este juego tomados de itch.io\nEscenarios y plataformas: Szadi art.\nMusica: SVL.\nSprite de jugador: LuizMelo."
        var text = this.add.text(
            this.sys.game.config.width / 2 - 250,
            this.sys.game.config.height / 2 - 20,
            referenceText,
            {
                fontSize: "20px",
                fill: "#000",
                fontFamily: "verdana, arial, sans-serif",
            }
        );
        text.lineSpacing = 10;

        //Se añade un timer de 5 segundos para volver a la pantalla de inicio o si desea se presiona ENTER para hacerlo inmediatamente
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
