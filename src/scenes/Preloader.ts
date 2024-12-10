import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.background = this.add.image(1920 / 2, 1080 / 2, "background");

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(1920 / 2, 1080 / 2, 800, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(1920 / 2 - 400, 1080 / 2, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress: number) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        this.load.image('logo', 'logo.png');
        this.load.image('background', 'logo.png');
        this.load.image('gun1', 'sprit_gun.png');
        this.load.image('gun2', 'assets/sprit_gun_right.png');
        this.load.image('platform', 'image(1).png');
        this.load.image('player1', 'character_idle.png');
        this.load.image('player2', 'character_idle_right_side.png');
        this.load.image('scenery', 'scenery.png');
        this.load.image('logo2', 'final_banner.jpg');
        // In Preloader Scene
        this.load.image('bullet', 'bullet.png');


        


    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('MainMenu');
    }
}
export default Preloader;
