"use strict"

//global constants
const FPS = 60;
const CIRCLE_RADIANS = Math.PI*2;
const MENU_FILL_COLOR = 'rgba(255,255,255,0.5)';
const STARTING_MONEY = 100;
const WAVE_DELAY_FRAMES = 5*60;
const FIRING_ANIMS_FRAMES = 5;

//global variables
var canvas;
var context;
var lastFrameTime;
var gameFrameNumber;
var needRedraw;
var mouse;
var sceneID = 0;
var towerArray = [];
var towerSlotArray = [];
var enemyArray = [];
var firingAnims = [];
var bgImage = new Image();
var spriteSheet = new Image();
var escPressed = false;
var startButtonActive = true;
var quitButtonActive = false;
var globalSelector = {
    x:0,
    y:0,
    isActive:false,
    button:[
        {
            id: 'cancel',
            pos:{
                x:0,
                y:0,
            },
            bound:{
                left:0,
                top:0,
                right:0,
                bottom:0,
            },
            tex: SELECTOR_BUTTON_TEXS.find(t => { return t.id == 'cancel' }),
        },
        {
            id: 'arrow',
            pos:{
                x:0,
                y:0,
            },
            bound:{
                left:0,
                top:0,
                right:0,
                bottom:0,
            },
            tex:SELECTOR_BUTTON_TEXS.find(t => { return t.id == 'arrow' }),
        },
    ],
};
var playerMoney = 0;
var moneyDisplay;
var moneyDiv;
var moneyNumberArray = [];
var waveID = 0;
var waveComplete = false;
var waveDelayFrames;
var playerHealth;
var healthDisplay;



//Runs once on page load
function onLoad() {
    bgImage.src = 'assets/path.png';
    spriteSheet = document.getElementById('spriteSheet');
    canvas = document.getElementById('gameCanvas');
    moneyDisplay = document.getElementById('money');
    moneyDiv = document.getElementById('moneyDiv');
    healthDisplay = document.getElementById('health');
    context = canvas.getContext('2d');
    gameFrameNumber = 0;
    lastFrameTime = performance.now();

    canvas.addEventListener('mousedown', event => {
        mouse = {
            x: event.offsetX,
            y: event.offsetY,
        };
        clickHandler(mouse);
    });

    canvas.addEventListener('mousemove', event => {
        mouse = {
            x: event.offsetX,
            y: event.offsetY,
        };
        if(sceneID == 1){
            towerArray.forEach(tower => {
                tower.showRadius(mouse);
            });
        }
    });

    canvas.addEventListener('mouseleave', () => {
        towerArray.forEach(tower => {
            tower.drawArc = false;
        });
    });
    
    window.addEventListener('keydown', event => {        
        switch(event.key) {
            case 'Escape': {
                if(escPressed) return;
                else escPressed = true;
                if(sceneID == 1) sceneID = 2;
                else if (sceneID == 2) sceneID = 1;
                return;
            }
            default: break;
        }
    });

    window.addEventListener('keyup', event => {
        switch(event.key) {
            case 'Escape': {
                if(!escPressed) return;
                else escPressed = false;
            }
            default: break;
        }
    });

    //advances the game 120 times per second (twice per frame)
    setInterval(onFrameInterval,1000/120);

    //starts animation loop
    requestAnimationFrame(onDrawFrame);
}

//Runs 120 times per second (twice per frame)
function onFrameInterval() {
    let now = performance.now();
    //Checks if it's time to advance game state
    if(now - lastFrameTime > 1000/FPS){
        let timesLooped = 0;
        while(now - lastFrameTime > 1000/FPS && timesLooped < 5){
            advanceGameFrame();
            needRedraw = true;
            lastFrameTime += 1000/FPS;
            timesLooped++;
        }
        /* Don't really know what this is doing here but leave it in */
        if(timesLooped >= 5){
            lastFrameTime = now;
        }
    }
}

//Animation Loop
function onDrawFrame(){
    if(needRedraw){
        const background_fill = 'pink';
        context.fillStyle = background_fill;
        context.fillRect(0, 0, canvas.width, canvas.height);

        switch(sceneID){
            case 0:
                drawStartScreen();
                break;
            case 1:
                drawGameFrame();
                break;
            case 2:
                drawGameFrame();
                drawPauseScreen();
                break;
            case 3:
                drawGameFrame();
                drawGameOver();
                break;
        }

        needRedraw = false;
    }
    requestAnimationFrame(onDrawFrame);
}

