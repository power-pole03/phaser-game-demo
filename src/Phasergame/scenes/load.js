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

        const card1 = this.add.sprite(width * 0.2, height * 0.38, 'card-back')
        card1.scale=1.65;
        const card2 = this.add.sprite(width * 0.33, height * 0.38, 'card-back')
        card2.scale=1.65;
        const card3 = this.add.sprite(width * 0.46, height * 0.38, 'card-back')
        card3.scale=1.65;
        const card4 = this.add.sprite(width * 0.59, height * 0.38, 'card-back')
        card4.scale=1.65;
        const card5 = this.add.sprite(width * 0.72, height * 0.38, 'card-back')
        card5.scale=1.65;
        const card6 = this.add.sprite(width * 0.85, height * 0.38, 'card-back')
        card6.scale=1.65;
        const card7 = this.add.sprite(width * 0.2, height * 0.65, 'card-back')
        card7.scale=1.65;
        const card8 = this.add.sprite(width * 0.33, height * 0.65, 'card-back')
        card8.scale=1.65;
        const card9 = this.add.sprite(width * 0.46, height * 0.65, 'card-back')
        card9.scale=1.65;
        const card10 = this.add.sprite(width * 0.59, height * 0.65, 'card-back')
        card10.scale=1.65;
        const card11 = this.add.sprite(width * 0.72, height * 0.65, 'card-back')
        card11.scale=1.65;
        const card12 = this.add.sprite(width * 0.85, height * 0.65, 'card-back')
        card12.scale=1.65;

        this.input.on(Phaser.Input.Events.POINTER_UP, () => {
            this.flip(card1)
        })
        this.input.on(Phaser.Input.Events.POINTER_UP, () => {
            this.flip(card2)
        })
        this.input.on(Phaser.Input.Events.POINTER_UP, () => {
            this.flip(card3)
        })
        this.input.on(Phaser.Input.Events.POINTER_UP, () => {
            this.flip(card4)
        })
        this.input.on(Phaser.Input.Events.POINTER_UP, () => {
            this.flip(card5)
        })
        this.input.on(Phaser.Input.Events.POINTER_UP, () => {
            this.flip(card6)
        })
        this.input.on(Phaser.Input.Events.POINTER_UP, () => {
            this.flip(card7)
        })
        this.input.on(Phaser.Input.Events.POINTER_UP, () => {
            this.flip(card8)
        })
        this.input.on(Phaser.Input.Events.POINTER_UP, () => {
            this.flip(card9)
        })
        this.input.on(Phaser.Input.Events.POINTER_UP, () => {
            this.flip(card10)
        })
        this.input.on(Phaser.Input.Events.POINTER_UP, () => {
            this.flip(card11)
        })
        this.input.on(Phaser.Input.Events.POINTER_UP, () => {
            this.flip(card12)
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
