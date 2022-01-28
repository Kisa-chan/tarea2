class Bat extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x,y, "bat");
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.velocidad = 50;
        this.playAttack = false;

        this.anims.create({
            key: "idle",
            frames: this.scene.anims.generateFrameNames("sprites_bat", {
                start: 1,
                end: 6,
                prefix: "idle-",
            }),
            frameRate: 10,
            repeat: -1,
        });
        this.attackAnim = this.anims.create({
          key: "attack",
          frames: this.scene.anims.generateFrameNames("sprites_bat", {
              start: 1,
              end: 8,
              prefix: "attack-",
          }),
          frameRate: 10
      });
    }

    update(time, delta) {
    if (this.body.onFloor()) {
        if (this.velocidad < 0) {
          this.setFlipX(false);
        } else{
          this.setFlipX(true);
        }
      }
      if (this.body.onWall()) {
        this.velocidad = this.velocidad * -1;
      }

      this.setVelocityX(this.velocidad);
      if (!this.playAttack) {
        this.play("idle", true);
      }
    }

    attack() {
      this.playAttack = true;
    }
}
