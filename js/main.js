//dug http://localhost:8080/DefendTheTown/
var ScreenX = 1024;
var ScreenY = 640;
var config = {
    type: Phaser.AUTO,
    parent: 'content',
    width: 1024,
    height: ScreenY,  
    physics:{
        default: 'arcade',
        arcade: {
            gravity: {y:300},
            debug: false
        }
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
var score = 0;
var scoreText;
var healthText;
var gameOverText;
var timeToNext = 3000;

var Town = new Phaser.Class({
    Extends: Phaser.GameObjects.Image,
    initialize:
    
    function Town (scene)
    {
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'Town1');
        this.hp = 100;
        this.setPosition(ScreenX-64,ScreenY-96);
    },
    takeDamage: function (damage){
        this.hp -= damage;
        healthText.setText('town health: '+ this.hp);
        if(this.hp <= 0){
            game.scene.pause('main');
            gameOverText.setText('GAME OVER');
        }
    },
    fire: function(pointer){
        var angle = Phaser.Math.Angle.Between(this.x, this.y, pointer.x, pointer.y);
        addArrow(this.x, this.y, angle);
    },
    update: function (time, delta)
    {
        //console.log(this.hp);
    }
});

var Skeleton = new Phaser.Class({
    Extends: Phaser.GameObjects.Sprite,
    initialize:
    function Skeleton (scene){
        this.hp = 10;
        Phaser.GameObjects.Sprite.call(this, scene, 0,0, 'skeletonWalk');
        this.setPosition(0,ScreenY-48);
        this.speed = 1;
        this.attacking = false;
        this.coolDown = 1000;
        this.target = null;
        this.attack = 3;

    },
    startWalkin: function(){
        this.setPosition(0,ScreenY-48);
        this.hp = 10;
        this.speed = 1;
        this.anims.play('skeletonWalk',true);
    },
    receiveDamage: function(damage){
        this.hp -= damage;

        if(this.hp<=0){
            this.setActive(false);
            this.setVisible(false);
            score += 10;
            scoreText.setText('score: ' + score);
        }
    },
    update: function (time, delta){
        this.setPosition(this.x+this.speed, this.y);
        //console.log('Attacking is : ' + this.attacking);
        if(this.attacking && this.coolDown<=0){
            this.target.takeDamage(this.attack);
            this.coolDown = 1000;
        }
        this.coolDown -= 1;
        //console.log('Cooldown is : ' + coolDown);
    }
});

var Arrow = new Phaser.Class({
    Extends: Phaser.GameObjects.Sprite,
    initialize:
    function Arrow (scene){
        Phaser.GameObjects.Sprite.call(this, scene, 0,0, 'Arrow');
        this.dx = 0;
        this.dy = 0;
        this.lifespan = 0;
        this.attack = 0;
        this.speed = Phaser.Math.GetSpeed(800, 1);
        
    },
    fire: function(x,y,angle){
        
        this.attack = 5;
        this.setPosition(x,y);
        this.setRotation(angle);
        this.speed = Phaser.Math.GetSpeed(800, 1);
        this.dx = Math.cos(angle);
        this.dy = Math.sin(angle);
        this.lifespan = 6000;

        this.setActive(true);
        this.setVisible(true);
    },
    update: function (time, delta){
        this.lifespan -= delta;
 
        this.x += this.dx * (this.speed * delta);
        this.y += this.dy * (this.speed * delta);
 
        if (this.lifespan <= 0 || (this.x <=1 || this.x >= ScreenX))
        {
            this.destroy();
        }
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

    //buildings
    this.load.image('Town1', 'assets/Town/Town1');

    //baddies
    this.load.spritesheet('skeletonWalk', 'assets/npcs/Skeleton/Skeleton Walk.png', { frameWidth: 22, frameHeight: 37 });

    //things
    this.load.image('Arrow', 'assets/arrow.png');
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

    //set score text
    scoreText = this.add.text(16,16, 'score: 0', {fontSixe:'40px', fill:'#000'});
    healthText = this.add.text(850,16, 'town health: 100', {fontSixe:'40px', fill:'#000'});
    gameOverText = this.add.text(500,300, '', {fontSixe:'40px', fill:'#000'});
    towns = this.physics.add.group({ classType: Town, runChildUpdate: true });
    this.physics.add.collider(towns,ground);
    town = towns.get();
    town.setActive(true);
    town.setVisible(true);

    skeletons = this.physics.add.group({classType:Skeleton, runChildUpdate:true})
    this.physics.add.collider(skeletons,ground);
    this.anims.create({
        key:'skeletonWalk',
        frames: this.anims.generateFrameNumbers('skeletonWalk'),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key:'skeletonAttack',
        frames: this.anims.generateFrameNumbers('skeletonAttack'),
        frameRate: 10,
        repeat: 0
    });
    
    this.nextEnemy = 0;
    this.physics.add.overlap(skeletons, towns, attackTown);

    arrows = this.physics.add.group({classType: Arrow, runChildUpdate: true});
    this.physics.add.overlap(arrows,ground, arrowGrounded);
    this.physics.add.collider(arrows,ground);
    this.input.on('pointerdown', FireArrow);
    this.physics.add.overlap(skeletons, arrows, damageEnemy);
}
 
function update(time, delta) {
    //scoot background PARALLAX!
    this.backClouds.tilePositionX += cloudSpeed;
    this.frontClouds.tilePositionX += cloudSpeed*2;

    if (time > this.nextEnemy)
    {        
        var skeleton = skeletons.get();
        if (skeleton)
        {
            skeleton.startWalkin();
            skeleton.setActive(true);
            skeleton.setVisible(true);  
            this.nextEnemy = time + timeToNext;
            timeToNext -= 20;
            cloudSpeed += .004;
            if(timeToNext < 100){
                timeToNext = 100;
            }
        }        
    }
    
    
}
function damageEnemy(enemy, arrow){
    if(enemy.active === true && arrow.active === true){
        arrow.destroy();
        enemy.receiveDamage(arrow.attack);
        
    }
}

function attackTown(skeleton, town){
    skeleton.speed = 0;
    skeleton.attacking = true;
    skeleton.target = town;
}

function FireArrow(pointer){
    town.fire(pointer);
}

function addArrow(x,y, angle){
    var arrow = arrows.get();
    if(arrow){
        arrow.fire(x,y,angle);
    }
}

function arrowGrounded(arrow, ground){
    arrow.speed = 0;
    arrow.attack = 0;
}