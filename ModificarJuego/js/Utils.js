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
        juego.load.image("arboles", "res/_PNG/arboles.png");
        juego.load.image("dia-fondo-1", "res/_PNG/dia-fondo-1.png");
        juego.load.image("dia-fondo-2", "res/_PNG/dia-fondo-2.png");
        juego.load.image("decoraciones", "res/_PNG/decoraciones.png");
        juego.load.image("plataformas", "res/_PNG/plataformas.png");
        juego.load.image("cueva-fondo-1", "res/_PNG/cueva-fondo-1.png");
        juego.load.image("cueva-fondo-2", "res/_PNG/cueva-fondo-2.png");
        juego.load.image("cueva-fondo-3", "res/_PNG/cueva-fondo-3.png");
        juego.load.image("cueva-fondo-4", "res/_PNG/cueva-fondo-4.png");
        juego.load.image("cueva-plataformas", "res/_PNG/cueva-plataformas.png");
        juego.load.image("cueva-objetos", "res/_PNG/cueva-objetos.png");
    }

    cargarMusicaFondoField(juego) {
        juego.load.audio("bgmField", ["res/Audio/field_theme.wav"]);
    }

    cargarMusicaFondoNight(juego) {
        juego.load.audio("bgmNight", ["res/Audio/night_theme.wav"]);
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

    configurarCamara(cameras, map, player) {
        //Se define la camara y que siga al jugador mientras se mueve
        cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        cameras.main.startFollow(player);
    }

    configurarColisiones(limites, layer, physics, player) {
        layer.setCollisionByExclusion([-1], true);
        limites.setCollisionByExclusion([-1], true);
        limites.setVisible(false);
        physics.add.collider(player, layer);
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