function drawStartScreen(){
    context.fillStyle = MENU_FILL_COLOR;
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    let titleTex = MENU_TEXS.find(t => { return t.id == 'title' });
    let startTex = MENU_TEXS.find(t => { return t.id == 'start' });

    context.drawImage(spriteSheet, titleTex.left, titleTex.top, titleTex.width, titleTex.height,
        titleTex.drawX, titleTex.drawY, titleTex.width, titleTex.height);

    context.drawImage(spriteSheet, startTex.left, startTex.top, startTex.width, startTex.height, 
        startTex.drawX, startTex.drawY, startTex.width, startTex.height);
}

function drawPauseScreen(){
    context.fillStyle = MENU_FILL_COLOR;
    context.fillRect(0, 0, canvas.width, canvas.height);

    let pauseTex = MENU_TEXS.find(t => { return t.id == 'pause' });
    let quitTex = MENU_TEXS.find(t => { return t.id == 'quit' });
        
    context.drawImage(spriteSheet, pauseTex.left, pauseTex.top, pauseTex.width, pauseTex.height, 
        pauseTex.drawX, pauseTex.drawY, pauseTex.width, pauseTex.height);
    
    context.drawImage(spriteSheet, quitTex.left, quitTex.top, quitTex.width, quitTex.height, 
        quitTex.drawX, quitTex.drawY, quitTex.width, quitTex.height);
}

function drawGameOver(){
    context.fill = MENU_FILL_COLOR;
    context.fillRect(0, 0, canvas.width, canvas.height);

    let gameOverTex = MENU_TEXS.find(t => { return t.id == 'game over' });
    let quitTex = MENU_TEXS.find(t => { return t.id == 'quit' });

    context.drawImage(spriteSheet, gameOverTex.left, gameOverTex.top, gameOverTex.width, gameOverTex.height,
        gameOverTex.drawX, gameOverTex.drawY, gameOverTex.width, gameOverTex.height);
    
    context.drawImage(spriteSheet, quitTex.left, quitTex.top, quitTex.width, quitTex.height, 
        quitTex.drawX, quitTex.drawY, quitTex.width, quitTex.height);

}

function drawGameFrame(){
    context.drawImage(bgImage, 0, 0);

    //draw tower slots
    towerSlotArray.forEach(tower => {
        if(tower.isActive) {
            context.fillStyle = TOWER_TEXS.find(e => { return e.id == 'slot' }).color;
            context.beginPath();
            context.arc(tower.x, tower.y, tower.radius, 0, CIRCLE_RADIANS, false);
            context.fill();
        }
    });

    //draw firing anims
    console.log(firingAnims.length);
    firingAnims.forEach(anim => {
            console.log('time left ', anim.timer);
            anim.drawAnim();
            console.log('time left ', anim.timer);
        });
    firingAnims = firingAnims.filter(a => { a.timer > 0 });

    //draw enemies
    enemyArray.forEach(enemy => {
        const health_bar_h = 7;
        context.drawImage(spriteSheet, enemy.tex.left, enemy.tex.top, enemy.tex.size, enemy.tex.size, enemy.left, enemy.top, enemy.tex.size, enemy.tex.size);
        context.fillStyle = 'red';
        context.fillRect(enemy.left, enemy.top - health_bar_h, (enemy.health/100)*enemy.tex.size, health_bar_h);
    });

    //draw towers & firing arcs
    towerArray.forEach(tower => {
        context.drawImage(spriteSheet,
            tower.tex.left, tower.tex.top, tower.tex.width, tower.tex.height,
            tower.left, tower.top, tower.tex.width, tower.tex.height);
        
        if(tower.drawArc) {
            context.beginPath();
            context.arc(tower.x, tower.y, tower.firingRadius, 0, CIRCLE_RADIANS, false);
            context.fillStyle = `rgba(
                ${tower.arcColor.r},
                ${tower.arcColor.g},
                ${tower.arcColor.b},
                ${tower.arcColor.a})`;
            context.fill();
        }
    });

    //draw global selector
    if(globalSelector.isActive){
        globalSelector.button.forEach(button =>{
            context.drawImage(spriteSheet, button.tex.left, button.tex.top, button.tex.size, button.tex.size, button.pos.x, button.pos.y, button.tex.size, button.tex.size);
        });
    }

    //draw money display
    context.drawImage(spriteSheet, MONEY_TEX.tex_pos.left, MONEY_TEX.tex_pos.top, MONEY_TEX.size, MONEY_TEX.size, MONEY_TEX.position.x, MONEY_TEX.position.y, MONEY_TEX.size, MONEY_TEX.size);
    let x = MONEY_TEX.position.x + MONEY_TEX.size;
    let y = MONEY_TEX.position.y + MONEY_TEX.size/4;
    moneyNumberArray.forEach(d => {
        let digit = NUMBERS.find(n => { return d == n.value });
        context.drawImage(spriteSheet, digit.left, digit.top, digit.size, digit.size, x, y, digit.size, digit.size);
        x += digit.size;
    });
}

