class Utils {
    //Funcion para agregar vidas de acuerdo a la puntuacion
    agregarVidas(juego) {
        if (juego.score % 10 == 0) {
            juego.player.health++;
        }
        juego.health = juego.player.health;
        juego.lifeText.setText(["X " + juego.health]);
    }

    //Funcion para agregar puntaje cuando se vence a un enemigo o se toma una seta
    agregarPuntaje(juego) {
        juego.score++;
        juego.scoreText.setText(["PUNTOS: " + juego.score]);
    }

    //Funcion para ver las vidas en el juego
    quitarVidas(juego) {
        juego.vidas = juego.player.health;
        juego.lifeText.setText(["X " + juego.vidas]);
    }

    cargarMapaPrimeraEscena(juego) {
        juego.load.tilemapTiledJSON("map", "res/Map.json");
        juego.load.image("tiles", "res/Tileset.png");
        juego.load.image("bg-1", "res/sky.png");
        juego.load.image("sea", "res/sea.png");
    }

    cargarMapaSegundaEscena(juego) {
        juego.load.tilemapTiledJSON("map-2", "res/New-Map.json");
        juego.load.image("arboles", "res/MapSprites/arboles.png");
        juego.load.image("dia-fondo-1", "res/MapSprites/dia-fondo-1.png");
        juego.load.image("dia-fondo-2", "res/MapSprites/dia-fondo-2.png");
        juego.load.image("decoraciones", "res/MapSprites/decoraciones.png");
        juego.load.image("plataformas", "res/MapSprites/plataformas.png");
        juego.load.image("cueva-fondo-1", "res/MapSprites/cueva-fondo-1.png");
        juego.load.image("cueva-fondo-2", "res/MapSprites/cueva-fondo-2.png");
        juego.load.image("cueva-fondo-3", "res/MapSprites/cueva-fondo-3.png");
        juego.load.image("cueva-fondo-4", "res/MapSprites/cueva-fondo-4.png");
        juego.load.image("cueva-plataformas", "res/MapSprites/cueva-plataformas.png");
        juego.load.image("cueva-objetos", "res/MapSprites/cueva-objetos.png");
    }

    cargarMapaPeleaBoss(juego) {
        juego.load.tilemapTiledJSON("boss-map", "res/Boss-Scene.json");
        juego.load.image("sky", 'res/MapSprites/BG-sky.png');
        juego.load.image("mountains", 'res/MapSprites/BG-mountains.png');
        juego.load.image("ruins", 'res/MapSprites/BG-ruins.png');
        juego.load.image("sun", 'res/MapSprites/BG-sun.png');
        juego.load.image("plataformas", 'res/MapSprites/BossPlataformas.png');
    }

    cargarMusicaFondoField(juego) {
        juego.load.audio("bgmField", ["res/Audio/field_theme.wav"]);
    }

    cargarMusicaFondoNight(juego) {
        juego.load.audio("bgmNight", ["res/Audio/night_theme.wav"]);
    }

    cargarMusicaFondoBoss(juego) {
        juego.load.audio("bgmBoss", ["res/Audio/boss_theme.mp3"]);
        juego.load.audio("beamEffect", ["res/Audio/heavy-beam.mp3"]);
        juego.load.audio("victorySound", ["res/Audio/victory-sound.mp3"]);
    }

    salirEscene(juego) {
        clearTimeout(juego.evento);
        juego.scene.start("Inicio");
    }

    cargarJugador(juego) {
        juego.load.atlas(
            "sprites_jugador",
            "res/player_anim/hero_sprites.png",
            "res/player_anim/hero_anim.json"
        );
    }

