var stage, hero, slimeSS, queue, enemies=[], bullets=[];
var keys = {
    u: false,
    d: false,
    l: false,
    r: false
}
var settings = {
    heroSpeed: 2,
    enemySpeed: 1,
    bulletSpeed: 5,
    damage: 15,
    fireRate: 30,
    lives: 3,
    enemyHealth: 100,
    level: 0
};

function preload(){
    stage = new createjs.Stage("cd");
    queue = new createjs.LoadQueue(true);
    queue.loadManifest([

        {id: "slimeSS", src:"spritesheets/slime.json"}
    ]);
    queue.addEventListener('progress', function(){
        console.log("hi mom");
    });
    queue.addEventListener('complete', setup);
}

function setup(){
    heroSetup();
    nextLevel();
    window.addEventListener('keyup', fingerUp);
    window.addEventListener('keydown', fingerDown);
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener('tick', heartBeat);
}
function heroSetup(){
    slimeSS = new createjs.SpriteSheet(queue.getResult("slimeSS"));
    hero = new createjs.Sprite(slimeSS, "up");
    hero.currentDirection = "up";
    hero.width=62;
    hero.height=56;
    hero.x=(stage.canvas.width/2)-(hero.width/2);
    hero.y=stage.canvas.height - hero.height;
    hero.isMoving=false;
    hero.gotoAndStop(hero.currentDirection);
    stage.addChild(hero);
}
function addEnemies(){
    for(var i=0; i < settings.level; i++){
        var enemy= new createjs.Shape();
        enemy.graphics.beginFill("#ead373").drawPolyStar(0, 0, 30, 3, 0.6, 90);
        enemy.width=60;
        enemy.height=60;
        enemy.regY=enemy.regX = -30;
        enemy.x=Math.floor(Math.random()*550);
        enemy.y=(Math.floor(Math.random()*200))*-1;
        enemies.push(enemy);
        stage.addChild(enemy);
    }
}
function nextLevel(){
    settings.level++;
    addEnemies();
}
function fingerUp(e) {
    switch(e.keyCode){
       case 37:
        keys.l = false;
        break;
        case 38:
        keys.u = false;
        break;
        case 39:
        keys.r = false;
        break;
        case 40:
        keys.d = false;
        break;
        case 32:
        fire();
        break;
    }
    if(!keys.l && !keys.r && !keys.u && !keys.d){
        hero.isMoving=false;
        hero.gotoAndStop(hero.currentDirection);
    }
}

function fingerDown(e) {
    switch(e.keyCode){
        case 37:
            keys.l = true;
        break;
        case 38:
            keys.u = true;
        break;
        case 39:
            keys.r = true;
        break;
        case 40:
            keys.d = true;
        break;
    }
}
function fire(){
   var bullet= new createjs.Shape();
    bullet.graphics.beginFill('#b3564c').drawCircle(0,0,2);
    bullet.x=hero.x+hero.width/2;
    bullet.y=hero.y;
    bullet.width=4;
    bullet.height=4;
    stage.addChild(bullet);
    bullets.push(bullet);
}
function hitTest(rect1, rect2) {
    if(rect1.x >= rect2.x + rect2.width || rect1.x + rect1.width <= rect2.x || rect1.y >= rect2.y + rect2.height || rect1.y + rect1.height <= rect2.y){
        return false;
    }
    return true;
}
function moveHero() {
    if(keys.l){
        hero.x-=settings.heroSpeed;
        if (hero.currentDirection != "left" || !hero.isMoving){
            hero.isMoving=true;
            hero.gotoAndPlay('left')
            hero.currentDirection="left";
        }
        if (hero.x < 0){
            hero.x=0;
        }
    }
    /*else if(hero.currentDirection == "left"){
        hero.gotoAndStop('left');
    }*/
    if(keys.r){
        hero.x+=settings.heroSpeed;
        if (hero.currentDirection != "right" || !hero.isMoving){
            hero.isMoving=true;
            hero.gotoAndPlay('right')
            hero.currentDirection="right";
        }
        if (hero.x > 600-hero.width){
            hero.x=600-hero.width;
        }
    }
    if(keys.u){
        hero.y-=settings.heroSpeed;
        if (hero.currentDirection != "up" || !hero.isMoving){
            hero.isMoving=true;
            hero.gotoAndPlay('up')
            hero.currentDirection="up";
        }
        if (hero.y < 0){
            hero.y=0;
        }
    }
    if(keys.d){
        hero.y+=settings.heroSpeed;
        if (hero.currentDirection != "down" || !hero.isMoving){
            hero.isMoving=true;
            hero.gotoAndPlay('down')
            hero.currentDirection="down";
        }
        if (hero.y > 400-hero.height){
            hero.y=400-hero.height;
        }
    }
}
function moveEnemies(){
    for(var i=0; i<enemies.length; i++){
        enemies[i].y+=settings.enemySpeed;
        if(enemies[i].y > 430){
            enemies[i].y=(Math.floor(Math.random()*200))*-1;
            enemies[i].x=Math.floor(Math.random()*550);
        }
    }
}
function moveBullets(){
    for(var i=0; i<bullets.length; i++){
        bullets[i].y-=settings.bulletSpeed;
        if(bullets[i].y < -1){
            stage.removeChild(bullets[i]);
            bullets.splice(i, 1);
        }
    }
}
function collisionChecking(){
    //enemies vs hero
    for(var i=0; i<enemies.length; i++){
        if(hitTest(hero, enemies[i])){
            settings.lives--;
            stage.removeChild(enemies[i]);
            enemies.splice(i, 1);
            if(settings.lives<=0){
                console.log("dead");
            }
        }
    }
    //bulltes vs enemies
    if(enemies.length===0){
        nextLevel();
    }
}
function heartBeat(e){
    moveHero();
    moveEnemies();
    moveBullets();
    collisionChecking();
    stage.update(e);
}
window.addEventListener('load', preload);
