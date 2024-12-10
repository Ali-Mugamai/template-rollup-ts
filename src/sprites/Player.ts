import { Physics, Scene } from 'phaser';

interface PlayerConfig {
    scene: Scene;
    x: number;
    y: number;
    texture: string;
    shootKey: string; // Added shootKey to handle shooting
}

class Player extends Physics.Arcade.Sprite {
    private keys: { W: Phaser.Input.Keyboard.Key; A: Phaser.Input.Keyboard.Key; S: Phaser.Input.Keyboard.Key; D: Phaser.Input.Keyboard.Key };
    private shootKey: Phaser.Input.Keyboard.Key;  // Shoot key
    private shooting: boolean = false;  // To avoid changing sprite multiple times rapidly
    public health: number = 100;
    public score: number;

    constructor(config: PlayerConfig, health: number, score: number) {
        super(config.scene, config.x, config.y, config.texture);

        // Enable physics
        config.scene.physics.world.enable(this);
        config.scene.add.existing(this);

        // Set collide with world bounds
        this.setCollideWorldBounds(true);

        // Create WASD keys
        this.keys = config.scene.input.keyboard?.addKeys('W,A,S,D') as {
            W: Phaser.Input.Keyboard.Key;
            A: Phaser.Input.Keyboard.Key;
            S: Phaser.Input.Keyboard.Key;
            D: Phaser.Input.Keyboard.Key;
        };

        // Create shoot key
        const shootKey = config.scene.input.keyboard?.addKey(config.shootKey);
        if (!shootKey) {
            throw new Error(`Failed to create shoot key: ${config.shootKey}`);
        }
        this.shootKey = shootKey;

        // health and score
        this.health = health;
        this.score = score;

        // Apply gravity (have to clarify the type of body)
        (this.body as Phaser.Physics.Arcade.Body).setGravityY(300);
    }

    shoot() {
        if (!this.shooting) {
            this.shooting = true;

            // Randomly change sprite when shooting
            const spriteIndex = Phaser.Math.Between(1, 3); // Randomly pick between sprite1, sprite2, or sprite3
            this.setTexture(`playerSprite${spriteIndex}`); // Assuming you have playerSprite1, playerSprite2, playerSprite3

            // Revert sprite after a short delay (e.g., 500ms)
            this.scene.time.delayedCall(500, () => {
                this.shooting = false;
                this.setTexture('playerSprite'); // Reset back to the default sprite
            });
        }
    }

    update() {
        const speed = 100;

        // Horizontal movement
        if (this.keys.A.isDown) {
            this.setVelocityX(-speed);
        } else if (this.keys.D.isDown) {
            this.setVelocityX(speed);
        } else {
            this.setVelocityX(0);
        }

        // Jumping
        if (this.keys.W.isDown) {
            this.setVelocityY(-150);
        }

        // Shoot if the shoot key is pressed
        if (this.shootKey.isDown) {
            this.shoot();
        }
    }
}

export default Player;
