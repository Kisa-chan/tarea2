class Boss extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, player, beamSound) {
        super(scene, x, y, "boss");
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.velocidad = 100;
        this.player = player;
        this.health = 12;
        this.playAnim = false;
        this.attackSuccess = false;
        this.isDamaged = false;
        this.hasImmunity = false;
        this.movingRight = true;
        this.bossVictory = false;
        this.isAwake = false;
        this.isAttackingLaser = false;
        this.isJumpAttack = false;
        this.temporalPos;
        this.beforeLaserPos;
        this.beamSound = beamSound;

        this.hpBar = new HealthBar(scene, x, y - 20, this.health);
        

        this.anims.create({
            key: "walk",
            frames: this.scene.anims.generateFrameNames("sprites_boss", {
                start: 1,
                end: 4,
                prefix: "walk-",
            }),
            frameRate: 5,
            repeat: -1,
        });
        this.anims.create({
            key: "defense",
            frames: this.scene.anims.generateFrameNames("sprites_boss", {
                start: 1,
                end: 12,
                prefix: "defense-",
            }),
            frameRate: 5
        });
        this.anims.create({
            key: "attack",
            frames: this.scene.anims.generateFrameNames("sprites_boss", {
                start: 1,
                end: 7,
                prefix: "attack-",
            }),
            frameRate: 10
        });
        this.anims.create({
            key: "laser",
            frames: this.scene.anims.generateFrameNames("sprites_boss", {
                start: 1,
                end: 27,
                prefix: "laser-",
            }),
            frameRate: 10
        });
        this.anims.create({
            key: "dead",
            frames: this.scene.anims.generateFrameNames("sprites_boss", {
                start: 1,
                end: 6,
                prefix: "dead-",
            }),
            frameRate: 5,
            repeat: 0
        });
        this.anims.create({
            key: "hit",
            frames: this.scene.anims.generateFrameNames("sprites_boss", {
                start: 1,
                end: 1,
                prefix: "hit-",
            }),
            frameRate: 30,
            repeat: 0
        });

        this.play("dead", true);
    }

    update(time, delta) {
        console.log(this.health);
        if(!this.beforeLaserPos){
            this.hpBar.updatePosition(this.body.position.x + 10, this.body.position.y - 20, this.scene);
        } else {
            this.hpBar.updatePosition(this.beforeLaserPos + 10, this.body.position.y - 20, this.scene);
        }

        let distanceX = Math.abs(this.player.body.position.x - this.body.position.x);
        if (this.body.onFloor() && this.isJumpAttack) {
            this.velocidad = 100;
            this.isJumpAttack = false;
            this.attackSuccess = false;
        }

        if (!this.isAwake) {
            if (distanceX < 300 && this.anims.currentAnim.key === 'dead') {
                this.playReverse("dead", true);
                this.once('animationcomplete', () => {
                    this.isAwake = true;
                });
            }
        }
        if (this.health > 0 && this.isAwake) {
            if (this.anims.currentAnim.key === 'laser' && this.frame.name.substring(6) > 15) {
                this.attackSuccess = true;
                if (!this.movingRight && this.body.position.x != this.temporalPos) {
                    this.body.position.x -= Math.abs(this.body.position.x - this.temporalPos);
                    this.temporalPos = this.body.position.x;
                } else {
                    this.body.position.x = this.temporalPos;
                }
            } else if (this.beforeLaserPos && this.body.position.x != this.beforeLaserPos) {
                this.body.position.x = this.beforeLaserPos;
                this.visible = true;
            }

            if (this.player.health > 0) {
                let distanceY = Math.abs(this.player.body.position.y - this.body.position.y);
                if(distanceY < 200 && distanceX < 5){
                    this.setVelocityX(0);
                    if(distanceY == 80){
                        this.jumpAttack();
                    }
                } else {
                    this.checkPlayerPosition();
                }
            } else {
                this.velocidad = 0;
            }

            if (!this.isAttackingLaser) {
                if (!this.playAnim) {
                    this.play("walk", true);
                    this.beforeLaserPos = undefined;
                    this.temporalPos = undefined;
                } else {
                    this.setVelocityX(0);
                }
            }

            

            if (this.anims.currentAnim.key !== 'defense' && !this.isAttackingLaser) {
                let inHitRange = false;
                let inDamageRange = false;
                if ((!this.movingRight && distanceX < 50) || (this.movingRight && distanceX < 150 && distanceX > 20)) inHitRange = true;
                if ((!this.movingRight && distanceX < 50) || (this.movingRight && distanceX < 150)) inDamageRange = true;
                if (distanceX < 350 && distanceX > 300 && !this.isJumpAttack) {
                    this.jumpAttack();
                }

                if (this.anims.currentAnim.key === 'attack' && this.frame.name === 'attack-7' && inHitRange) {
                    this.attackSuccess = true;
                }

                if (!this.isDamaged && inDamageRange && this.player.isAttacking) {
                    this.damage();
                }

                if (!this.player.isAttacking && !this.hasImmunity && this.player.anims.currentAnim && this.player.anims.currentAnim.key !== 'attack2' && this.player.anims.currentAnim.key !== 'attack1') {
                    var self = this;
                    this.hasImmunity = true;
                    setTimeout(function() {
                        self.isDamaged = false;
                        self.hasImmunity = false;
                    }, 2000);
                    
                }
            }
        }
    }

    checkPlayerPosition() {
        if (!this.isAttackingLaser && this.anims.currentAnim.key !== 'attack') {
            if (this.body.position.x > this.player.body.position.x) {
                this.setVelocityX(-this.velocidad);
                this.setFlipX(true);
                this.movingRight = false;
            } else if (this.body.position.x < this.player.body.position.x) {
                this.setVelocityX(this.velocidad);
                this.setFlipX(false);
                this.movingRight = true;
            }
        }
    }

    attack() {
        if (!this.isAttackingLaser && this.visible) {
            this.playAnim = true;
            this.play("attack", true);
            this.once('animationcomplete', () => {
                this.playAnim = false;
            });
        }
    }

    jumpAttack() {
        this.setVelocityY(-300);
        this.setAccelerationY(250);
        this.attackSuccess = true;
        this.isJumpAttack = true;
        this.velocidad = 200;
    }

    damage() {
        if (!this.isDamaged) {
            this.isDamaged = true;
            this.health--;
            this.hpBar.updateHealth(this.health * 10);
            this.play("hit", true);
        }

        if (this.health <= 0) {
            this.playAnim = true;
            this.setVelocityX(0);
            this.bossVictory = true;
            this.play("dead", false);
            this.once('animationcomplete', () => {
                this.playAnim = false;
            });
        } else if (this.health % 6 == 0) {
            this.isAttackingLaser = true;
            this.temporalPos = this.body.position.x;
            this.beforeLaserPos = this.body.position.x;
            this.play("defense", false);
            this.once('animationcomplete', () => {
                this.play("laser", false);
                this.beamSound.play();
                this.once('animationcomplete', () => {
                    this.visible = false;
                    this.isAttackingLaser = false;
                    this.attackSuccess = false;
                    this.play('hit', false);
                    this.body.position.x = this.beforeLaserPos;
                });
            });
        }
    }
}