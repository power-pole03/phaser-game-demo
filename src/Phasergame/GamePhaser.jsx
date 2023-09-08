import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { Load } from './scenes/load.js';


// default screen width and height
let screenWidth = window.outerWidth; // 3840 is for 16:9 ,  2532 is for 19.5:9
let screenHeight = window.outerHeight; // 2160 is for 16:9 ,  1170 is for 19.5:9
let aspectRatio = screenWidth / screenHeight //16:9 is 1.78 ratio, 19.5:9 is 2.17
let gameWidth = 3840; //default to 16:9 (desktop)
let gameHeight = 2160;
if (screenWidth < 1200) { //mobile layout
    gameWidth = 2532;
    gameHeight = 1170;
}
if (Math.abs(aspectRatio - 1.78) < Math.abs(aspectRatio - 2.17)) {
    gameWidth = 3840;
    gameHeight = 2160;
}
else {
    gameWidth = 2532;
    gameHeight = 1170;
}

export default function GamePhaser({setGameRef}) {
    const config = {
        type: Phaser.AUTO,
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: gameWidth, //detect aspect ratio and set width and height accordingly
            height: gameHeight,
        },
        transparent: true,
        fps: {
            target: 30,
        },
        dom: {
            createContainer: true,
        },
        scene: [
            Load
        ],
        parent: "phaser-container",
    };

    const phaserGameRef = useRef(null); //https://stackoverflow.com/questions/73910900/why-are-multiple-canvases-being-made-in-my-phaser-react-app
    useEffect(() => {
        if (phaserGameRef.current) {
            return;
        }
        phaserGameRef.current = new Phaser.Game(config);
        setGameRef(phaserGameRef.current);
        //setGameRef(phaserGameRef.current);
        return () => {
            phaserGameRef.current.destroy(true);
            phaserGameRef.current = null;
        };
    }, []);

}