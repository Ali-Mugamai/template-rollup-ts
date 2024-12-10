// Bullet.ts
import { Physics, Scene } from 'phaser';

class Bullet extends Physics.Arcade.Image {
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 'bullet'); // 'bullet' should be the key for the bullet image
        scene.add.existing(this);
        scene.physics.world.enable(this);

        this.setVelocityX(300); // Move bullet horizontally to the right
        this.setCollideWorldBounds(true); // Bullet will collide with world bounds
        this.setActive(true); // Mark bullet as active
        this.setVisible(true); // Bullet is visible
    }

    // Optionally, add functionality to destroy bullet when it goes off-screen
    update() {
        if (this.x > 2048 || this.x < 0) { // Adjust the condition for screen bounds
            this.setActive(false);
            this.setVisible(false);
        }
    }
}

export default Bullet;
