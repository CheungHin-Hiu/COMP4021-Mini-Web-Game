//Function that defines the object module
//ctx: A canvas context for drawing
//x: Initial x position of the
const GameObject = function(ctx, x, y, type) {
    const seqeunces = {
        gem: { x: 192, y: 32, width: 16, height: 16, count: 4, timing: 200, loop: true },
        ring: { x: 192, y: 64, width: 16, height: 16, count: 4, timing: 200, loop: true},
        spider: {x: 160, y: 0, width: 16, height: 16, count: 2, timing: 100, loop: true},
        bomb: {x:64, y:112, width: 16, height: 16, count: 9, timing: 350, loop: true}
    };


    let direction = -1;

    let speed = 200;
    //THe sprite object created from the Sprite modu;e
    const sprite = Sprite(ctx, x, y);

    sprite.setSequence(seqeunces[type])
        .setScale(5)
        .useSheet("object_sprites.png");

    //Set the type of the object
    const setType = function(type){
        sprite.setSequence(seqeunces[type]);
    };

    const rewardPoints = function(type){
        switch(type){
            case "gem":
                return 1;
            case "ring":
                return 3;
            case "spider":
                return 5;
            case "bomb":
                return -10;
        }
    }

    const randomize = function(random_y){
        //Radomize the type of object
        const types = ["gem", "ring", "spider", "bomb"];
        const spawnX = [-50, 1250];
        const spawnY = [100, 300, 500]
        setType(types[Math.floor(Math.random() * 4)]);

        const x = spawnX[Math.floor(Math.random() * 2)];
        const y = spawnY[random_y];
        sprite.setXY(x,y);

        if(x == -50)
            direction = 0; //Going from left to right
        else
            direction = 1; //Going from right to left
    }

    const update = function(time)
    {
        let {x,y} = sprite.getXY();
        if(direction == 0){
            x += speed / 60;

        }
        else if (direction == 1){
            x -= speed/ 60;
        }
        sprite.setXY(x,y);
        
        sprite.update(time);
    }

    return{
        getXY: sprite.getXY,
        setXY: sprite.setXY,
        setType: setType,
        rewardPoints: rewardPoints,
        randomize, randomize,
        getBoundingBox: sprite.getBoundingBox,
        draw: sprite.draw,
        update: update
    };
}