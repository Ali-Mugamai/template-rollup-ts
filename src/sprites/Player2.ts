import { Physics, Scene } from 'phaser';
import Bullet from './bullet';  // Correct path for Bullet class

interface PlayerConfig {
    scene: Scene;
    x: number;
    y: number;
    texture: string;
    shootKey: string; // Add shoot key as part of config
}

class Player2 extends Physics.Arcade.Sprite {
    private wasdKeys: {
        W: Phaser.Input.Keyboard.Key;
        A: Phaser.Input.Keyboard.Key;
        S: Phaser.Input.Keyboard.Key;
        D: Phaser.Input.Keyboard.Key;
    } | null;
    private shootKey: Phaser.Input.Keyboard.Key | null;  // Store shoot key
    public health: number = 100;
    public score: number;
    private lastShotTime: number = 0;  // Track the last shot time
    private shootCooldown: number = 450;  // 100ms cooldown between shots

    constructor(config: PlayerConfig, health: number, score: number) {
        super(config.scene, config.x, config.y, config.texture);

        // Enable physics
        config.scene.physics.world.enable(this);
        config.scene.add.existing(this);

        // Set collide with world bounds
        this.setCollideWorldBounds(true);

        // Create WASD keys for movement
        this.wasdKeys = {
            W: config.scene.input.keyboard?.addKey('W') || null,
            A: config.scene.input.keyboard?.addKey('A') || null,
            S: config.scene.input.keyboard?.addKey('S') || null,
            D: config.scene.input.keyboard?.addKey('D') || null,
        };

        // Create shoot key
        this.shootKey = config.scene.input.keyboard?.addKey(config.shootKey) || null;

        // health and score
        this.health = health;
        this.score = score;

        // Apply gravity (have to clarify the type of body)
        (this.body as Phaser.Physics.Arcade.Body).setGravityY(300);
    }

    // Create bullet when shoot key is pressed
    shootBullet() {
        const currentTime = this.scene.time.now;

        // Check if the shoot key was just pressed and if enough time has passed since the last shot
        if (this.shootKey?.isDown && currentTime - this.lastShotTime > this.shootCooldown) {
            // Ensure scene is properly added and physics is set
            const bullet = new Bullet(this.scene, this.x, this.y);
            this.scene.add.existing(bullet);
            this.scene.physics.world.enable(bullet);  // Enable physics for the bullet
            bullet.setVelocityX(-300);  // Move bullet to the left (Player2 shoots to the left)

            // Update the last shot time
            this.lastShotTime = currentTime;
        }

    }

    update() {
        if (!this.wasdKeys) return;

        const speed = 200;

        // Horizontal movement
        if (this.wasdKeys.A.isDown) {
            this.setVelocityX(-speed);
        } else if (this.wasdKeys.D.isDown) {
            this.setVelocityX(speed);
        } else {
            this.setVelocityX(0);
        }

        // Jumping
        if (this.wasdKeys.W.isDown) {
            this.setVelocityY(-150);
        }

        // Call shootBullet method when shoot key is pressed
        this.shootBullet();
    }
}

export default Player2;
