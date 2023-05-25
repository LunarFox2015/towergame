class TowerSlot{
    constructor(x, y, radius, isActive=true){
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

class ArrowTower {
    constructor(x, y, tex, damage, cost, firingRadius, firingDelay = 0){
        this.x = x;
        this.y = y;
        this.firingRadius = firingRadius;
        this.firingDelay = firingDelay;
        this.tex = tex;
        this.damage = damage;
        this.cost = cost;
        this.top = this.y - this.tex.height/2;
        this.bottom = this.y + this.tex.height/2;
        this.left = this.x - this.tex.width/2;
        this.right = this.x + this.tex.width/2;
        this.arcColor = {
            r:255,
            g:0,
            b:0,
            a:0.25,
        }
        this.drawArc = false;
        this.target;
        this.type = 'arrow';
    }

    findTarget(){
        let t = enemyArray.find(e => {
            let a = this.x - e.x;
            let b = this.y - e.y;
            let c = getHyp(a,b);
            return c < this.firingRadius ** 2;
        });
        return t;
    }

    attackTarget(target){
        target.reduceHealth(this.damage);
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

class BombTower {
    constructor(x, y, tex, damage, splashRange, cost, firingRadius, firingDelay = 0){
        this.x = x;
        this.y = y;
        this.firingRadius = firingRadius;
        this.firingDelay = firingDelay;
        this.tex = tex;
        this.damage = damage;
        this.splashRange = splashRange;
        this.cost = cost;
        this.top = this.y - this.tex.height/2;
        this.bottom = this.y + this.tex.height/2;
        this.left = this.x - this.tex.width/2;
        this.right = this.x + this.tex.width/2;
        this.arcColor = {
            r:255,
            g:0,
            b:0,
            a:0.25,
        }
        this.drawArc = false;
        this.target;
        this.type = 'bomb';
    }

    findTarget(){
        let t = enemyArray.find(e => {
            let a = this.x - e.x;
            let b = this.y - e.y;
            let c = getHyp(a,b);
            return c < this.firingRadius ** 2;
        });
        if(t == undefined) return undefined;
        let targetPoint = {
            x: t.x,
            y: t.y,
        };
        return targetPoint;
    }

    attackTarget(target){
        let x = target.x;
        let y = target.y;
        enemyArray.forEach(e => {
            let a = x - e.x;
            let b = y - e.y;
            let c = getHyp(a,b);
            if (c<this.splashRange ** 2) e.reduceHealth(this.damage); 
        });
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

    firingDelayDecrement() {
        if(this.firingDelay > 0) {
            this.firingDelay--;
        }
    }

    firingDelayReset(t){
        this.firingDelay = t;        
    }
}

class Enemy {
    constructor(health, speed, value, tex, x = -25, y = 87, target = 0, isAlive = true) {
        this.speed = speed;
        this.x = x;
        this.y = y;
        this.tex = tex;
        this.left = this.x - this.tex.width/2;
        this.top = this.y - this.tex.height/2;
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

    updateLeftTop(){
        this.left = this.x - this.tex.width/2;
        this.top = this.y - this.tex.height/2;
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
        this.timer--;
    }
}