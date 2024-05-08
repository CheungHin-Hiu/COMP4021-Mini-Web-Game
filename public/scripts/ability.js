const Ability = function(ctx, x, y, boostType){
    const seqeunces = {
        shootBoost: { x: 0, y: 0, width: 16, height: 16, count: 1, timing: 200, loop: false},
        moveBoost: { x: 80, y: 16, width: 16, height: 16, count: 1, timing: 200, loop: false},
    };

    let speed = 60;

    let abilityType = "null";

    const sprite = Sprite(ctx, x, y);

    sprite.setSequence(seqeunces[boostType])
        .setScale(4)
        .useSheet("ability.png");

    const setBoostType = function(boostType){
        sprite.setSequence(seqeunces[boostType]);
        abilityType = boostType;
        
    };

    const randomize = function(boostTypeNum, randomX){
        const boostTypes = ["shootBoost", "moveBoost"];
        setBoostType(boostTypes[boostTypeNum]);

        const x = randomX;
        const y = -100;
        
        sprite.setXY(x, y);
    }


    const update = function(time)
    {
        let {x,y} = sprite.getXY();
        y += speed / 60;
        sprite.setXY(x,y);
        sprite.update(time);
    }

    const getAbilityType = function(){
        return abilityType;
    }

    return {
        getXY: sprite.getXY,
        setXY: sprite.setXY,
        setBoostType: setBoostType,
        randomize: randomize,
        getBoundingBox: sprite.getBoundingBox,
        draw: sprite.draw,
        update: update,
        getAbilityType: getAbilityType
    }
}