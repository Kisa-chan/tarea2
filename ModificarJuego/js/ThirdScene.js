class ThirdScene extends Phaser.Scene {
    constructor() {
        super({ key: "ThirdScene" });
    }

    preload() {
        //Se carga el nuevo mapa a presentar en el segundo nivel junto con los recursos necesarios
        utils.cargarMapaTerceraEscena(this);
        utils.cargarMusicaFondoField(this);
        utils.cargarJugador(this);
    }

    //Se cargan los datos de puntuacion y vida del anterior nivel
    init(data) {
        this.score = data.score;
        this.health = data.health;
    }

    create() {
        //Se crea el mapa y las capas del mismo
        this.map = this.make.tilemap({ key: "map-3" });
        this.bgm = this.sound.add("bgmField", { loop: true });
        this.bgm.play();

        utils.agregarTilesMapaTerceraEscena(this.map);
        var tiles = this.map.createLayer("Suelo3", "Tiles3", 0, 0);
        //var plataformas3 = this.map.createLayer("Suelo3Collider", tiles, 0, 0);

        //Se crea un jugador con la vida restante del anterior, y se añade colision con las plataformas
        this.player = new Player(this, 2350, 600, this.health);
        utils.configurarColisiones(tiles, this.physics, this.player, null);
        utils.configurarCamara(this.cameras, this.map, this.player);
        // this.input.keyboard.on("keydown-X", this.isAttacking, this);
        this.input.keyboard.on("keydown-X", () => {
            utils.isAttacking(this);
        });

        //Sistema de puntuacion en pantalla
        utils.visualizarPuntuacion(this);

        //Sistema de vidas en pantalla
        utils.visualizarVidas(this);

        this.time.addEvent({
            delay: 1000,
            callback: this.delayDone,
            callbackScope: this,
            loop: false,
        });
    }

    delayDone() {
        this.player.body.setSize(this.player.width, this.player.height, true);
    }

    update(time, delta) {
        this.player.update(time, delta);
        this.player.body.setSize(this.player.width, this.player.height, true);

        if (this.player.gameOver && !this.player.anims.isPlaying) {
            this.bgm.stop();
            this.scene.start("Gameover", { score: this.score });
        }
        if (this.player.y > this.map.heightInPixels) {
            this.bgm.stop();
            this.scene.start("Win", { score: this.score });
        }

        //Se verifica si el jugador a llegado al final del nivel para cambiar de escena y se detiene la musica de la escena actual
        if (this.player.x > this.map.widthInPixels) {
            this.bgm.stop();
            this.scene.start("BossScene", {
                score: this.score,
                health: this.player.health,
            });
        }
    }
}
