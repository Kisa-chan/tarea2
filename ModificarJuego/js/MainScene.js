class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: "MainScene" });
    }

    preload() {
        //Se carga el nuevo mapa a presentar en el segundo nivel junto con los recursos necesarios
        utils.cargarMapaPrimeraEscena(this);
        this.load.image("life3", "res/life3.png");
        this.load.image("key1", "res/key.png");
        this.load.image("puertaSprite", "res/puerta.png");
        //Se carga archivo de audio para usar como musica de fondo
        utils.cargarMusicaFondoField(this);
        utils.cargarJugador(this);
        utils.cargarEnemigos(this);
        utils.cargarLlaves(this);
        this.load.spritesheet("tilesSprites", "res/Tileset.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
    }

    create() {
        this.map = this.make.tilemap({ key: "map" });

        var bg_1 = this.add.tileSprite(
            0,
            0,
            this.map.widthInPixels * 2,
            this.map.heightInPixels * 2,
            "bg-1"
        );
        bg_1.fixedToCamera = true;

        //Se añade el bgm a la escena y se la ejecuta
        this.bgm = this.sound.add("bgmField", { loop: true });
        this.bgm.play();

        var tiles = this.map.addTilesetImage("Plataformas", "tiles");

        this.map.createLayer("Fondo", tiles, 0, 0);
        var layer = this.map.createLayer("Suelo", tiles, 0, 0);
        var limites = this.map.createLayer("Limites", tiles, 0, 0);

        this.puertaObject = this.map.getObjectLayer("Puerta")["objects"][0];
        this.puerta = this.add.image(
            this.puertaObject.x,
            this.puertaObject.y,
            "puertaSprite"
        );

        //Se crea un objeto tipo player y se añaden las colisiones con el ambiente
        this.player = new Player(this, 20, 100, 5);
        utils.configurarColisiones(layer, this.physics, this.player, limites);
        utils.configurarCamara(this.cameras, this.map, this.player);

        // this.input.keyboard.on("keydown-X", this.isAttacking, this);
        this.input.keyboard.on("keydown-X", () => {
            utils.isAttacking(this);
        });

        this.objetos = this.map.getObjectLayer("objetos")["objects"];
        this.setas = [];
        for (var i = 0; i < this.objetos.length; ++i) {
            var obj = this.objetos[i];
            if (obj.gid == 115) {
                var seta = new Seta(this, obj.x, obj.y);
                this.setas.push(seta);
                this.physics.add.overlap(
                    seta,
                    this.player,
                    this.spriteHit,
                    null,
                    this
                );
            }
        }

        //Se añaden los enemigos del primer nivel
        this.bats = [];
        this.enemigos = this.map.getObjectLayer("bats")["objects"];
        this.enemigos.forEach((enemigo) => {
            var bat = new Bat(this, enemigo.x, enemigo.y);
            this.bats.push(bat);
            bat.body.setSize(32, 60);
            this.physics.add.collider(bat, layer);
            this.physics.add.collider(bat, limites);
            this.physics.add.overlap(bat, this.player, this.batHit, null, this);
        });

        this.keyObjects = this.map.getObjectLayer("keys")["objects"];
        var key = new Key(this, this.keyObjects[0].x, this.keyObjects[0].y);
        this.key = key;
        this.physics.add.collider(key, layer);
        this.physics.add.overlap(key, this.player, this.keyHit, null, this);
        //Sistema de puntuacion en pantalla
        this.score = 0;
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

    //body.setSize se utiliza para que el collider del objeto tenga el tamaño igual al definido en el json de animaciones
    delayDone() {
        this.player.body.setSize(this.player.width, this.player.height, true);
    }

    //Funcion para agregar puntaje cuando se recoge una seta
    spriteHit(sprite1, sprite2) {
        utils.agregarPuntaje(this);
        utils.agregarVidas(this);
        sprite1.destroy();
    }

    //Funcion para recoger llave
    keyHit(sprite1, sprite2) {
        this.key = null;
        sprite1.destroy();
        this.player.setHaveKey(true);
        utils.visualizarLlave(this);
    }

    //Funcion para controlar las acciones a ejecutarse cuando collisionan el jugador y el enemigo
    batHit(bat) {
        if (!bat.playAttack) {
            if (!this.player.isAttacking && !this.player.isDeath) {
                this.player.checkDamage();
                utils.quitarVidas(this);
            }
            bat.attack();
            bat.play("attack", true);
            bat.once("animationcomplete", () => {
                bat.destroy();
                this.bats = this.bats.filter((_bat) => _bat != bat);
                if (this.player.isAttacking) {
                }
                utils.agregarPuntaje(this);
                utils.agregarVidas(this);
            });
        }
    }

    update(time, delta) {
        this.player.update(time, delta);
        this.bats.forEach((bat) => {
            bat.update(time, delta);
        });
        if (this.key) {
            this.key.update(time, delta);
        }

        this.player.body.setSize(this.player.width, this.player.height, true);

        //Se verifica si el jugador a llegado al final del nivel para cambiar de escena y se detiene la musica de la escena actual
        if (this.player.x > this.puertaObject.x && this.player.haveKey) {
            this.bgm.stop();
            this.scene.start("SecondScene", {
                score: this.score,
                health: this.player.health,
            });
        }

        // //Se verifica si el jugador a llegado al final del nivel para cambiar de escena y se detiene la musica de la escena actual
        //  var outOfScreen = this.player.y >= game.config.height;
        // if (outOfScreen) {
        //     this.bgm.stop();
        //     this.scene.start("ThirdScene", {
        //         score: this.score,
        //         health: this.player.health,
        //     });
        // }
        
        //Se verifica si el jugador a salido de escena por caer al agua
        var outOfScreen = this.player.y >= game.config.height;
        if (outOfScreen) {
            this.bgm.stop();
            this.scene.start("Gameover", { score: this.score });
        }

        //Si el jugador a muerto y la animacion de muerte ha terminado se presenta la pantalla de Gameover
        if (this.player.gameOver && !this.player.anims.isPlaying) {
            this.bgm.stop();
            this.scene.start("Gameover", { score: this.score });
        }
    }
}
