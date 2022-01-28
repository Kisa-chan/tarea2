class MainScene extends Phaser.Scene {

    constructor(){
        super({key: 'MainScene'});
    }

    preload() {
        this.load.tilemapTiledJSON("map", "res/Map.json");
        this.load.image("tiles", "res/Tileset.png");
        this.load.image("bg-1", "res/sky.png");
        this.load.image("sea", "res/sea.png");
        this.load.image("player", "res/idle-1.png");
        
        //Phaser.Physics.Arcade.Sprite
        // https://gammafp.com/tool/atlas-packer/
       /* this.load.atlas(
            "sprites_jugador",
            "res/player_anim/player_anim.png",
            "res/player_anim/player_anim_atlas.json"
        );*/
        this.load.atlas('sprites_jugador', 'res/player_anim/hero_sprites.png',
            'res/player_anim/hero_anim.json');
        this.load.spritesheet('tilesSprites','res/Tileset.png',
        { frameWidth: 32, frameHeight: 32 });
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

        this.input.keyboard.on('keydown-X', this.isAttacking, this);

        var tiles = this.map.addTilesetImage("Plataformas", "tiles");

        var layer2 = this.map.createLayer("Fondo", tiles, 0, 0);
        var layer = this.map.createLayer("Suelo", tiles, 0, 0);

        //necesitamos un player
        this.player = new Player(this, 20, 100, 3);

        //enable collisions for every tile
        layer.setCollisionByExclusion([-1], true);
        this.physics.add.collider(this.player, layer);

        this.cameras.main.setBounds(
            0,
            0,
            this.map.widthInPixels,
            this.map.heightInPixels
        );
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(
            0,
            0,
            this.map.widthInPixels,
            this.map.heightInPixels
        );

       this.objetos = this.map.getObjectLayer("objetos")["objects"];
        this.setas = [];
        for (var i = 0; i < this.objetos.length; ++i) {
            var obj = this.objetos[i];
            if (obj.gid == 115) {
                // en mi caso la seta
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
        this.score = 0;
        this.scoreText = this.add.text(16, 16, "PUNTOS: " + this.score, {
            fontSize: "20px",
            fill: "#000",
            fontFamily: "verdana, arial, sans-serif",
        });

        this.scoreText.setScrollFactor(0);

        this.time.addEvent({delay: 1000, callback: this.delayDone, callbackScope: this, loop: false});

    }

    isAttacking(){
        this.player.isAttacking = true;
    }

    delayDone(){
        this.player.body.setSize(this.player.width, this.player.height, true);
    }

    spriteHit(sprite1, sprite2) {
        if(this.player.isAttacking){
           // sprite1.destroy();
        } else if(!this.player.isDeath) {
            this.player.checkDamage();
        }
        this.agregarPuntaje();
        sprite1.destroy();

    }

    update(time, delta) {
        this.player.update(time, delta);
        this.player.body.setSize(this.player.width, this.player.height, true);

        var outOfScreen = (this.player.y >= game.config.height);

        if (this.player.x > this.map.widthInPixels) {
            this.scene.start("SecondScene", {score: this.score, health: this.player.health});
        }

        if(outOfScreen){
            this.scene.start("Gameover");
        }
    }

    agregarPuntaje() {
        this.score++;
        this.scoreText.setText(["PUNTOS: " + this.score]);
    }
}
