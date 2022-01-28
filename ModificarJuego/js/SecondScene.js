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
        map.createLayer("Plataformas", ['Plataformas', 'Cueva-Plataformas', , 'Cueva-Objetos'], 0, 0);
        var tiles = map.createLayer("Puas", ['Plataformas', 'Cueva-Plataformas', 'Cueva-Objetos'], 0, 0);

        var plataformas = map.createLayer("Plataformas Collider", tiles, 0, 0);
        var puas = map.createLayer("Puas Collider", tiles, 0, 0);
        //enable collisions for every tile

        this.player = new Player(this, 20, 100, this.health);
        plataformas.setCollisionByExclusion([-1], true);
        puas.setCollisionByExclusion([-1], true);
        this.physics.add.collider(this.player, plataformas);
        this.physics.add.collider(this.player, puas);

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

        this.scoreText = this.add.text(16, 16, "PUNTOS: " + this.score, {
            fontSize: "20px",
            fill: "#000",
            fontFamily: "verdana, arial, sans-serif",
        });

        this.scoreText.setScrollFactor(0);

        this.time.addEvent({ delay: 1000, callback: this.delayDone, callbackScope: this, loop: false });

    }

    isAttacking() {
        this.player.isAttacking = true;
    }

    delayDone() {
        this.player.body.setSize(this.player.width, this.player.height, true);
    }

    spriteHit(sprite1, sprite2) {
        if (this.player.isAttacking) {
            sprite1.destroy();
        } else if (!this.player.isDeath) {
            this.player.checkDamage();
        }
        this.agregarPuntaje();
        //sprite1.destroy();

    }

    update(time, delta) {
        this.player.update(time, delta);
        this.player.body.setSize(this.player.width, this.player.height, true);

        if (this.player.x <= 0) {
            this.scene.restart();
        }
    }

    agregarPuntaje() {

        this.score++;
        this.scoreText.setText(["PUNTOS: " + this.score]);
    }
}