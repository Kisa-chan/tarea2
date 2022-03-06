class Inicio extends Phaser.Scene {
    constructor() {
        super({ key: "Inicio" });
    }

    preload() {
        this.load.image("bg-1", "res/sky.png");
    }

    create() {
        this.add.tileSprite(
            windows.width / 2,
            windows.height / 2,
            windows.width,
            windows.height,
            "bg-1"
        );
        const pressButton = this.add.text(
            this.sys.game.config.width / 2 - 200,
            this.sys.game.config.height / 2 - 100,
            "PRESS ANY BUTTON",
            {
                fontSize: "40px",
                fill: "#000",
                fontFamily: "verdana, arial, sans-serif",
            }
        );

        const tutorialTitleText = this.add.text(
            this.sys.game.config.width / 2 - 300,
            this.sys.game.config.height / 2,
            "Instrucciones de Juego.-",
            {
                fontSize: "28px",
                fill: "#000",
                fontFamily: "verdana, arial, sans-serif",
            }
        );

        //Indicacion de atacar y saltar
        const tutorialText = this.add.text(
            this.sys.game.config.width / 2 - 300,
            this.sys.game.config.height / 2 + 35,
            "Se golpea con X\n" +
                "Se salta con ESPACIO\n" +
                "Se mueve con las flechas\n" +
                "Al tomar una seta o vencer a un enemigo aumenta el puntaje\n" +
                "y al obtener 10 puntos se suma una vida\n" +
                "Se debe recolectar la llave correspondiente\n" +
                "para poder pasar al siguiente nivel\n" +
                " o deribar las paredes de piedra",
            {
                fontSize: "20px",
                fill: "#000",
                fontFamily: "verdana, arial, sans-serif",
            }
        );

        //Se añaden los inputs que se pueden presionar para iniciar el juego
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