//Game Logic
function advanceGameFrame(){
    switch(sceneID){
        case 0:
            moneyDiv.style.display = 'none';
            healthDisplay.style.display = 'none';
            break;
        case 1:
            moneyDiv.style.display = 'inline';
            healthDisplay.style.display = 'inline';
            moneyDisplay.innerHTML = playerMoney;
            
            if(playerHealth <= 0){
                sceneID = 0;
                break;
            }
            else {
                let pHealthBar = ''
                for(let i = playerHealth; i > 0; i--){
                    pHealthBar += '♥';
                }
                healthDisplay.innerHTML = pHealthBar;
            }

            if(enemyArray.length > 0) {
                moveEnemy();
                if(towerArray.length > 0) attackEnemies();
                enemyArray = enemyArray.filter(e => e.isAlive);
                if(enemyArray.length <= 0) {
                    waveComplete = true;
                    waveDelayFrames = WAVE_DELAY_FRAMES;
                }
                moneyNumberArray = moneyToArray(playerMoney);
            }
            else if(waveID < WAVE_TABLE.length){
                newWave();
            }
            else sceneID = 3;
            break;
        case 2:
            break;
    }
    gameFrameNumber += 1;
}

function startGame(){
    towerArray = [];
    towerSlotArray = [];
    enemyArray = [];
    firingAnims = [];
    waveID = 1;
    playerHealth = 3;
    playerMoney = STARTING_MONEY;
    Object.assign(globalSelector, {
        x:0,
        y:0,
        isActive:false,
    });   

    const tower_radius = 20;
    towerSlots.forEach(slot => {
        let x = slot[0];
        let y = slot[1];
        towerSlotArray.push(new TowerSlot(x, y, tower_radius));
    });

    spawnEnemies();

    startButtonActive = false;
    sceneID = 1;
}

function spawnEnemies() {
    let wave = WAVE_TABLE.find(e => {
        if(e.id === waveID) return true;
    });
    for(let i = 0; i < wave.enemyList.length; i++){
        let nextSpawn = wave.enemyList[i];
        let spawnX = Math.min((i*-60)-25,-25);
        switch(nextSpawn){
            case 0: {
                enemyArray.push({isAlive:false});
                break;
            }
            case 1: {
                let newGhost = ENEMIES.find(i => {
                    if(nextSpawn == i.id) return true;
                });
                enemyArray.push(new Enemy(newGhost.health, newGhost.speed, newGhost.value, newGhost.tex, spawnX));
                break;
            }
        }
    }
    enemyArray.filter(e => e.isAlive);
}

function newWave(){
    if(waveDelayFrames > 0) {
        waveDelayFrames--;
        return;
    }
    else {
        waveID++;
        spawnEnemies();
    }
}

function placeTower(slot, type){
    let tex = TOWER_TEXS.find(t => { return t.id == type;});
    let newTower = TOWERS.find(t => { return t.id == type;});
    slot.isActive = false;
    let t = new Tower(type, slot.x, slot.y, tex, newTower.damage, newTower.cost, newTower.firingRadius);
    playerMoney -= t.cost;
    towerArray.push(t);
    towerSlotArray = towerSlotArray.filter(s => s.isActive);
    globalSelector.isActive = false;
}

function clickHandler(mouse){
    if(sceneID != 1) {
        let buttonName;
        if(sceneID == 0) buttonName = 'start';
        else if(sceneID == 2) buttonName = 'quit';
        // console.log(buttonName);
        let button = MENU_TEXS.find(b => { return b.id == buttonName });
        // console.log(button);
        button.bound = {
            left: button.drawX,
            top: button.drawY,
            right: button.drawX + button.width,
            bottom: button.drawY + button.height,
        };
        // console.log(button.bound);
        
        if(mouse.x > button.bound.left &&
            mouse.x < button.bound.right &&
            mouse.y > button.bound.top &&
            mouse.y < button.bound.bottom){
                // console.log("button clicked");
                if(sceneID == 0) startGame();
                else if (sceneID == 2) sceneID = 0;
                return;
            }
    }    
    clickFoundation(mouse);
    if(globalSelector.isActive) clickSelector(mouse);
}

function clickSelector(mouse){
    // console.log('clickSelector is running');
    // console.log(globalSelector.button);
    // console.log(mouse);
    let buttonClicked = globalSelector.button.find(b => { if ( 
        mouse.x > b.bound.left &&
        mouse.x < b.bound.right &&
        mouse.y > b.bound.top &&
        mouse.y < b.bound.bottom) {
            return b;
        }});
    
    if(buttonClicked == undefined) return;

    switch(buttonClicked.id){
        case 'cancel': {
            globalSelector.isActive = false;
            break;
        }
        case 'arrow': {
            let cost = TOWERS.find(t => { return t.id == 'arrow' }).cost;
            if(playerMoney < cost) {
                globalSelector.isActive = false;
                break;
            }
            let slot = towerSlotArray.find(s => { return s.x == globalSelector.x && s.y == globalSelector.y });
            placeTower(slot, 'arrow');
            break;
        }
        case undefined: {
            //donothing
            break;
        }
        default: {
            //do nothing
            break;
        }
    }
}

