class SecondScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SecondScene' });
    }

    preload() {
        this.load.tilemapTiledJSON("map-2", "res/New-Map.json");
        this.load.image("arboles", 'res/_PNG/arboles.png');
        this.load.image("dia-fondo-1", 'res/_PNG/dia-fondo-1.png');
        this.load.image("dia-fondo-2", 'res/_PNG/dia-fondo-2.png');
        this.load.image("decoraciones", 'res/_PNG/decoraciones.png');
        this.load.image("plataformas", 'res/_PNG/plataformas.png');

        this.load.image("cueva-fondo-1", 'res/_PNG/cueva-fondo-1.png');
        this.load.image("cueva-fondo-2", 'res/_PNG/cueva-fondo-2.png');
        this.load.image("cueva-fondo-3", 'res/_PNG/cueva-fondo-3.png');
        this.load.image("cueva-fondo-4", 'res/_PNG/cueva-fondo-4.png');
        this.load.image("cueva-plataformas", 'res/_PNG/cueva-plataformas.png');
        this.load.image("cueva-objetos", 'res/_PNG/cueva-objetos.png');
        this.load.image("skelleton", "res/idle-skelleton-1.png");
    }

    init(data) {
        this.score = data.score;
        this.health = data.health;
    }

    create() {
        var map = this.make.tilemap({ key: "map-2" });

        this.input.keyboard.on('keydown-X', this.isAttacking, this);

        map.addTilesetImage("Arboles", "arboles");
        map.addTilesetImage("Dia-Fondo-1", "dia-fondo-1");
        map.addTilesetImage("Dia-Fondo-2", "dia-fondo-2");
        map.addTilesetImage("Plataformas", "plataformas");
        map.addTilesetImage("Decoraciones", "decoraciones");

        map.addTilesetImage("Cueva-Fondo-1", "cueva-fondo-1");
        map.addTilesetImage("Cueva-Fondo-2", "cueva-fondo-2");
        map.addTilesetImage("Cueva-Fondo-3", "cueva-fondo-3");
        map.addTilesetImage("Cueva-Fondo-4", "cueva-fondo-4");
        map.addTilesetImage("Cueva-Plataformas", "cueva-plataformas");
        map.addTilesetImage("Cueva-Objetos", "cueva-objetos");

        map.createLayer("Fondo", ['Dia-Fondo-1', 'Cueva-Fondo-1'], 0, 0);
        map.createLayer("Fondo2", ['Dia-Fondo-2', 'Cueva-Fondo-2'], 0, 0);
        map.createLayer("Fondo Arboles", ['Arboles', 'Cueva-Fondo-3', 'Cueva-Fondo-4'], 0, 0);
        map.createLayer("Frente", 'Arboles', 0, 0);
        map.createLayer("Frente2", ['Decoraciones', 'Plataformas', 'Cueva-Objetos'], 0, 0);
        map.createLayer("Puas", ['Plataformas', 'Cueva-Plataformas', 'Cueva-Objetos'], 0, 0);
        var tiles = map.createLayer("Plataformas", ['Plataformas', 'Cueva-Plataformas', , 'Cueva-Objetos'], 0, 0);

        var plataformas = map.createLayer("Plataformas Collider", tiles, 0, 0);
        var limites = map.createLayer("Limites", tiles, 0, 0);
        //enable collisions for every tile

        this.player = new Player(this, 20, 100, this.health);
        plataformas.setCollisionByExclusion([-1], true);
        limites.setCollisionByExclusion([-1], true);
        limites.setVisible(false);
      
        this.physics.add.collider(this.player, plataformas);


        this.cameras.main.setBounds(
            0,
            0,
            map.widthInPixels,
            map.heightInPixels
        );
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(
            0,
            0,
            map.widthInPixels,
            map.heightInPixels
        );

        this.puasGroup = []
        this.puas = map.getObjectLayer("puas")["objects"];

        this.puas.forEach((pua)=> {
            var pua = new Pua(this, pua.x+8, pua.y-8);
            this.puasGroup.push(pua);
            pua.body.setSize(16,16);
            this.physics.add.collider(pua, plataformas);
            this.physics.add.overlap(
              pua,
              this.player,
              this.puaHit,
              null,
              this
          );
        });

        this.scoreText = this.add.text(16, 16, "PUNTOS: " + this.score, {
            fontSize: "20px",
            fill: "#000",
            fontFamily: "verdana, arial, sans-serif",
        });

        this.scoreText.setScrollFactor(0);

        this.time.addEvent({ delay: 1000, callback: this.delayDone, callbackScope: this, loop: false });

        this.skelletons = []
        this.enemigos = map.getObjectLayer("Enemigos")["objects"];
        this.enemigos.forEach((enemigo)=> {
            // en mi caso la seta
            var skelleton = new Skelleton(this, enemigo.x, enemigo.y);
            this.skelletons.push(skelleton);
            skelleton.body.setSize(skelleton.width - 40,skelleton.height, true);
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
    }

    isAttacking() {
        this.player.isAttacking = true;
    }

    delayDone() {
        this.player.body.setSize(this.player.width, this.player.height, true);
    }

    puaHit() {
        if (!this.player.isDeath) {
            this.player.checkDamage();
        }
    }

    skelletonHit(skelleton, player) {
      if (!skelleton.playAnim && !this.player.isDeath) {
       if(!this.player.isAttacking) {
           if (player.x < skelleton.x) {
             skelleton.setFlipX(true)
           } else {
             skelleton.setFlipX(false);
           }
           skelleton.attack();
           skelleton.once('animationcomplete', () => {
             this.player.checkDamage();
           });
       } else {
         skelleton.die();
         skelleton.once('animationcomplete', () => {
           skelleton.destroy();
           this.skelletons = this.skelletons.filter(_skelleton => _skelleton != skelleton);
         })
       }
      }
    }

    update(time, delta) {
        this.skelletons.forEach((skelleton) => {
          skelleton.update(time, delta);
        });
        this.player.update(time, delta);
        this.player.body.setSize(this.player.width, this.player.height, true);

        /*var outOfScreen = (this.player.y >= game.config.height);

        if(outOfScreen){
            this.scene.start("Gameover");
        }*/
    }

    agregarPuntaje() {

        this.score++;
        this.scoreText.setText(["PUNTOS: " + this.score]);
    }
}