class HealthBar {

    constructor(scene, x, y, value) {
        this.bar = new Phaser.GameObjects.Graphics(scene);

        this.x = x;
        this.y = y;
        this.value = value * 10;
        this.fullHealth = value * 10;
        this.p = 76 / (value * 10);

        this.draw();
    }

    updateHealth(amount) {
        this.value = amount;
        this.draw();
    }

    draw() {
        this.bar.clear();

        if (this.value > 0) {
            //  BG
            this.bar.fillStyle(0x000000);
            this.bar.fillRect(this.x, this.y, 80, 16);

            //  Health

            this.bar.fillStyle(0xffffff);
            this.bar.fillRect(this.x + 2, this.y + 2, 76, 12);
        }


        if ((this.value * 100) / this.fullHealth < 40) {
            this.bar.fillStyle(0xD92626);
        } else {
            this.bar.fillStyle(0x179AD4);
        }

        var d = Math.floor(this.p * this.value);

        this.bar.fillRect(this.x + 2, this.y + 2, d, 12);

    }

    updatePosition(x, y, scene) {
        this.x = x;
        this.y = y;
        this.draw();
        scene.add.existing(this.bar);
    }

}