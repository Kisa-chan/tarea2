class MainScene extends Phaser.Scene {

    constructor(){
        super({key: 'MainScene'});
    }

    preload() {
        //Se carga el nuevo mapa a presentar en el segundo nivel junto con los recursos necesarios
        this.load.tilemapTiledJSON("map", "res/Map.json");
        this.load.image("tiles", "res/Tileset.png");
        this.load.image("bg-1", "res/sky.png");
        this.load.image("sea", "res/sea.png");
        this.load.image("player", "res/idle-1.png");
        this.load.image("bat", "res/idle-bat-1.png");
        this.load.image('life3', 'res/life3.png');
        //Se carga archivo de audio para usar como musica de fondo
        this.load.audio("bgmField", ["res/Audio/field_theme.wav"]);

        this.load.atlas('sprites_jugador', 'res/player_anim/hero_sprites.png',
            'res/player_anim/hero_anim.json');
        this.load.spritesheet('tilesSprites','res/Tileset.png',
        { frameWidth: 32, frameHeight: 32 });
        this.load.atlas('sprites_bat', 'res/bat_anim/bat-atlas.png', 'res/bat_anim/bat-atlas.json');
        this.load.atlas('sprites_skelleton', 'res/skelleton_anim/skelleton-atlas.png', 'res/skelleton_anim/skelleton-atlas.json');
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

        this.input.keyboard.on('keydown-X', this.isAttacking, this);

        var tiles = this.map.addTilesetImage("Plataformas", "tiles");

        this.map.createLayer("Fondo", tiles, 0, 0);
        var layer = this.map.createLayer("Suelo", tiles, 0, 0);
        var limites = this.map.createLayer("Limites", tiles, 0, 0);
        limites.setVisible(false);

        //Se crea un objeto tipo player y se añaden las colisiones con el ambiente
        this.player = new Player(this, 20, 100, 5);
        limites.setCollisionByExclusion([-1], true);
        layer.setCollisionByExclusion([-1], true);
        this.physics.add.collider(this.player, layer);

        //Se define la camara y que siga al jugador mientras se mueve
        this.cameras.main.setBounds(
            0,
            0,
            this.map.widthInPixels,
            this.map.heightInPixels
        );
        this.cameras.main.startFollow(this.player);

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
        this.bats = []
        this.enemigos = this.map.getObjectLayer("bats")["objects"];
        this.enemigos.forEach((enemigo)=> {
            var bat = new Bat(this, enemigo.x, enemigo.y);
            this.bats.push(bat);
            bat.body.setSize(32,60);
            this.physics.add.collider(bat, layer);
            this.physics.add.collider(bat, limites);
            this.physics.add.overlap(
              bat,
              this.player,
              this.batHit,
              null,
              this
          );
        });

        //Sistema de puntuacion en pantalla
        this.score = 0;
        this.scoreText = this.add.text(16, 16, "PUNTOS: " + this.score, {
            fontSize: "20px",
            fill: "#000",
            fontFamily: "verdana, arial, sans-serif",
        });

        this.scoreText.setScrollFactor(0);

        //Sistema de vidas en pantalla
        //Imagen
        this.lifeSprite = this.add.image(600,30, 'life3');
        this.lifeSprite.setScale(0.2);
        this.lifeSprite.setScrollFactor(0);
        //Texto
        this.vidas=this.player.health;
        this.lifeText = this.add.text(622, 18, "X " + this.vidas, {
            fontSize: "20px",
            fill: "#000",
            fontFamily: "verdana, arial, sans-serif",
        });
        this.lifeText.setScrollFactor(0);
        
        //Indicacion de atacar y saltar
        this.tutorialText = this.add.text(300, 18, "Se golpea con X\nSe salta con ESPACIO\nSe mueve con las flechas", {
            fontSize: "20px",
            fill: "#000",
            fontFamily: "verdana, arial, sans-serif",
        });


        this.time.addEvent({delay: 1000, callback: this.delayDone, callbackScope: this, loop: false});

        
    }

    //Funcion de ataque que cambia el estado del jugador solo si no esta muerto y no ha atacado todavia
    isAttacking(){
        if(!this.player.isDeath && !this.player.isAttacking) this.player.isAttacking = true;
    }

    //body.setSize se utiliza para que el collider del objeto tenga el tamaño igual al definido en el json de animaciones
    delayDone(){
        this.player.body.setSize(this.player.width, this.player.height, true);
    }

    //Funcion para agregar puntaje cuando se recoge una seta
    spriteHit(sprite1, sprite2) {
        this.agregarPuntaje();
        this.agregarVidas();
        sprite1.destroy();
    }

    //Funcion para controlar las acciones a ejecutarse cuando collisionan el jugador y el enemigo
    batHit(bat) {
      if (!bat.playAttack) {
       if(!this.player.isAttacking &&!this.player.isDeath) {
           this.player.checkDamage();
           this.quitarVidas();
       }
        bat.attack();
        bat.play("attack", true);
        bat.once('animationcomplete', () => {
          bat.destroy()
          this.bats = this.bats.filter(_bat => _bat != bat);
          this.agregarPuntaje();
          this.agregarVidas();
        })
      }
    }

    update(time, delta) {
        this.player.update(time, delta);
        this.bats.forEach((bat) => {
          bat.update(time, delta);
        });
        this.player.body.setSize(this.player.width, this.player.height, true);

        
        //Se verifica si el jugador a llegado al final del nivel para cambiar de escena y se detiene la musica de la escena actual
        if (this.player.x > this.map.widthInPixels) {
            this.bgm.stop();
            this.scene.start("SecondScene", {score: this.score, health: this.player.health});
        }
        
        //Se verifica si el jugador a salido de escena por caer al agua
        var outOfScreen = (this.player.y >= game.config.height);
        if(outOfScreen){
            this.bgm.stop();
            this.scene.start("Gameover", {score: this.score});
        }

        //Si el jugador a muerto y la animacion de muerte ha terminado se presenta la pantalla de Gameover
        if(this.player.isDeath && !this.player.anims.isPlaying) {
            this.bgm.stop();
            this.scene.start("Gameover", {score: this.score});
        }
    }

    //Funcion para agregar puntaje cuando se recoje una seta o se vence a un enemigo
    agregarPuntaje() {
        this.score++;
        this.scoreText.setText(["PUNTOS: " + this.score]);
    }

    //Funcion para ver las vidas en el juego
    quitarVidas(){
        this.vidas=this.player.health;
        this.lifeText.setText(["X "+this.vidas]);
    }
    //Funcion para agregar vidas de acuerdo a la puntuacion
    agregarVidas(){
    if(this.score % 10 == 0){
      this.player.health++;
    }
    this.health=this.player.health;
    this.lifeText.setText(["X "+this.health]);
}
}
