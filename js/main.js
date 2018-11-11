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


var Town = new Phaser.Class({
    Extends: Phaser.GameObjects.Image,
    initialize:
    function Town (scene)
    {
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'Town1');
        this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
        this.hp = 100;
        this.setPosition(ScreenX-64,ScreenY-96);
    },
    update: function (time, delta)
    {

    }
});


function preload() {
    
    //load skybox
    this.load.image('CloudsBack', 'assets/scenery/CloudsBack.png');
    this.load.image('CloudsFront', 'assets/scenery/CloudsFront.png');
    this.load.image('BGBack', 'assets/scenery/BGBack.png');
    this.load.image('BGFront', 'assets/scenery/BGFront.png');
    this.load.image('Ground', 'assets/scenery/Ground');
    this.load.image('Grass', 'assets/scenery/Grass');

    this.load.image('Town1', 'assets/Town/Town1');
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

    towns = this.physics.add.group({ classType: Town, runChildUpdate: true });
    town = towns.get();
    town.setActive(true);
    town.setVisible(true);
}
 
function update(time, delta) {
    //scoot background PARALLAX!
    this.backClouds.tilePositionX += cloudSpeed;
    this.frontClouds.tilePositionX += cloudSpeed*2;

    
}
