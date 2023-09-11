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

        let bg = this.add.image(0, 0, 'background').setOrigin(0, 0);
        let scaleX = this.cameras.main.width / bg.width;
        let scaleY = this.cameras.main.height / bg.height;
        let scale = Math.max(scaleX, scaleY);
        bg.setScale(scale);

        const { width, height} = this.scale;

        // Create the cards and store them in an array
        const cards = [];
        for (let i = 0; i < 12; i++) {
            const x = width * (0.2 + (i % 6 * 0.13));
            const y = height * (i < 6 ? 0.38 : 0.65);
            const card = this.add.sprite(x, y, 'card-back').setScale(1.65);
            cards.push(card);
        }

        this.input.on(Phaser.Input.Events.POINTER_UP, (pointer) => {
            const clickedCard = cards.find(card => Phaser.Geom.Rectangle.Contains(card.getBounds(), pointer.x, pointer.y));
            if (clickedCard) {
                this.flip(clickedCard);
            }
        });
    }

    flip(card) {
        const cardTypes = [
            'card-1or11', 'card-double', 'card-redraw', 'card-resurrect',
            'card-steal', 'card-tiebreaker'
        ];

        const isCardFaceUp = cardTypes.includes(card.texture.key);
        const targetTexture = isCardFaceUp ? 'card-back' : Phaser.Utils.Array.GetRandom(cardTypes);

        const cardBackWidth = this.textures.get('card-back').getSourceImage().width;
        const cardBackHeight = this.textures.get('card-back').getSourceImage().height;
        const scaleFactorX = isCardFaceUp ? 1.65 : (1.65 * (cardBackWidth / this.textures.get(targetTexture).getSourceImage().width));
        const scaleFactorY = isCardFaceUp ? 1.65 : (1.65 * (cardBackHeight / this.textures.get(targetTexture).getSourceImage().height));

        this.tweens.add({
            targets: card,
            scaleX: 0,
            scaleY:0,
            duration: 200,
            onComplete: () => {
                card.setTexture(targetTexture);
                this.tweens.add({
                    targets: card,
                    scaleX: scaleFactorX,
                    scaleY: scaleFactorY,
                    duration: 400
                });
            }
        });
    }
}