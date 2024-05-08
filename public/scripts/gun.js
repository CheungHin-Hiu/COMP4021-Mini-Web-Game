//This function defines the gun (player)

const Gun = function(ctx, x, y, gameArea)
{
    //The sequence of the gun animation

    const seqeunces = {
        idle: {x:0, y: 0, width: 123, height: 128, count : 1, timing: 2000, loop: false},
        fire: {x:0, y: 0, width: 123, height: 128, count : 5, timing : 100, loop : false}
    };


    //Spirte object of the gun created from the sprite module
    const sprite = Sprite(ctx, x, y);

    //This spirte object is configured for the guns spirte here
    sprite.setSequence(seqeunces.idle)
        .setScale(0.8)
        .useSheet("gun_sprite.png");
    

    //Indicates the moving direction of the gun(player)
    let direction = 0

    //This is the moving speed of the gun 
    let speed = 150;

    let lastShoot = 0;

    let shootSpeed = 1000;

    //This set if the gun can move or not
    let canMove = true;

    //Function setting the guns's moving direction
    const move = function(dir){
        direction = dir;
    }

    //Function that stops the gun from moving

    const stop = function(){
        direction = 0;
    };

    //SpeedUp function for speeding up the gun
    const speedUp = function() {
        speed = speed + 10;
    }

    //SpeedDown function for speeding down the gun
    const slowDown = function() {
        speed = speed * 0.5;
    }

    const shootSpeedUp = function(){
        if(shootSpeed > 50){
            shootSpeed -= 100;
            console.log(shootSpeed);
        }
    }

    const disableMove = function(){
        canMove = false;
    };

    const enableMove = function(){
        canMove = true;
    }



    const shoot = function(time){
  
        let canShoot = false;
        if(lastShoot == 0){
            canShoot = true;
            lastShoot = time;
        }
        else if(time - lastShoot > shootSpeed){
            canShoot = true;
            lastShoot = time;
        }
        if(canShoot){
            sprite.setSequence(seqeunces.fire);

            let {x, y} = sprite.getXY();
            return {x, y};
         }
        return(-1000, -1000);
     
    }

    //Update the current location of the gun
    const update = function(time){
        if(direction != 0 && canMove){
            let {x, y} = sprite.getXY();

            switch(direction){
                case 1: x -= speed / 60; break;
                case 2: y -= speed / 60; break;
                case 3: x += speed / 60; break;
                case 4: y += speed / 60; break;
            }

            if(gameArea.isPointInBox(x,y))
                sprite.setXY(x,y);
        }

        sprite.update(time);
    }
    
    return {
        move: move,
        stop: stop,
        speedUp: speedUp,
        slowDown: slowDown,
        getBoundingBox: sprite.getBoundingBox,
        draw: sprite.draw,
        getXY: sprite.getXY,
        setXY: sprite.setXY,
        update: update,
        shoot: shoot,
        shootSpeedUp: shootSpeedUp,
        disableMove: disableMove,
        enableMove: enableMove
    }
};