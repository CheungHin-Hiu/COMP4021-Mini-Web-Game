const Bullethole = function(ctx, x, y){
    const seqeunces = {
        bullethole: { x: 0, y: 0, width: 1200, height: 1200, count: 1, timing: 200, loop: false},
    };


    const sprite = Sprite(ctx, x, y);

    let lastUpdated = 0;

    sprite.setSequence(seqeunces.bullethole)
        .setScale(0.1)
        .useSheet("bullet_hole.png");

    const setXY = function(x, y, time){
        sprite.setXY(x, y);
        lastUpdated = time;
    }

    const hideHole = function(time){
      if(time - lastUpdated > 3000)
        sprite.setXY(-1000, -1000);
    }

    return {
        setXY: setXY,
        hideHole: hideHole,
        draw: sprite.draw,
    }
}