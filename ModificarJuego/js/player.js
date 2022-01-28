class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, health) {
        super(scene, x, y, "player");
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        //continuación
        this.cursor = this.scene.input.keyboard.createCursorKeys();
        
        this.isAttacking = false;
        this.isDeath = false;
        this.isDamaged = false;
        this.stopMovement = false;
        
        this.health = health;

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
        if(this.body.onFloor() && this.isDeath && !this.stopMovement && !this.isAttacking){
            this.play('death', true);
            this.stopMovement = true;
        } else {
            this.checkAttack();
        }
        
        this.checkMovement();

        if(!this.anims.isPlaying){
            this.isAttacking = false;
            this.isDamaged = false;
        }
    }

    checkAttack(){
        if(this.isAttacking && this.anims.currentAnim.key !== 'attack2' && this.anims.currentAnim.key !== 'attack1'){
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

        if (this.cursor.space.isDown && this.body.onFloor()) {
            this.setVelocityY(-300);
            this.setAccelerationY(250);
        }
        this.debugShowVelocity = true;

        if(!this.body.onFloor()){
            velocityX = 200;
        }

        if(!(this.isAttacking || this.isDamaged || this.isDeath)){
            if (!this.body.onFloor()) {
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

    checkDamage(){
        if(!this.isDamaged){
            this.health -= 1;
        }

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
}
