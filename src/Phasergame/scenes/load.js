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

        // 1. Create a deck with two of each card type
        const cardTypes = [
            'card-1or11', 'card-double', 'card-redraw', 'card-resurrect',
            'card-steal', 'card-tiebreaker'
        ];
        const deck = Phaser.Utils.Array.Shuffle([...cardTypes, ...cardTypes]);

        for (let i = 0; i < 12; i++) {
            const x = width * (0.2 + (i % 6 * 0.13));
            const y = height * (i < 6 ? 0.38 : 0.65);
            const card = this.add.sprite(x, y, 'card-back').setScale(1.65);

            // 3. Assign each card in the `cards` array a type from the shuffled deck
            card.cardType = deck[i];

            cards.push(card);
        }

        this.input.on(Phaser.Input.Events.POINTER_UP, (pointer) => {
            const clickedCard = cards.find(card => Phaser.Geom.Rectangle.Contains(card.getBounds(), pointer.x, pointer.y));
            if (clickedCard) {
                this.flip(clickedCard);
            }
        });

        this.flippedCards = [];

        this.welcomeText = this.add.text(650, 250, `MAKE AS MANY MATCHES AS YOU CAN BEFORE TIME RUNS OUT!`, {
            font: '130px "Truculenta"',
            shadow: {
                offsetX: 3,
                offsetY: 3,
                color: '#000',
                blur: 5,
                fill: true
            }
        })

        this.timerValue = 30; // starting value
        this.timerText = this.add.text(200, 650, `Time:\n${this.timerValue}`, {
            font: '100px Truculenta',   // Increased font size
            fill: '#2ad496'
        });

        this.time.addEvent({
            delay: 1000, // 1000 ms = 1 second
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });

        this.scoreValue = 0;

        this.scoreText = this.add.text(200, 1300, `Score\n${this.scoreValue}`, {
            font: '100px Truculenta',
            fill: '#2ad496'
        });

        const restartButton = this.add.text(width / 2 + 200 , height - 300, 'Restart', {
            font: '130px Truculenta',
            fill: '#ffffff',
            padding: { left: 10, right: 10, top: 5, bottom: 5 },
        }).setInteractive();

        restartButton.on('pointerup', () => {
            this.scene.restart();
        });

        const returnButton = this.add.text(width / 2 - 400, height - 300, 'Return' , {
            font: '130px Truculenta',
            fill: '#ffffff',
            padding: { left: 10, right: 10, top: 5, bottom: 5 },
        }).setInteractive();
        
        returnButton.on('pointerup', () => {
            window.location.href = "http://localhost:3000/";
        });
    }

    updateTimer() {
        this.timerValue -= 1; // decrement timer value
        this.timerText.setText(`Time\n${this.timerValue}`);
    
        if (this.timerValue <= 0) {
            // Stop the timer
            this.timerValue = 0; 
            this.timerText.setText('Time\n0');
    
            this.endGame();
        }
    }

    init() {
        this.gameOver = false;
        this.state = 0; // Introduce the state variable
    }

    endGame() {
        this.gameOver = true;
        for (let card of this.flippedCards) {
            if (!card.isMatched) {
                this.flip(card);
            }
        }
    
        this.saveScore(this.scoreValue);
    }

    saveScore(score) {
        const topScores = JSON.parse(localStorage.getItem('topScores')) || [];
        topScores.push(score);
        topScores.sort((a, b) => b - a);  // Sort in descending order
        if (topScores.length > 5) {
            topScores.pop();  // Remove the last (smallest) score if we have more than 5 scores
        }
        localStorage.setItem('topScores', JSON.stringify(topScores));
    }

    loadTopScores() {
        return JSON.parse(localStorage.getItem('topScores')) || [];
    }

    flip(card) {
        if (this.gameOver || this.state === 2) {
            return; // If the game is over, in transition state, or can't flip cards, don't process the flip
        }

        if (this.flippedCards.includes(card) || card.isMatched) {
            return;
        }
    
        const isCardFaceUp = card.texture.key !== 'card-back';
        const targetTexture = isCardFaceUp ? 'card-back' : card.cardType;
    
        const cardBackWidth = this.textures.get('card-back').getSourceImage().width;
        const cardBackHeight = this.textures.get('card-back').getSourceImage().height;
        const scaleFactorX = isCardFaceUp ? 1.65 : (1.65 * (cardBackWidth / this.textures.get(targetTexture).getSourceImage().width));
        const scaleFactorY = isCardFaceUp ? 1.65 : (1.65 * (cardBackHeight / this.textures.get(targetTexture).getSourceImage().height));
    
        this.tweens.add({
            targets: card,
            scaleX: 0,
            scaleY: 0,
            duration: 200,
            onComplete: () => {
                card.setTexture(targetTexture);
    
                if (!isCardFaceUp) {
                    this.flippedCards.push(card);
    
                    // Schedule the automatic flip back after 3 seconds
                    card.autoFlipBackTimer = this.time.delayedCall(500, () => {
                        // Check if card is still face up and not matched before flipping back
                        if (card.texture.key !== 'card-back' && !card.isMatched) {
                            this.flip(card);
                        }
                    });
                } else if (card.autoFlipBackTimer) {
                    // If flipping back manually, cancel the scheduled automatic flip back
                    card.autoFlipBackTimer.remove(false);
                }
    
                this.tweens.add({
                    targets: card,
                    scaleX: scaleFactorX,
                    scaleY: scaleFactorY,
                    duration: 400,
                    onComplete: () => {
                        if (this.flippedCards.length === 2) {
                            const [card1, card2] = this.flippedCards;
    
                            if (card1.texture.key === card2.texture.key) {
                                card1.isMatched = true;
                                card2.isMatched = true;

                                this.scoreValue += 1;
                                this.scoreText.setText(`Score\n${this.scoreValue}`);
                            } else {
                                // If the cards don't match, remove the initial auto-flip timer
                                if (card1.autoFlipBackTimer) {
                                    card1.autoFlipBackTimer.remove(false);
                                }
                            if (card2.autoFlipBackTimer) {
                                    card2.autoFlipBackTimer.remove(false);
                                }
                                // Then, after 500ms, flip both cards back
                                    this.time.delayedCall(500, () => {
                                        this.flip(card1);
                                        this.flip(card2);
                                    });
                            }
    
                            this.flippedCards = [];
                        }
                    }
                });
            }
        });
    }
}