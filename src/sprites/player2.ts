import { Physics, Scene } from 'phaser';

interface PlayerConfig {
    scene: Scene;
    x: number;
    y: number;
    texture: string;
    shootKey: string; // Added shootKey for shooting
}

class Player2 extends Physics.Arcade.Sprite {
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null;
    private shootKey: Phaser.Input.Keyboard.Key;  // Shoot key
    private shooting: boolean = false;  // To prevent rapid sprite changes when shooting
    public health: number = 100;
    public score: number;

    constructor(config: PlayerConfig, health: number, score: number) {
        super(config.scene, config.x, config.y, config.texture);

        // Enable physics
        config.scene.physics.world.enable(this);
        config.scene.add.existing(this);

        // Set collide with world bounds
        this.setCollideWorldBounds(true);

        // Create cursor keys (for movement)
        this.cursors = config.scene.input.keyboard?.createCursorKeys() || null;

        // Create shoot key
        if (config.scene.input.keyboard) {
            this.shootKey = config.scene.input.keyboard.addKey(config.shootKey) as Phaser.Input.Keyboard.Key;
        } else {
            throw new Error('Keyboard input is not available');
        }

        // health and score
        this.health = health;
        this.score = score;

        // Apply gravity (clarify the type of body)
        (this.body as Phaser.Physics.Arcade.Body).setGravityY(300);
    }

    shoot() {
        if (!this.shooting) {
            this.shooting = true;

            // Randomly change sprite when shooting
            const spriteIndex = Phaser.Math.Between(1, 3); // Randomly pick between sprite1, sprite2, or sprite3
            this.setTexture(`playerSprite2${spriteIndex}`); // Assuming you have playerSprite21, playerSprite22, playerSprite23

            // Revert sprite after a short delay (e.g., 500ms)
            this.scene.time.delayedCall(500, () => {
                this.shooting = false;
                this.setTexture('playerSprite2'); // Reset back to the default sprite
            });
        }
    }

    update() {
        if (!this.cursors) return;

        const speed = 100;

        // Horizontal movement
        if (this.cursors.left?.isDown) {
            this.setVelocityX(-speed);
        } else if (this.cursors.right?.isDown) {
            this.setVelocityX(speed);
        } else {
            this.setVelocityX(0);
        }

        // Jumping
        if (this.cursors.up?.isDown) {
            this.setVelocityY(-150);
        }

        // Shoot if the shoot key is pressed
        if (this.shootKey.isDown) {
            this.shoot();
        }
    }
}

export default Player2;
