//This function defines the gun (player)

const Gun = function(ctx, x, y, gameArea)
{
    //The sequence of the gun animation

    const seqeunces = {
        idle: {x:0, y: 0, width: 123, height: 128, count : 1, timing: 2000, loop: false},
        fire: {x:0, y: 0, width: 123, height: 128, count : 5, timing : 10, loop : false}
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
        speed = speed * 2;
    }

    //SpeedDown function for speeding down the gun
    const slowDown = function() {
        speed = speed * 0.5;
    }

    const shoot = function(){
        sprite.setSequence(seqeunces.fire);

        let {x, y} = sprite.getXY();

        return {x, y};
     
    }

    //Update the current location of the gun
    const update = function(time){
        if(direction != 0){
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
        update: update,
        shoot: shoot
    }
};