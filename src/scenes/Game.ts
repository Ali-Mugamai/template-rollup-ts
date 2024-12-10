import Phaser from 'phaser';
import Player from '../sprites/Player';
import Player2 from '../sprites/player2';

export class Game extends Phaser.Scene {
    private camera: Phaser.Cameras.Scene2D.Camera;
    private background: Phaser.GameObjects.TileSprite;
    private healthText: Phaser.GameObjects.Text;
    private scoreText: Phaser.GameObjects.Text;
    private helpText: Phaser.GameObjects.Text;

    private player1: Player | null = null;
    private player2: Player2 | null = null; // Create player2 reference
    private platforms: Phaser.Physics.Arcade.Group;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
    private finalScore: number = 0;

    constructor() {
        super('Game');
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBounds(0, 0, 2048, 576);

        // Add background as a TileSprite for repeating background
        this.background = this.add.tileSprite(0, 0, 2048, 576, 'logo2').setOrigin(0, 0);
        this.background.setScrollFactor(0);

        // Set the world bounds so the player can't go below y = 450
        this.physics.world.setBounds(0, 0, 1048, 450);

        // Create Player 1 and add to scene
        this.player1 = new Player({
            scene: this,
            x: 100,
            y: 450,
            texture: 'player1',
            shootKey: 'SPACE' // Space key for Player 1 to shoot
        }, 100, 0);

        this.add.existing(this.player1);

        // Create Player 2 and add to scene
        this.player2 = new Player2({
            scene: this,
            x: 600,
            y: 450,
            texture: 'player2',
            shootKey: 'ENTER' // Enter key for Player 2 to shoot
        }, 100, 0);

        this.add.existing(this.player2);

        // Set player body properties
        const player1Body = this.player1.body as Phaser.Physics.Arcade.Body;
        player1Body.setAllowGravity(true);
        player1Body.setImmovable(false);

        const player2Body = this.player2.body as Phaser.Physics.Arcade.Body;
        player2Body.setAllowGravity(true);
        player2Body.setImmovable(false);


        // Initialize platforms group
        this.platforms = this.physics.add.group({
            immovable: true,
            allowGravity: false
        });

        // Generate platforms every 500 pixels, with a y between 300 and 450
        for (let counter = 0; counter < 2048; counter += 100) {
            const y = Phaser.Math.Between(200, 300);
            this.createPlatform(counter, y, 'platform', 1);
        }

        // Set collisions between players and platforms
        this.physics.add.collider(this.player1, this.platforms);
        this.physics.add.collider(this.player2, this.platforms);

        // Create text for player's health and score
        this.healthText = this.add.text(850, 10, 'Health: ' + (this.player1?.health ?? 0), {
            fontFamily: 'Arial Black',
            fontSize: 24,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setScrollFactor(0);

        this.scoreText = this.add.text(850, 30, 'Score: ' + (this.player1?.score ?? 0), {
            fontFamily: 'Arial Black',
            fontSize: 24,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setScrollFactor(0);

        this.helpText = this.add.text(10, 10, 'Use WASD (Player 1) / Arrow keys (Player 2) to move, space/enter to shoot', {
            fontFamily: 'Arial Black',
            fontSize: 24,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setScrollFactor(0);
    }

    // create platforms
    createPlatform(x: number, y: number, key: string, scale: number) {
        const platform = this.physics.add.sprite(x, y, key).setScale(scale);
        this.platforms.add(platform);
    }

    update() {
        if (this.player1 && this.player2) {
            // Update Player 1
            this.player1.update();

            // Update Player 2
            this.player2.update();

            // Update the background's tile position based on Player 1's movement
            if (this.player1.body) {
                this.background.tilePositionX += this.player1.body.velocity.x * this.game.loop.delta / 1000;
            }

            // Make sure the camera follows Player 1
            this.camera.scrollX = this.player1.x - this.camera.width / 2;
            this.camera.scrollY = this.player1.y - this.camera.height / 2;

            // Update text displaying Player 1's health and score
            this.healthText.setText('Health: ' + this.player1.health);
            this.scoreText.setText('Score: ' + this.player1.score);

            // Check if Player 1's health is 0, go to game over
            if (this.player1.health == 0) {
                this.finalScore = this.player1.score;
                this.scene.start('GameOver', { score: this.finalScore });
            }

            // Check if Player 2's health is 0, go to game over
            if (this.player2.health == 0) {
                this.finalScore = this.player2.score;
                this.scene.start('GameOver', { score: this.finalScore });
            }
        }
    }
}

export default Game;
