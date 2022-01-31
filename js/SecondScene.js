class SecondScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SecondScene' });
    }

    preload() {
      //Se carga el nuevo mapa a presentar en el segundo nivel junto con los recursos necesarios
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

        this.load.audio("bgmNight", ["res/Audio/night_theme.wav"]);
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

        this.input.keyboard.on('keydown-X', this.isAttacking, this);

        this.map.addTilesetImage("Arboles", "arboles");
        this.map.addTilesetImage("Dia-Fondo-1", "dia-fondo-1");
        this.map.addTilesetImage("Dia-Fondo-2", "dia-fondo-2");
        this.map.addTilesetImage("Plataformas", "plataformas");
        this.map.addTilesetImage("Decoraciones", "decoraciones");

        this.map.addTilesetImage("Cueva-Fondo-1", "cueva-fondo-1");
        this.map.addTilesetImage("Cueva-Fondo-2", "cueva-fondo-2");
        this.map.addTilesetImage("Cueva-Fondo-3", "cueva-fondo-3");
        this.map.addTilesetImage("Cueva-Fondo-4", "cueva-fondo-4");
        this.map.addTilesetImage("Cueva-Plataformas", "cueva-plataformas");
        this.map.addTilesetImage("Cueva-Objetos", "cueva-objetos");

        this.map.createLayer("Fondo", ['Dia-Fondo-1', 'Cueva-Fondo-1'], 0, 0);
        this.map.createLayer("Fondo2", ['Dia-Fondo-2', 'Cueva-Fondo-2'], 0, 0);
        this.map.createLayer("Fondo Arboles", ['Arboles', 'Cueva-Fondo-3', 'Cueva-Fondo-4'], 0, 0);
        this.map.createLayer("Frente", 'Arboles', 0, 0);
        this.map.createLayer("Frente2", ['Decoraciones', 'Plataformas', 'Cueva-Objetos'], 0, 0);
        this.map.createLayer("Puas", ['Plataformas', 'Cueva-Plataformas', 'Cueva-Objetos'], 0, 0);
        var tiles = this.map.createLayer("Plataformas", ['Plataformas', 'Cueva-Plataformas', , 'Cueva-Objetos'], 0, 0);

        var plataformas = this.map.createLayer("Plataformas Collider", tiles, 0, 0);
        var limites = this.map.createLayer("Limites", tiles, 0, 0);

        //Se crea un jugador con la vida restante del anterior, y se añade colision con las plataformas
        this.player = new Player(this, 40, 100, this.health);
        plataformas.setCollisionByExclusion([-1], true);
        limites.setCollisionByExclusion([-1], true);
        limites.setVisible(false);
      
        this.physics.add.collider(this.player, plataformas);


        this.cameras.main.setBounds(
            0,
            0,
            this.map.widthInPixels,
            this.map.heightInPixels
        );
        this.cameras.main.startFollow(this.player);

        //Se añaden los objetos tipo Pua al mapa y se define funcion a ejecutar al colisionar con estos
        this.puasGroup = []
        this.puas = this.map.getObjectLayer("puas")["objects"];

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

        //Se añaden los enemigos al nivel y los colisionadores con las plataformas y el jugador
        this.skelletons = []
        this.enemigos = this.map.getObjectLayer("Enemigos")["objects"];
        this.enemigos.forEach((enemigo)=> {
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

      //Sistema de puntuacion en pantalla
      this.scoreText = this.add.text(16, 16, "PUNTOS: " + this.score, {
          fontSize: "20px",
          fill: "#FFF",
          fontFamily: "verdana, arial, sans-serif",
      });

      this.scoreText.setScrollFactor(0);

      //Sistema de vidas en pantalla
      //Imagen
      this.lifeSprite = this.add.image(600,30, 'life3');
      this.lifeSprite.setScale(0.2);
      this.lifeSprite.setScrollFactor(0);
      //Texto
      this.lifeText = this.add.text(622, 18, "X " + this.health, {
          fontSize: "20px",
          fill: "#FFF",
          fontFamily: "verdana, arial, sans-serif",
      });
      this.lifeText.setScrollFactor(0);
      

      this.time.addEvent({ delay: 1000, callback: this.delayDone, callbackScope: this, loop: false });
    }

    //Funcion de ataque que cambia el estado del jugador solo si no esta muerto y no ha atacado todavia
    isAttacking() {
      if(!this.player.isDeath && !this.player.isAttacking) this.player.isAttacking = true;
    }

    delayDone() {
        this.player.body.setSize(this.player.width, this.player.height, true);
    }

    //Funcion para recibir daño de las puas
    puaHit() {
        if (!this.player.isDeath) {
            this.player.checkDamage();
            this.quitarVidas();
        }
    }

    //Funcion para controlar las acciones a ejecutarse cuando collisionan el jugador y el enemigo
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
             this.quitarVidas();
           });
       } else {
         skelleton.die();
         skelleton.once('animationcomplete', () => {
           skelleton.destroy();
           this.skelletons = this.skelletons.filter(_skelleton => _skelleton != skelleton);
           this.agregarPuntaje();
           this.agregarVidas();
         })
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
        
        if(this.player.isDeath && !this.player.anims.isPlaying) {
          this.bgm.stop();
          this.scene.start("Gameover", {score: this.score});
        }
        if (this.player.y > this.map.heightInPixels) {
          this.bgm.stop();
          this.scene.start("Win", {score: this.score});
      }
    }

    //Funcion para agregar puntaje cuando se vence a un enemigo
    agregarPuntaje() {
      this.score++;
      this.scoreText.setText(["PUNTOS: " + this.score]);
  }

  //Funcion para ver las vidas en el juego
  quitarVidas(){
    this.health=this.player.health;
    this.lifeText.setText(["X "+this.health]);
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