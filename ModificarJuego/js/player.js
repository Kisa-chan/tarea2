class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, health) {
        super(scene, x, y, "player");
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.cursor = this.scene.input.keyboard.createCursorKeys();
        //Se definen propiedades para controlar los estados del jugador y sus animaciones
        this.isAttacking = false;
        this.isDeath = false;
        this.isDamaged = false;
        this.stopMovement = false;
        this.gameOver = false;
        
        this.health = health;
        this.haveKey = false;
        //Se crean las animaciones del jugador
        this.anims.create({
            key: 'run',
            frames: this.scene.anims.generateFrameNames('sprites_jugador', { start: 1, end: 8, prefix: 'run-' }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'idle',
            frames: this.scene.anims.generateFrameNames('sprites_jugador', { start: 1, end: 8, prefix: 'idle-' }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            frames: this.scene.anims.generateFrameNames('sprites_jugador', { start: 1, end: 2, prefix: 'jump-' }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'fall',
            frames: this.scene.anims.generateFrameNames('sprites_jugador', { start: 1, end: 2, prefix: 'fall-' }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'attack1',
            frames: this.scene.anims.generateFrameNames('sprites_jugador', { start: 1, end: 2, prefix: 'attack1-' }),
            frameRate: 10,
            repeat: 0
        });

        this.anims.create({
            key: 'attack2',
            frames: this.scene.anims.generateFrameNames('sprites_jugador', { start: 1, end: 2, prefix: 'attack2-' }),
            frameRate: 10,
            repeat: 0
        });

        this.anims.create({
            key: 'damage',
            frames: this.scene.anims.generateFrameNames('sprites_jugador', { start: 1, end: 4, prefix: 'damage-' }),
            frameRate: 5,
            repeat: 0
        });

        this.anims.create({
            key: 'death',
            frames: this.scene.anims.generateFrameNames('sprites_jugador', { start: 1, end: 6, prefix: 'death-' }),
            frameRate: 2,
            repeat: 0
        });
    }

    update(time, delta) {
        //Primero se comprueba que el jugador no esta muerto, de ser asi se ejecuta la animacion y se restringe todo movimiento
        //Caso contrario se comprueba si esta atacando
        if(this.body.onFloor() && this.isDeath && !this.stopMovement && !this.isAttacking){
            this.play('death', true);
            this.once('animationcomplete', () => {
                this.gameOver = true;
            });
            this.stopMovement = true;
        } else {
            this.checkAttack();
        }
        
        //Después se comprueba el movimiento
        this.checkMovement();

        //Finalmente se comprueba que ninguna animacion este activada antes de cambiar el estado de daño o ataque para evitar una sobreposicion de animaciones
        //con las animaciones de movimiento
        if(!this.anims.isPlaying){
            this.isAttacking = false;
            this.isDamaged = false;
        }
    }

    //Se verifica si el jugador esta atacando y de ser el caso se ejecuta aleatoriamente uno de dos ataques para dar variedad
    checkAttack(){
        if(this.isAttacking && this.anims.currentAnim.key !== 'attack2' && this.anims.currentAnim.key !== 'attack1' && this.anims.currentAnim.key !== 'damage'){
            this.setVelocityX(0);
            if(Math.floor(Math.random() * 10) > 4){
                this.play('attack2', true);
            } else{
                this.play('attack1', true);
            }
        }        
    }

    checkMovement(){
        let velocityX = 250;

        //Si esta saltando se cambia la velocidad de Y
        if (this.cursor.space.isDown && this.body.onFloor()) {
            this.setVelocityY(-340);
            this.setAccelerationY(300);
        }

        //En caso de que se encuentre saltando se cambia la velidad de X para evitar que pueda saltar una distancia exagerada
        //se comprueba si esta subiendo o bajando y se cambia la animacion de forma correspondiente
        //sino se comprueba si se esta moviendo para correr y si no se muestra la animacion idle
        if(!(this.isAttacking || this.isDamaged || this.isDeath)){
            if (!this.body.onFloor()) {
                velocityX = 200;
                if (this.body.velocity.y < 0  ){
                    this.play('jump', true);
                } else {
                    this.play('fall', true);
                }
            } else if (this.body.velocity.x != 0)
                this.play('run', true);
            else
                this.play('idle', true);
        }

        //Si no esta muerto y no esta atacando se permite el movimiento del personaje
        if(!this.isDeath && !this.isAttacking){
            if (this.cursor.left.isDown) {
                this.setVelocityX(-velocityX);
                this.setFlipX(true);
            } else if (this.cursor.right.isDown) {
                this.setVelocityX(velocityX);
                this.setFlipX(false);
            } else {
                this.setVelocityX(0);
            }
        }
    }

    checkEnviromentDamage(){
        if(!this.isDamaged && this.anims.currentAnim.key !== 'attack2' && this.anims.currentAnim.key !== 'attack1'){
            this.health -= 1;
            this.checkHealth();
        }
    }

    checkDamage(){
        //Se comprueba que no este recibiendo daño actualmente y que no este atacando, ya que la animacion de ataque puede sobreponer el collider del jugador
        //con el de las puas, provocando un comportamiento no deseado. Sin embargo si realmente esta siendo lastimado por las puas, se registra el daño aun si
        //continua atacando
        if(!this.isDamaged){
            this.health -= 1;
            this.checkHealth();
        }
    }

    checkHealth(){
        //Si la vida llega a cero se cambia el estado a muerto y se detiene el movimiento
        //caso contrario se ejecuta la animacion de daño y se mueve ligeramente la posicion del jugador para dar feedback de ser lastimado.
        if(this.health <= 0){
            this.isDeath = true;
            this.setVelocityX(0);
        } else if(!this.isDamaged) {
            this.isDamaged = true;
            this.play('damage', true);
            if (this.body.velocity.x < 0  ) this.body.position.x += 50; 
            else if (this.body.velocity.x > 0  ) this.body.position.x -= 50; 
        }
    }

    setHaveKey(value) {
      console.log(value);
      this.haveKey = value;
    }
}
