class SecondScene extends Phaser.Scene {
    constructor() {
        super({ key: "SecondScene" });
    }

    preload() {
        //Se carga el nuevo mapa a presentar en el segundo nivel junto con los recursos necesarios
        utils.cargarMapaSegundaEscena(this);
        utils.cargarMusicaFondoNight(this);
    }

    //Se cargan los datos de puntuacion y vida del anterior nivel
    init(data) {
        this.score = data.score;
        this.health = data.health;
    }

    create() {
        //Se crea el mapa y las capas del mismo
        this.map = this.make.tilemap({ key: "map-2" });
        this.bgm = this.sound.add("bgmNight", { loop: true });
        this.bgm.play();

        utils.agregarTilesMapaSegundaEscena(this.map);
        var tiles = this.map.createLayer(
            "Plataformas",
            ["Plataformas", "Cueva-Plataformas", , "Cueva-Objetos"],
            0,
            0
        );

        var plataformas = this.map.createLayer(
            "Plataformas Collider",
            tiles,
            0,
            0
        );
        var limites = this.map.createLayer("Limites", tiles, 0, 0);

        //Se crea un jugador con la vida restante del anterior, y se añade colision con las plataformas
        this.player = new Player(this, 40, 100, this.health);
        utils.configurarColisiones(
            limites,
            plataformas,
            this.physics,
            this.player
        );
        utils.configurarCamara(this.cameras, this.map, this.player);
        // this.input.keyboard.on("keydown-X", this.isAttacking, this);
        this.input.keyboard.on("keydown-X", () => {
            utils.isAttacking(this);
        });

        //Se añaden los objetos tipo Pua al mapa y se define funcion a ejecutar al colisionar con estos
        this.puasGroup = [];
        this.puas = this.map.getObjectLayer("puas")["objects"];

        this.puas.forEach((pua) => {
            var pua = new Pua(this, pua.x + 8, pua.y - 8);
            this.puasGroup.push(pua);
            pua.body.setSize(16, 16);
            this.physics.add.collider(pua, plataformas);
            this.physics.add.overlap(pua, this.player, this.puaHit, null, this);
        });

        //Se añaden los enemigos al nivel y los colisionadores con las plataformas y el jugador
        this.skelletons = [];
        this.enemigos = this.map.getObjectLayer("Enemigos")["objects"];
        this.enemigos.forEach((enemigo) => {
            var skelleton = new Skelleton(this, enemigo.x, enemigo.y);
            this.skelletons.push(skelleton);
            skelleton.body.setSize(
                skelleton.width - 40,
                skelleton.height,
                true
            );
            this.physics.add.collider(skelleton, plataformas);
            this.physics.add.collider(skelleton, limites);
            this.physics.add.overlap(
                skelleton,
                this.player,
                this.skelletonHit,
                null,
                this
            );
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

    //Funcion para recibir daño de las puas
    puaHit() {
        if (!this.player.isDeath) {
            this.player.checkDamage();
            utils.quitarVidas(this);
        }
    }

    //Funcion para controlar las acciones a ejecutarse cuando collisionan el jugador y el enemigo
    skelletonHit(skelleton, player) {
        if (!skelleton.playAnim && !this.player.isDeath) {
            if (!this.player.isAttacking) {
                if (player.x < skelleton.x) {
                    skelleton.setFlipX(true);
                } else {
                    skelleton.setFlipX(false);
                }
                skelleton.attack();
                skelleton.once("animationcomplete", () => {
                    this.player.checkDamage();
                    utils.quitarVidas(this);
                });
            } else {
                skelleton.die();
                skelleton.once("animationcomplete", () => {
                    skelleton.destroy();
                    this.skelletons = this.skelletons.filter(
                        (_skelleton) => _skelleton != skelleton
                    );
                    utils.agregarPuntaje(this);
                    utils.agregarVidas(this);
                });
            }
        }
    }

    update(time, delta) {
        this.skelletons.forEach((skelleton) => {
            skelleton.update(time, delta);
            skelleton.body.setSize(skelleton.width, skelleton.height, true);
        });
        this.player.update(time, delta);
        this.player.body.setSize(this.player.width, this.player.height, true);

        if (this.player.isDeath && !this.player.anims.isPlaying) {
            this.bgm.stop();
            this.scene.start("Gameover", { score: this.score });
        }
        if (this.player.y > this.map.heightInPixels) {
            this.bgm.stop();
            this.scene.start("Win", { score: this.score });
        }
    }
}
