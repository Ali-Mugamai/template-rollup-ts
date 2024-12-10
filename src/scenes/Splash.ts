import { Scene } from "phaser";

class SplashScene extends Phaser.Scene {
    private splashSceneBackgroundImage: Phaser.GameObjects.Sprite | null;

    constructor() {
        super({ key: "splashScene" });
        this.splashSceneBackgroundImage = null;
    }

    init(data: any): void {
        this.cameras.main.setBackgroundColor("#ffffff");
    }

    preload(): void {
        console.log("Splash Scene");
        this.load.image("splashSceneBackground", "./assets/test.png");
    }

    create(data: any): void {
        this.splashSceneBackgroundImage = this.add.sprite(
            1920 / 2,
            1080 / 2,
            "splashSceneBackground"
        );
    }

    update(time: number, delta: number): void {
        if (time > 3000) {
            this.scene.start("boot");
        }
    }
}

export default SplashScene;
