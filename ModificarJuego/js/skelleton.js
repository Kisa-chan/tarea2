class Skelleton extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x,y, "skelleton");
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.velocidad = 50;
        this.playAnim = false;

        this.anims.create({
            key: "walk",
            frames: this.scene.anims.generateFrameNames("sprites_skelleton", {
                start: 1,
                end: 4,
                prefix: "walk-",
            }),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
          key: "attack",
          frames: this.scene.anims.generateFrameNames("sprites_skelleton", {
              start: 1,
              end: 8,
              prefix: "attack-",
          }),
          frameRate: 30
        });
        this.anims.create({
          key: "death",
          frames: this.scene.anims.generateFrameNames("sprites_skelleton", {
              start: 1,
              end: 4,
              prefix: "death-",
          }),
          frameRate: 10
        });
    }

    update(time, delta) {
    if (this.body.onFloor() && !this.playAnim) {
        if (this.velocidad < 0) {
          this.setFlipX(true);
        } else{
          this.setFlipX(false);
        }
      }
      if (this.body.onWall()) {
        this.velocidad = this.velocidad * -1;
      }
      if (!this.playAnim) {
        this.setVelocityX(this.velocidad);
      } else {
        this.setVelocityX(0);
      }
      
      if (!this.playAnim) {
        this.play("walk", true);
      }
    }

    attack() {
      this.playAnim = true;
      this.play("attack", true);
      this.once('animationcomplete', () => {
        this.playAnim = false;
      })
    }

    die() {
      this.playAnim = true;
      this.play("death", false);
      this.once('animationcomplete', () => {
        this.playAnim = false;
      })
    }
}
