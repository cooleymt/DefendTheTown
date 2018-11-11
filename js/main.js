var ScreenX = 1024;
var ScreenY = 640;
var config = {
    type: Phaser.AUTO,
    parent: 'content',
    width: 1024,
    height: ScreenY,  
    physics:{
        default: 'arcade'
    },
    scene: {
        key: 'main',
        preload: preload,
        create: create,
        update: update
    }
};
var game = new Phaser.Game(config);
 
var graphics;
var cloudSpeed = .05;

 
function preload() {
    
    //load skybox
    this.load.image('CloudsBack', 'assets/scenery/CloudsBack.png');
    this.load.image('CloudsFront', 'assets/scenery/CloudsFront.png');
    this.load.image('BGBack', 'assets/scenery/BGBack.png');
    this.load.image('BGFront', 'assets/scenery/BGFront.png');
    this.load.image('Ground', 'assets/scenery/Ground');
    this.load.image('Grass', 'assets/scenery/Grass');
}
 
function create() {
    graphics = this.add.graphics(); 

    //add skybox
    this.backClouds = this.add.tileSprite(0, ScreenY, ScreenX, ScreenY, 'CloudsBack').setScale(2);
    this.frontClouds = this.add.tileSprite(0, ScreenY, ScreenX, ScreenY, 'CloudsFront').setScale(2);
    this.add.image(ScreenX/2, ScreenY/2, 'BGBack').setScale(2);
    this.add.image(ScreenX/2, ScreenY/2, 'BGFront').setScale(2);

    //create ground group
    ground = this.physics.add.staticGroup();
    //create ground
    ground.create(ScreenX/2, ScreenY-16, 'Ground').setScale(2).refreshBody();
    this.add.image(ScreenX/3, ScreenY-32, 'Grass').setScale(2);
}
 
function update(time, delta) {
    //scoot background PARALLAX!
    this.backClouds.tilePositionX += cloudSpeed;
    this.frontClouds.tilePositionX += cloudSpeed*2;
}