function clickFoundation(mouse){
    // console.log('clicked a foundation');
    let slot = towerSlotArray.find(s => { if(
        mouse.x > s.left &&
        mouse.x < s.right &&
        mouse.y > s.top &&
        mouse.y < s.bottom){
            return s;
        } 
    });
    // console.log(slot);
    if(slot == undefined) return;

    globalSelector.x = slot.x;
    globalSelector.y = slot.y;
    globalSelector.isActive = true;
    
    // console.log(globalSelector.isActive);

    let arrow = globalSelector.button.find(b => { return b.id == 'arrow' });
    arrow.pos = {
        x: globalSelector.x - arrow.tex.size,
        y: globalSelector.y + arrow.tex.size/2,                
    };
    arrow.bound = {
        left: arrow.pos.x,
        right: arrow.pos.x + arrow.tex.size,
        top: arrow.pos.y,
        bottom: arrow.pos.y + arrow.tex.size,
    };

    let cancel = globalSelector.button.find(b => { return b.id == 'cancel' });;
    cancel.pos = {
        x: globalSelector.x,
        y: globalSelector.y + cancel.tex.size/2,                
    };
    cancel.bound = {
        left: cancel.pos.x,
        right: cancel.pos.x + cancel.tex.size,
        top: cancel.pos.y,
        bottom: cancel.pos.y + cancel.tex.size,
    };

    // console.log(globalSelector.button);
    // console.log(globalSelector.x, globalSelector.y);
}

function moveEnemy(){
    enemyArray.forEach(enemy => {
        if(!enemy.isAlive) {
            return;
        }
        let targetIndex = enemy.targetWaypoint;
        let target = {
            x: MAP_WAYPOINTS[targetIndex][0],
            y: MAP_WAYPOINTS[targetIndex][1]
        }
        if (enemy.x == target.x &&
            enemy.y == target.y){
                if (enemy.targetWaypoint + 1 < MAP_WAYPOINTS.length) enemy.targetWaypoint++;
                else {
                    enemy.isAlive = false;
                    playerHealth--;
                }
            }
        if(enemy.isAlive) {
            if(enemy.x + enemy.speed < target.x) enemy.x += enemy.speed;
            else if (enemy.x  - enemy.speed > target.x) enemy.x -= enemy.speed;
            else enemy.x = target.x;
            if(enemy.y + enemy.speed < target.y) enemy.y += enemy.speed;
            else if (enemy.y  - enemy.speed > target.y) enemy.y -= enemy.speed;
            else enemy.y = target.y;
            
            enemy.updateLeftTop();
        }
    });
    enemyArray.sort((a, b) => {
        let v = 0;
        let x = a.targetWaypoint + (1/getHyp((a.x - a.targetWaypoint.x), (a.y - a.targetWaypoint.y)));
        let y = b.targetWaypoint + (1/getHyp((b.x - b.targetWaypoint.x), (b.y - b.targetWaypoint.y)));
        if(x > y) v++;
        else if(x < y) v--;
        return v;
    });
}

function attackEnemies(){
    towerArray.forEach(tower => {
        tower.firingDelayDecrement();
        if(tower.firingDelay <= 0) {
            let target = enemyArray.find(enemy => {
                let a = tower.x - enemy.x;
                let b = tower.y - enemy.y;
                let c = getHyp(a,b);
                return c < tower.firingRadius * tower.firingRadius;
            });
            if(target != undefined){
                target.reduceHealth(tower.damage);
                let delay = TOWERS.find(t => { return t.id == tower.type }).firingDelayFrames;
                tower.firingDelayReset(delay);
                firingAnims.push(new FiringAnim(tower.x, tower.y, target, FIRING_ANIMS_FRAMES));
            }
        }
    });
}

function getHyp(a,b) {
    return (a*a) + (b*b);
}

function moneyToArray(money) {
    if(money >= 1000){
        return [9,9,9];
    }
    let temp = [];
    let m = money;
    if(money >= 100){
        let c = Math.floor(m/100);
        temp.push(c);
        m = m%100;
    }
    if(money >= 10){
        let x = Math.floor(m/10);
        temp.push(x);
        m = m%10;
    }
    if(money >= 0) temp.push(m);
    return temp;
}