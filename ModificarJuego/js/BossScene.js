class BossScene extends Phaser.Scene {

    constructor() {
        super({ key: 'BossScene' });
    }

    preload() {
        //Se carga el nuevo mapa a presentar en el segundo nivel junto con los recursos necesarios
        utils.cargarMapaPeleaBoss(this);
        utils.cargarMusicaFondoBoss(this);
    }

    //Se cargan los datos de puntuacion y vida del anterior nivel
    init(data) {
        this.score = data.score;
        this.health = data.health;
    }

    create() {
        //Se crea el mapa y las capas del mismo
        this.map = this.make.tilemap({ key: "boss-map" });
        this.bgm = this.sound.add("bgmNight", { loop: true });
        this.bgm.play();

        utils.agregarTilesMapaBoss(this.map);
        var tiles = this.map.createLayer("BossFight", 'BossPlataformas', 0, 0);
        var mapCollider = this.map.createLayer("BossFightCollider", tiles, 0, 0);
        
        this.platformTiles = this.map.createLayer("Plataformas", 'BossPlataformas', 0, 0);
        this.plataformas = this.map.createLayer("PlataformasCollider", this.platformTiles, 0, 0);

        //Se crea un jugador con la vida restante del anterior, y se añade colision con las plataformas
        this.player = new Player(this, 1900, 100, this.health);
        utils.configurarColisiones(this.plataformas, this.physics, this.player, null);
        utils.configurarColisiones(mapCollider, this.physics, this.player, null);
  
        utils.configurarCamara(this.cameras, this.map, this.player);
        // this.input.keyboard.on("keydown-X", this.isAttacking, this);
        this.input.keyboard.on("keydown-X", () => {
            utils.isAttacking(this);
        });

        //Se añaden los objetos tipo Pua al mapa y se define funcion a ejecutar al colisionar con estos
        let bossObject = this.map.getObjectLayer("Boss")["objects"][0];
        this.boss = new Boss(this, bossObject.x + 8, bossObject.y - 8, this.player);

        this.boss.body.setSize(this.boss.width, this.boss.height);
        this.physics.add.collider(this.boss, mapCollider);
        this.physics.add.overlap(
            this.boss,
            this.player,
            this.bossHit,
            null,
            this
        );

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

    //Funcion para controlar las acciones a ejecutarse cuando collisionan el jugador y el enemigo
    bossHit(boss, player) {
        if (!boss.playAnim && !this.player.isDeath && boss.health > 0) {
            boss.attack();
            boss.once('animationcomplete', () => {
                if (boss.attackSuccess) {
                    this.player.checkDamage();
                    utils.quitarVidas(this);
                    boss.attackSuccess = false;
                }
            });

            if (boss.attackSuccess) {
                this.player.checkDamage();
                utils.quitarVidas(this);
            }
        }
    }

    update(time, delta) {
        this.boss.update(time, delta);
        this.boss.body.setSize(this.boss.width, this.boss.height, true);
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

        if (this.boss.bossVictory) {
            utils.agregarPuntaje(this);
            this.boss.bossVictory = false;
            var exitPlataforms = this.map.createLayer("PlataformasSalida", 'BossPlataformas', 0, 0);
            var plataformasSalida = this.map.createLayer("SalidaCollider", exitPlataforms, 0, 0);
            utils.configurarColisiones(plataformasSalida, this.physics, this.player, null);
        }
    }
}