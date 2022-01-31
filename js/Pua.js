class Pua extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene,x,y)
    {
        super(scene, x,y, "");
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);      
        this.body.allowGravity = false; 
        this.setVisible(false);
    }
}