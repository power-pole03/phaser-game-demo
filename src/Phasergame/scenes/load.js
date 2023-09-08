import Phaser from "phaser";

export class Load extends Phaser.Scene {
    constructor() {
        super({
            key: 'Load'
        });
    }

    loadFont(name, url) {
        var newFont = new FontFace(name, `url(${url})`);
        newFont.load().then(function (loaded) {
            document.fonts.add(loaded);
        }).catch(function (error) {
            console.error(error);
            return error;
        });
    }

    preload() {
        this.load.image('background', './images/bg.png');
        this.load.image('card-back', './images/back.png');
        this.load.image('card-1or11', './images/1_or_11.png');
        this.load.image('card-double', './images/double.png');
        this.load.image('card-redraw', './images/redraw.png');
        this.load.image('card-resurrect', './images/resurrect.png');
        this.load.image('card-steal', './images/steal.png');
        this.load.image('card-tiebreaker', './images/tie_breaker.png');
    }

    create() {
        this.cameras.main.fadeIn(500, 0, 0, 0);
        this.cameras.main.setBackgroundColor('#081733');

        // this.time.addEvent({
        //     delay: 3900,
        //     callback: () => { this.cameras.main.fadeOut(500, 0, 0, 0) },
        // });

        let bg = this.add.image(0, 0, 'background').setOrigin(0, 0);

        let scaleX = this.cameras.main.width / bg.width;
        let scaleY = this.cameras.main.height / bg.height;
        let scale = Math.max(scaleX, scaleY);
        bg.setScale(scale);
        const { width, height} = this.scale

        const card1 = this.add.sprite(width * 0.5, height * 0.5, 'card-back')
        const card2 = this.add.sprite(width * 0.75, height * 0.2, 'card-back')

        this.input.on(Phaser.Input.Events.POINTER_UP, () => {
            this.flip(card1)
        })
        
        this.input.on(Phaser.Input.Events.POINTER_UP, () => {
            this.flip(card2)
        })
    }
/**
  *@param {Phaser.GameObjects.Sprite} card
*/
    flip(card){
        console.log(card)
        // const timeline = this.tweens.timeline()

        // timeline.
    }
    
}
