class Key extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x,y, "key");
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.anims.create({
            key: "move",
            frames: this.scene.anims.generateFrameNames("sprites_key", {
                start: 1,
                end: 12,
                prefix: "move",
            }),
            frameRate: 10,
            repeat: -1,
        });
    }

    update(time, delta) {
      this.play("move", true);
    }
}
