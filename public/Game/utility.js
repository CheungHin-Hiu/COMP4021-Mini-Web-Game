function randomization(itemsList)
{
    for(let i = 0; i < itemsList.length; i++){
        let {x,y} = itemsList[i].getXY();
        if(x <= -100 || x >= 1300 || y >= 900)
            itemsList[i].randomize(i);
    }
}



function checkCollision(collideX, collideY, abilityList, gun)
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