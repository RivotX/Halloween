
var config = { //tamaño de pantalla + que si el navegador no admite WEBGL use canvas
    type: Phaser.AUTO,
    width: 1500,
    heigh: 800,
    scene: { //
        preload: preload,
        create: create,
        update: update,
    }
}

var game = new Phaser.Game(config);

function preload() { //carga imagenes y cosas necesarias atnes de empezar

   // this.load.image('fondo', 'assets/fondo.jpg');
    this.load.image('plataforma', 'assets/plataformaHorizontal.png');

    this.load.spritesheet('arquero', 'assets/arquero.png', {frameWidth:131.285714, frameHeight:178}) //sprite arquero


}

function create() { //crea las img
  //  this.add.image(900,450,'fondo');
    this.add.image(900, 500, 'plataforma');
    this.add.image(600, 400, 'arquero');
    

}

function update() {


}