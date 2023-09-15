import Phaser from "phaser";

const STATE_IDLE = 1;
const STATE_ONE_CARD_FLIPPED = 2;
const STATE_COMPARE = 3;
const STATE_UNMATCHED = 4;
const STATE_MATCHED = 5;

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

    createRoundedRectangle(scene, x, y, width, height, radius, color, borderWidth, borderColor) {
        const graphics = scene.add.graphics();
    
        graphics.fillStyle(color);
        
        // Border style for the rectangle
        graphics.lineStyle(borderWidth, borderColor);

        graphics.strokeRoundedRect(x, y, width, height, radius);
        graphics.fillRoundedRect(x, y, width, height, radius);

    
        return graphics;
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
        this.load.image('skull', './images/512x512.png');
        this.load.image('gameoverbg', './images/blackout_screen_tint.png');
        this.load.image('gameover', './images/game_over_popup.png');
        this.load.image('bluebtn', './images/blue_button_300.png');
        this.load.image('greenbtn', './images/green_button_300.png');
        this.load.image('redbtn', './images/red_button_300.png');
        this.load.spritesheet('redFlame_spritesheet', './images/redNormal.png', { frameWidth: 100, frameHeight: 100, endframe: 65 });
    }

    createAnimation (spritesheet, frames, frameRate, repeat = -1)
    {
        this.anims.create({
            key: spritesheet + '_ani',
            frames: this.anims.generateFrameNumbers(spritesheet, { start: 0, end: frames }),
            frameRate: frameRate,
            repeat: repeat
        });
    }

    create() {
        this.cameras.main.fadeIn(500, 0, 0, 0);

        let bg = this.add.image(0, 0, 'background').setOrigin(0, 0);
        let scaleX = this.cameras.main.width / bg.width;
        let scaleY = this.cameras.main.height / bg.height;
        let scale = Math.max(scaleX, scaleY);
        bg.setScale(scale);
        bg.setTint(0x999999);

        this.createAnimation('redFlame_spritesheet', 65, 30, -1);
        const burst4_sprite1 = this.add.sprite(320, 960, 'redFlame_spritesheet')
        burst4_sprite1.setScale(6);
        burst4_sprite1.play('redFlame_spritesheet_ani');
        
        this.createAnimation('redFlame_spritesheet', 65, 30, -1);
        const burst4_sprite2 = this.add.sprite(410, 910, 'redFlame_spritesheet')
        burst4_sprite2.setScale(6);
        burst4_sprite2.play('redFlame_spritesheet_ani');

        this.createAnimation('redFlame_spritesheet', 65, 30, -1);
        const burst4_sprite3 = this.add.sprite(3660, 780, 'redFlame_spritesheet')
        burst4_sprite3.setScale(6);
        burst4_sprite3.play('redFlame_spritesheet_ani');

        this.createAnimation('redFlame_spritesheet', 65, 30, -1);
        const burst4_sprite4 = this.add.sprite(3550, 750, 'redFlame_spritesheet')
        burst4_sprite4.setScale(6);
        burst4_sprite4.play('redFlame_spritesheet_ani');

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
            const y = height * (i < 6 ? 0.38 : 0.70);
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

        this.timerValue = 10000; // starting value
        this.timerText = this.add.text(200, 650, `Time\n${this.timerValue}`, {
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

        //gameoverbg
        this.gameOverBgImage = this.add.image(this.scale.width / 2, this.scale.height / 2, 'gameoverbg');
        this.gameOverBgImage.setScale(this.scale.width / this.gameOverBgImage.width, this.scale.height / this.gameOverBgImage.height);
        this.gameOverBgImage.setVisible(false);

        // Centering the rounded rectangle on screen
        const rectWidth = 1100;
        const rectHeight = 900;
        this.roundRect = this.createRoundedRectangle(
            this, 
            (this.scale.width - rectWidth) / 2,   // Adjusted for centering
            (this.scale.height - rectHeight) / 2 - 10, // Adjusted for centering
            rectWidth, 
            rectHeight, 
            27, 
            0x222747, 
            15, 
            0x33b9e3
        );
        this.roundRect.setVisible(false);

        // Skull Image
        this.skullImage = this.add.image(this.scale.width / 2, 600, 'skull');
        this.skullImage.setScale(0.65);  // adjust the scale as per your requirements
        this.skullImage.setVisible(false);

        //Game Over Message
        this.gameOverText = this.add.text(this.scale.width / 2, this.scale.height / 2 - 150, 'Game Over!',{
            font: '180px Truculenta'
        }).setOrigin(0.5, 0.5).setVisible(false);

        // Score Display
        this.finalScoreText = this.add.text(this.scale.width / 2 , this.scale.height / 2 + 30, '', {
            font: '90px Truculenta',
            fill: '#ffffff'
        }).setOrigin(0.5, 0.5).setVisible(false);

        // Play Again Button
        this.playAgainButton = this.add.image(this.scale.width / 2 - 250, this.scale.height / 2 + 250, 'bluebtn').setInteractive(); // Changed x-coordinate to -200 for more space
        this.playAgainText = this.add.text(this.playAgainButton.x, this.playAgainButton.y, 'PLAY AGAIN', {
            font: '60px Truculenta',
            fill: '#000000'  // Changed font color to black
        }).setOrigin(0.5, 0.5);
        this.playAgainButton.setScale(1.3)
        this.playAgainButton.on('pointerup', () => {
            this.scene.restart();
        });
        this.playAgainButton.setVisible(false);
        this.playAgainText.setVisible(false);

        // Exit Button
        this.exitButton = this.add.image(this.scale.width / 2 + 250, this.scale.height / 2 + 250, 'redbtn').setInteractive(); // Changed x-coordinate to +200 for more space
        this.exitText = this.add.text(this.exitButton.x, this.exitButton.y, 'EXIT', {
            font: '60px Truculenta',
            fill: '#ffffff'
        }).setOrigin(0.5, 0.5);
        this.exitButton.setScale(1.3)
        this.exitButton.on('pointerup', () => {
            window.location.href = "/";
        });
        this.exitButton.setVisible(false);
        this.exitText.setVisible(false);

    }

    updateTimer() {
        this.timerValue -= 1; // decrement timer value
        this.timerText.setText(`Time\n${this.timerValue}`);
        

        if (this.timerValue <= 0) {
             // Store date and save data
            const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
            this.updateHighScore(this.scoreValue, currentDate);
            
            // Stop the timer
            this.timerValue = 0; 
            this.timerText.setText('Time\n0');
    
            this.endGame();
            this.showGameOverScreen();
        }
    }

    init() {
        this.gameOver = false;
        this.state = STATE_IDLE;
        this.clicksAllowed = true;
        this.disableFlippedClick = false; 
    }

    setState(newState) {
        console.warn(newState);
        this.state = newState;

        if (this.state === STATE_COMPARE) {
            // Start comparing cards when moving to the COMPARE state
            this.compareCards();
        }
    }

    endGame() {
        this.gameOver = true;
        for (let card of this.flippedCards) {
            if (!card.isMatched) {
                this.flip(card);
            }
        }
    
        this.updateHighScore(this.scoreValue);
    }

    updateHighScore(score, date) {
        if (score !== undefined && date !== undefined) {
            const gameData = {
                score: score,
                date: date
            };
        
            let existingData = JSON.parse(localStorage.getItem('Leaderboard')) || [];
        
            // Check for duplicate entry
            const duplicate = existingData.find(entry => entry.score === gameData.score || entry.date === gameData.date);
            if (!duplicate) {
                // If no duplicate, add new game data to existing data
                existingData.push(gameData);
            }
            
            // Sort the array in descending order of scores
            existingData.sort((a, b) => b.score - a.score);
        
            // Trim the array to keep only top 5
            existingData = existingData.slice(0, 5);
        
            localStorage.setItem('Leaderboard', JSON.stringify(existingData));
        } else {
            console.error('score and date must be defined to save game data.');
        }
    }
      
    flip(card) {
        if (!this.clicksAllowed || 
            this.gameOver || 
            card.isMatched || 
            this.flippedCards.includes(card) || 
            this.state === STATE_COMPARE || 
            this.disableFlippedClick  // Check against the flag
        ) {
            return;
        }

        switch (this.state) {
            case STATE_IDLE:
                this.handleIdleStateFlip(card);
            break;

            case STATE_ONE_CARD_FLIPPED:
                this.handleOneCardFlippedStateFlip(card);
                break;
                

            case STATE_COMPARE:
                break;

            default:
            break;
        }
    }

    isFlipNotAllowed(card, isCardAlreadyFlipped) {
        return !this.clicksAllowed || 
               this.gameOver || 
               card.isMatched || 
               isCardAlreadyFlipped || 
               this.state === STATE_COMPARE || 
               this.disableFlippedClick;
    }
    
    handleIdleStateFlip(card) {
        this.flipAnimation(card);
        this.flippedCards.push(card);
        this.setState(STATE_ONE_CARD_FLIPPED);
    }
    
    handleOneCardFlippedStateFlip(card) {
        this.flipAnimation(card);
        this.flippedCards.push(card);
        this.clicksAllowed = false;
        
        // Set a delay of 300ms for automatic comparison.
        this.time.delayedCall(300, () => {
            this.setState(STATE_COMPARE);
            this.clicksAllowed = true;
        });
    }

    flipAnimation(card) {
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
                this.tweens.add({
                    targets: card,
                    scaleX: scaleFactorX,
                    scaleY: scaleFactorY,
                    duration: 200
                });
            }
        });
    }

    compareCards() {
        this.clicksAllowed = false;
        const [card1, card2] = this.flippedCards;

        if (card1.cardType === card2.cardType) {
            this.setState(STATE_MATCHED);
            card1.isMatched = true;
            card2.isMatched = true;

            this.scoreValue += 1;
            this.scoreText.setText(`Score\n${this.scoreValue}`);

            this.setState(STATE_IDLE); // Go back to idle after updating score
        } else {
            this.setState(STATE_UNMATCHED);

            this.disableFlippedClick = true;

            // Flip both cards back after a delay
            this.time.delayedCall(300, () => {
                this.flipAnimation(card1);
                this.flipAnimation(card2);
                this.setState(STATE_IDLE); // Go back to idle after flipping cards back

                this.time.delayedCall(300, () => {
                    this.disableFlippedClick = false; 
                });
            });
        }

        // Clear the flipped cards array
        this.flippedCards = [];
    }

    showGameOverScreen() { 
        // Set the background to gameoverbg with 60% opacity
        this.gameOverBgImage.setVisible(true);
        this.gameOverBgImage.setAlpha(0.75);  // Set opacity to 60%

        // Display the gameover rectangle first
        this.roundRect.setVisible(true);
        
        // Show the skull and rectangle graphics
        this.skullImage.setVisible(true);
        this.gameOverText.setVisible(true);

        // Display the final score
        this.finalScoreText.setText(`Final Score: ${this.scoreValue}`);
        this.finalScoreText.setVisible(true);

        // Show the buttons
        this.playAgainButton.setVisible(true);
        this.playAgainText.setVisible(true);
        this.exitButton.setVisible(true);
        this.exitText.setVisible(true);
    }
}
