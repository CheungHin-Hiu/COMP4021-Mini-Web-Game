const Utility = function(){
   
    const randomization = function(itemsList)
    {
        for(let i = 0; i < itemsList.length; i++){
            let {x,y} = itemsList[i].getXY();
            if(x <= -100 || x >= 1300 || y >= 900)
                itemsList[i].randomize(i);
        }
    }

    // const gameStartCountDown = function(doFrame)
    // {
    //     console.log(doFrame);
    //     const num = $("#count-down").text();
    //     if(num == 0){
    //         $("#game-start").hide();
    //         requestAnimationFrame(doFrame(performance.now));
    //     }
    //     else{
    //         $("#count-down").text(num - 1);
    //         setTimeout(gameStartCountDown(doFrame));
    //     }
    // }
    const checkCollision = function(collideX, collideY, abilityList, gun)
    {
        for(let i = 0; i<abilityList.length; i++)
            {   
                if(abilityList[i].getBoundingBox().isPointInBox(collideX,collideY))
                {
                    const abilityType = abilityList[i].getAbilityType();
                    if(abilityType == "shootBoost")
                        gun.shootSpeedUp();
                    else if(abilityType == "moveBoost")
                        gun.speedUp();
                        
                    abilityList[i].randomize();
                }
            }
    }
    // const checkFireHit = function(hitX, hitY, gameStats, objectsList)
    // {
    //     gameStats.totalShot +=1;
    //     for(let i = 0; i<objectsList.length; i++)
    //     {   
    //         if(objectsList[i].getBoundingBox().isPointInBox(hitX,hitY))
    //         {
    //             gameStats.hitShot += 1;
    //             gameStats.score += objectsList[i].rewardPoints();
    //             $("#your-score").text(String(gameStats.score));
    //             objectsList[i].randomize(i);
    //         }
    //     }
    //     $("#accuracy").text(String(Math.round(gameStats.hitShot/gameStats.totalShot * 100)) + "%");
    // }

    // function doFrame(now, gameStats, Gun, objectsList, abilitysList, Canvas){
    //     console.log(gameStats);
    //     if (gameStats.gameStartTime == 0) gameStats.gameStartTime = now;
        
    //     gameStats.currentTime = now;
    //     //Update the time remaining
    //     const gameTimeSoFar = now - gameStats.gameStartTime;
    //     const timeRemaining = Math.ceil((gameStats.totalGameTime * 1000 - gameTimeSoFar) /1000);

    //     $("#time-remaining").text(timeRemaining);
    //     $("#your-score").text(String(gameStats.score));

    //     if(timeRemaining <= 0)
    //     {
            
    //         $("#time-remaining").text(0);
    //         if(gameStats.score > gameStats.enemyScore)
    //             $("#win-lose").text("win");
    //         else if(gameStats.score < gameStats.enemyScore)
    //             $("#win-lost").text("lose");
    //         else
    //             $("$win-lose").text("draw");
    //         $("#game-over").show();
    //         setTimeout(() => {location.href = "/Project/public/Game/game_over.html"}, 3000);
    //         return;
    //     }

    //     Gun.playerGun.update(now);
    //     objectsList[0].update(now);
    //     objectsList[1].update(now);
    //     objectsList[2].update(now);
    //     abilitysList[0].update(now);
        
    //     randomization(objectsList);
    //     randomization(abilitysList);
    //     const {x, y} = (Gun.playerGun.getXY());
    //     checkCollision(x,y, abilitysList, Gun.playerGun);
    //     Canvas.context.clearRect(0, 0, Canvas.cv.width, Canvas.cv.height);

    //     objectsList[0].draw();
    //     objectsList[1].draw();
    //     objectsList[2].draw();
    //     abilitysList[0].draw();
    //     Gun.playerGun.draw();
    //     setTimeout(window.requestAnimationFrame(doFrame(performance.now(), gameStats, Gun, objectsList, abilitysList, Canvas)), 1000);
    // }

    return { randomization,  checkCollision}
}();