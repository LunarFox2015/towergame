"use strict"

//constants
const FPS = 60;
const CIRCLE_RADIANS = Math.PI * 2;
const MENU_FILL_COLOR = 'rgba(255,255,255,0.5)';
const TOWER_RADIUS = 20;
const ENEMY_VELOCITY = 20/60;
const ENEMY_SIZE = 20;
const ENEMY_SPAWN = [-25,87];

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
    button:[]
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

    canvas.addEventListener('mousedown', (event) => {
        mouse = {
            x: event.offsetX,
            y: event.offsetY,
        };
        clickHandler(mouse);
    });

    canvas.addEventListener('mousemove', (event) => {
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
    
    window.addEventListener('keydown', (event) => {        
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

    window.addEventListener('keyup', (event) => {
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
    if(now-lastFrameTime>1000/FPS){
        let timesLooped = 0;
        while(now-lastFrameTime>1000/FPS && timesLooped < 5){
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
        context.fillRect(0,0, canvas.width, canvas.height);

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
            
        }

        needRedraw = false;
    }
    requestAnimationFrame(onDrawFrame);
}

function drawStartScreen(){
    context.fillStyle = MENU_FILL_COLOR;
    context.fillRect(0,0, canvas.width, canvas.height);
    const start_tex = {
        left: 360,
        top: 400,
        width: 140,
        height: 80
    };
    const S_button_tex = {
        left: 280,
        top: 360,
        width: 80,
        height: 40
    }
    let title = {x:0, y:0};
    title.x = (canvas.width/2) - (start_tex.width/2);
    title.y = (canvas.height/2) - (start_tex.height*2);
    let button = {x:0, y:0};
    button.x = (canvas.width/2) - (S_button_tex.width/2);
    button.y = (canvas.height/2) - (S_button_tex.height/2);
    
    context.drawImage(spriteSheet, start_tex.left, start_tex.top, 
        start_tex.width, start_tex.height, title.x, title.y, 
        start_tex.width, start_tex.height);
    
    context.drawImage(spriteSheet, S_button_tex.left, S_button_tex.top,
        S_button_tex.width, S_button_tex.height, button.x, button.y,
        S_button_tex.width, S_button_tex.height);
}

function drawPauseScreen(){
    context.fillStyle = MENU_FILL_COLOR;
    context.fillRect(0,0, canvas.width, canvas.height);

    const pause_tex = {
        left: 360,
        top: 280,
        width: 80,
        height: 40,
    };
    const quit_tex = {
        left: 280,
        top: 400,
        width: 80,
        height: 40
    }
    let text = {x:0, y:0};
    text.x = (canvas.width/2) - (pause_tex.width/2);
    text.y = (canvas.height/2) - (pause_tex.height*2);
    let button = {x:0, y:0};
    button.x = (canvas.width/2) - (quit_tex.width/2);
    button.y = (canvas.height/2) - (quit_tex.height/2);
    
    context.drawImage(spriteSheet, pause_tex.left, pause_tex.top, 
        pause_tex.width, pause_tex.height, text.x, text.y, 
        pause_tex.width, pause_tex.height);
    
    context.drawImage(spriteSheet, quit_tex.left, quit_tex.top,
        quit_tex.width, quit_tex.height, button.x, button.y,
        quit_tex.width, quit_tex.height);
}

function drawGameFrame(){
    context.drawImage(bgImage, 0, 0);

    //draw tower slots
    towerSlotArray.forEach(tower => {
        if(tower.isActive) {
            const slot_color = 'grey';
            context.fillStyle = slot_color;
            context.beginPath();
            context.arc(tower.x, tower.y, tower.radius, 0, CIRCLE_RADIANS, false);
            context.fill();
        }
    });

    //draw firing anims
    firingAnims.forEach(anim => {
            anim.drawAnim();
            anim.timer--;
        });
    firingAnims = firingAnims.filter(a => { a.timer > 0 });

    //draw enemies
    enemyArray.forEach(enemy => {
        const health_bar_h = 7;
        context.drawImage(spriteSheet, enemy.tex.left, enemy.tex.top, enemy.tex.size, enemy.tex.size, enemy.left, enemy.top, enemy.tex.size, enemy.tex.size);
        context.fillStyle = 'red';
        context.fillRect(enemy.left, enemy.top - health_bar_h, (enemy.health/100)*ENEMY_SIZE, health_bar_h);
    });

    //draw towers & firing arcs
    towerArray.forEach(tower => {
        context.drawImage(spriteSheet,
            tower.textureLeft, tower.textureTop, tower.width, tower.height,
            tower.left, tower.top, tower.width, tower.height);
        
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
        const size = 40;
        globalSelector.button.forEach(button =>{
            context.drawImage(spriteSheet, button.tex.left, button.tex.top, size, size, button.x, button.y, size, size);
        });
    }

    //draw money display
    context.drawImage(spriteSheet, MONEY_TEX.tex_pos.left, MONEY_TEX.tex_pos.top, MONEY_TEX.size, MONEY_TEX.size, MONEY_TEX.position.x, MONEY_TEX.position.y, MONEY_TEX.size, MONEY_TEX.size);
    let x = MONEY_TEX.position.x + MONEY_TEX.size;
    let y = MONEY_TEX.position.y + MONEY_TEX.size/4;
    moneyNumberArray.forEach(d => {
        NUMBERS.every(n => {
            if(d == n.value){
                context.drawImage(spriteSheet, n.left, n.top, n.size, n.size, x, y, n.size, n.size);
                x += n.size;
                return false;
            }
            else return true;
        });
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
            
            let phealthbar = ''
            for(let i = playerHealth; i > 0; i--){
                phealthbar += '♥';
            }
            healthDisplay.innerHTML = phealthbar;

            if(playerHealth <= 0){
                sceneID = 0;
            }
            else if(enemyArray.length > 0) {
                moveEnemy();
                if(towerArray.length > 0) attackEnemies();
                enemyArray = enemyArray.filter(e => e.isAlive);
                if(enemyArray.length <= 0) {
                    waveComplete = true;
                    waveDelayFrames = 5*60;
                }
                moneyNumberArray = moneyToArray(playerMoney);
            }
            else if(waveID < WAVE_TABLE.length){
                newWave();
            }
            else sceneID = 0;
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
    globalSelector = {
        x:0,
        y:0,
        isActive:false,
        button:[]
    };
    waveID = 1;
    playerHealth = 3;

    const starting_money = 75;
    playerMoney = starting_money;

    towerSlots.forEach(slot => {
        let x = slot[0];
        let y = slot[1];
        towerSlotArray.push(new TowerSlot(x, y, TOWER_RADIUS));
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
        const next_to_spawn = wave.enemyList[i];
        let spawnX = Math.min((i*-60)-25,-25);
        switch(next_to_spawn){
            case 0: {
                let n = {isAlive:false};
                enemyArray.push(n);
                break;
            }
            case 1: {
                let newGhost = ENEMIES.find(i => {
                    if(next_to_spawn === i.id) return true;
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

function placeTower(slot){
    const firing_radius = 100;
    slot.isActive = false;
    let t = new Tower(slot.x, slot.y, firing_radius, TOWER_RADIUS, 0);
    playerMoney -= t.cost;
    towerArray.push(t);
    towerSlotArray = towerSlotArray.filter(s => s.isActive);
    globalSelector.isActive = false;
}

function clickHandler(mouse){
    const start_pause_bounds = {
            left: 280,
            top: 220,
            right: 360,
            bottom: 260,
    }
    if(mouse.x > start_pause_bounds.left &&
        mouse.x < start_pause_bounds.right &&
        mouse.y > start_pause_bounds.top &&
        mouse.y < start_pause_bounds.bottom){
            if(sceneID == 0) startGame();
            else if (sceneID == 2) sceneID = 0;
            return;
    }
    clickFoundation(mouse);
    if(globalSelector.isActive) clickSelector(mouse);
}

function clickSelector(mouse){
    globalSelector.button.forEach(button => {
        if (mouse.x > button.bound.left &&
            mouse.x < button.bound.right &&
            mouse.y > button.bound.top &&
            mouse.y < button.bound.bottom) {
                switch(button.id){
                    case 0: {
                        globalSelector.isActive = false;
                        break;
                    }
                    case 1: {
                        if(playerMoney < 50) {
                            globalSelector.isActive = false;
                            break;
                        }
                        let slot = towerSlotArray.find(s => {
                            return s.x == globalSelector.x && s.y == globalSelector.y;
                        });
                        placeTower(slot);
                        break;
                    }
                    default: {
                        console.log('something went wrong help');
                        break;
                    }
                }
            }
    });
}

function clickFoundation(mouse){
    towerSlotArray.every(slot => {
        if( mouse.x > slot.left &&
            mouse.x < slot.right &&
            mouse.y > slot.top &&
            mouse.y < slot.bottom){
                const textsize = 40;
                const arrowtext = {
                    left:360,
                    top:320,
                };
                const canceltext = {
                    left:400,
                    top:320,
                };
                                
                globalSelector.x = slot.x;
                globalSelector.y = slot.y;
                globalSelector.isActive = true;

                globalSelector.button = [];
                
                let arrow = new SelectorButton(1, (globalSelector.x - textsize), (globalSelector.y + textsize/2), arrowtext);
                arrow.bound = {
                    left:arrow.x,
                    right:arrow.x + textsize,
                    top:arrow.y,
                    bottom:arrow.y + textsize,
                };

                let cancel = new SelectorButton(0, (globalSelector.x), (globalSelector.y + textsize/2), canceltext);
                cancel.bound = {
                    left:cancel.x,
                    right:cancel.x + textsize,
                    top:cancel.y,
                    bottom:cancel.y + textsize,
                };

                globalSelector.button.push(arrow);
                globalSelector.button.push(cancel);
                return false;
            } // end if
        else return true;
    });
}

function moveEnemy(){
    enemyArray.forEach(enemy => {
        if(!enemy.isAlive) {
            return;
        }
        const targetIndex = enemy.targetWaypoint;
        const target = {
            x: MAP_WAYPOINTS[targetIndex][0],
            y: MAP_WAYPOINTS[targetIndex][1]
        }
        if (enemy.x == target.x &&
            enemy.y == target.y){
                if (enemy.targetWaypoint+1 < MAP_WAYPOINTS.length) enemy.targetWaypoint++;
                else {
                    enemy.isAlive = false;
                    playerHealth--;
                }
            }
        if(enemy.isAlive) {
            if(enemy.x + enemy.velocity < target.x) enemy.x += enemy.velocity;
            else if (enemy.x  - enemy.velocity > target.x) enemy.x -= enemy.velocity;
            else enemy.x = target.x;
            if(enemy.y + enemy.velocity < target.y) enemy.y += enemy.velocity;
            else if (enemy.y  - enemy.velocity > target.y) enemy.y -= enemy.velocity;
            else enemy.y = target.y;
            
            enemy.left = enemy.x - (ENEMY_SIZE/2);
            enemy.top = enemy.y - (ENEMY_SIZE/2);
        }
    });
    enemyArray.sort((a,b) => {
        let v = 0;
        let x = a.targetWaypoint + (1/getHyp((a.x - a.targetWaypoint.x),(a.y - a.targetWaypoint.y)));
        let y = b.targetWaypoint + (1/getHyp((b.x - b.targetWaypoint.x),(b.y - b.targetWaypoint.y)));
        if(x>y) v++;
        else if(x<y) v--;
        return v;
    });
}

function attackEnemies(){
    const damage = 20;
    const firing_delay_frames = 100;
    const anim_delay_frames = 80;
    towerArray.forEach(tower => {
        tower.firingDelayDecrement();
        if(tower.firingDelay <= 0) {
            enemyArray.every(enemy => {
                let a = tower.x - enemy.x;
                let b = tower.y - enemy.y;
                let c = getHyp(a,b);
                if(c < (tower.firingRadius * tower.firingRadius)) {
                    enemy.reduceHealth(damage);
                    tower.firingDelayReset(firing_delay_frames);
                    firingAnims.push(new FiringAnim(tower.x, tower.y, enemy, anim_delay_frames));
                    return false;
                }
                return true;
            });
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
        m = m % 100;
    }
    if(money >= 10){
        let x = Math.floor(m/10);
        temp.push(x);
        m = m%10;
    }
    if(money >= 0) temp.push(m);
    return temp;
    /* switch(money){
        case money >= 100: {
            let c = Math.floor(m/100);
            temp.push(c);
            m = m % 100;
        }
        case (money >= 10): {
            let x = Math.floor(m/10);
            temp.push(x);
            m = m%10;
        }
        case money >= 0: { 
            temp.push(m);
            return temp;
        }
        default: {
            console.error('Invalid money value');
            console.log(money);
            console.log(temp);
            return [];
        } 
    } */
}