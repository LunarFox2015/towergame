class TowerSlot{
    constructor(x,y,radius,isActive=true){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.isActive = isActive;    
        this.top = this.y - this.radius;
        this.bottom = this.y + this.radius;
        this.left = this.x - this.radius;
        this.right = this.x + this.radius;
    }
}

class SelectorButton {
    constructor(id, x, y, tex){
        this.id = id;
        this.x = x;
        this.y = y;
        this.tex = tex;
        this.bound;
    }
}

/* class BetterSelectorButton {
    constructor(tex, x, y){
        this.tex = tex;
    }
} */

class Tower {
    constructor(x,y,firingRadius,towerRadius,firingDelay){
        this.x = x;
        this.y = y;
        this.firingRadius = firingRadius;
        this.firingDelay = firingDelay;
        this.towerRadius = towerRadius;
        this.height = towerRadius*2;
        this.width = towerRadius*2;
        this.top = this.y - this.towerRadius;
        this.bottom = this.y + this.towerRadius;
        this.left = this.x - this.towerRadius;
        this.right = this.x + this.towerRadius;
        this.textureLeft = 0;
        this.textureTop = 0;
        this.arcColor = {
            r:255,
            g:0,
            b:0,
            a:0.25,
        }
        this.drawArc = false;
        this.cost = 50;
    }

    firingDelayDecrement() {
        if(this.firingDelay > 0) {
            this.firingDelay--;
        }
    }

    firingDelayReset(t){
        this.firingDelay = t;        
    }

    showRadius(mouse){
        if( mouse.x > this.left &&
                mouse.x < this.right &&
                mouse.y > this.top &&
                mouse.y < this.bottom){
                    this.drawArc = true;
                }
            else this.drawArc = false;
    }
}

class Enemy {
    constructor(health, velocity, value, tex = {}, x = -25, y = 87, target = 0, isAlive = true) {
        this.velocity = velocity;
        this.x = x;
        this.y = y;
        this.tex = tex;
        this.left = this.x - this.tex.size/2;
        this.top = this.y - this.tex.size/2;
        this.moneyOnKill = value;
        this.isAlive = isAlive;
        this.health = health;
        this.targetWaypoint = target;
    }
    
    reduceHealth(damage){
        this.health -= damage;
        if (this.health <= 0) {
            playerMoney += this.moneyOnKill;
            this.isAlive = false;
        }
    }
}

class FiringAnim {
    constructor (sourceX, sourceY, target, timer) {
        this.sourceX = sourceX;
        this.sourceY = sourceY;
        this.target = target;
        this.timer = timer;
    }

    drawAnim () {
        context.fillStyle = 'rgba(0,0,0,0.5)';
        context.beginPath();
        context.moveTo(this.sourceX, this.sourceY);
        context.lineTo(this.target.x, this.target.y);
        context.stroke();
    }
}