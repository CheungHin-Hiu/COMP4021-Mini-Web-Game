const Ability = function(ctx, x, y, boostType){
    const seqeunces = {
        shootBoost: { x: 0, y: 0, width: 16, height: 16, count: 1, timing: 200, loop: false},
        moveBoost: { x: 80, y: 16, width: 16, height: 16, count: 1, timing: 200, loop: false},
    };

    let speed = 70;

    const sprite = Sprite(ctx, x, y);

    sprite.setSequence(seqeunces[boostType])
        .setScale(2)
        .useSheet("ability.png");

    const setBoostType = function(boostType){
        sprite.setSequence(seqeunces[boostType]);
    };

    const randomize = function(){
        const boostTypes = ["shootBoost", "moveBoost"];
        setBoostType(boostTypes[Math.floor(Math.random() * 2)]);

        const x = Math.floor(Math.random()* 800 + 100);
        const y = -100;
        
        sprite.setXY(x, y);
    }


    const update = function(time)
    {
        let {x,y} = sprite.getXY();
        y += speed / 60;
        sprite.setXY(x,y);
        console.log(sprite.getXY());
        sprite.update(time);
    }

    return {
        getXY: sprite.getXY,
        setXY: sprite.setXY,
        setBoostType: setBoostType,
        randomize: randomize,
        getBoundingBox: sprite.getBoundingBox,
        draw: sprite.draw,
        update: update
    }
}