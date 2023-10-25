const Phaser = require("phaser");

var config = { //tamaño de pantalla + que si el navegador no admite WEBGL use canvas
    type: Phaser.AUTO,
    width: 800,
    heigh: 600,
    scene: { //
        preload: preload,
        create: create,
        update: update,
    }
}

var game = new Phaser.Game(config);

function preload() {

    
}

function create() {


}

function update() {


}