    cargarEnemigos(juego) {
        juego.load.image("bat", "res/idle-bat-1.png");
        juego.load.atlas(
            "sprites_bat",
            "res/bat_anim/bat-atlas.png",
            "res/bat_anim/bat-atlas.json"
        );
        juego.load.image("skelleton", "res/idle-skelleton-1.png");
        juego.load.atlas(
            "sprites_skelleton",
            "res/skelleton_anim/skelleton-atlas.png",
            "res/skelleton_anim/skelleton-atlas.json"
        );
        juego.load.atlas('sprites_boss', 'res/BossSprites/Boss-anim3.png',
            'res/BossSprites/boss-anim.json');
    }

    cargarLlaves(juego) {
      juego.load.image("key", "res/key.png");
      juego.load.atlas(
        "sprites_key",
        "res/key_anim/key-atlas.png",
        "res/key_anim/key-atlas.json"
      )
    }

    agregarTilesMapaSegundaEscena(map) {
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

        map.createLayer("Fondo", ["Dia-Fondo-1", "Cueva-Fondo-1"], 0, 0);
        map.createLayer("Fondo2", ["Dia-Fondo-2", "Cueva-Fondo-2"], 0, 0);
        map.createLayer(
            "Fondo Arboles",
            ["Arboles", "Cueva-Fondo-3", "Cueva-Fondo-4"],
            0,
            0
        );
        map.createLayer("Frente", "Arboles", 0, 0);
        map.createLayer(
            "Frente2",
            ["Decoraciones", "Plataformas", "Cueva-Objetos"],
            0,
            0
        );
        map.createLayer(
            "Puas",
            ["Plataformas", "Cueva-Plataformas", "Cueva-Objetos"],
            0,
            0
        );
    }

    agregarTilesMapaBoss(map) {
        map.addTilesetImage("BG-sky", "sky");
        map.addTilesetImage("BG-ruins", "ruins");
        map.addTilesetImage("BG-mountains", "mountains");
        map.addTilesetImage("BG-sun", "sun");
        map.addTilesetImage("BossPlataformas", "plataformas");
        map.createLayer("Sky", 'BG-sky', 0, 0);
        map.createLayer("Mountains", ['BG-mountains', 'BG-sun'], 0, 0);
        map.createLayer("Ruins", 'BG-ruins', 0, 0);
    }

    configurarCamara(cameras, map, player) {
        //Se define la camara y que siga al jugador mientras se mueve
        cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        cameras.main.startFollow(player);
    }

    configurarColisiones(layer, physics, player, limites) {
        layer.setCollisionByExclusion([-1], true);
        physics.add.collider(player, layer);
        if(limites){
            limites.setCollisionByExclusion([-1], true);
            limites.setVisible(false);
        }
    }

    visualizarPuntuacion(juego) {
        juego.scoreText = juego.add.text(16, 16, "PUNTOS: " + juego.score, {
            fontSize: "20px",
            fill: "#000",
            fontFamily: "verdana, arial, sans-serif",
        });
        juego.scoreText.setScrollFactor(0);
    }

    visualizarVidas(juego) {
        /* Imagen */
        juego.lifeSprite = juego.add.image(600, 30, "life3");
        juego.lifeSprite.setScale(0.2);
        juego.lifeSprite.setScrollFactor(0);
        /* Texto */
        juego.vidas = juego.player.health;
        juego.lifeText = juego.add.text(622, 18, "X " + juego.vidas, {
            fontSize: "20px",
            fill: "#000",
            fontFamily: "verdana, arial, sans-serif",
        });
        juego.lifeText.setScrollFactor(0);
    }

    visualizarLlave(juego) {
        juego.keySprite = juego.add.image(700, 30, "key1");
        juego.keySprite.setScale(1.5);
        juego.keySprite.setScrollFactor(0);
    }

    //Funcion de ataque que cambia el estado del jugador solo si no esta muerto y no ha atacado todavia
    isAttacking(juego) {
        if (!juego.player.isDeath && !juego.player.isAttacking)
            juego.player.isAttacking = true;
    }

    //body.setSize se utiliza para que el collider del objeto tenga el tamaño igual al definido en el json de animaciones
    delayDone(player) {
        player.body.setSize(player.width, player.height, true);
    }
}
