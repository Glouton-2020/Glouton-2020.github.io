Project Title: Box Invaders

Built With

HTML - The web framework used
CSS
JavaScript 

# Box Invaders

## Concept: 
Enemies will come down from the top of the screen in a grid and move left and right until they hit either edge at which point they will move down and move in the opposite direction away from the edge of the screen. The entire grid moves as a unit, so if one enemy hits an edge, they all move down and move in the other direction. The enemies on the bottom of each column occasionally shoot a projectile down towards the player. Each enemy has a rank which has it own graphic and points awarded when killed. The enemies closest to the player a low rank and the ones on top have a high rank. 

The player will be at the bottom of the screen and limited to moving left and right. They can shoot a projectile upwards, being limited to one shot on the screen at a time. If a player shot hits an enemy, the enemy is removed from the grid with a little explosion and the player awarded some points. All the remaining enemies speed up a little bit. When all the enemies have been killed, a new grid of enemies is created, now faster and more likely to shoot, and the player is awarded another ship. 

When an enemy shot hits the player, the ship is destroyed. If there are remaining ships available, play continues with a new ship. Once all the extra ships have been destroyed, the game ends and the top 10 high scores are displayed. The high scores will be saved in the browser so the player can come back and beat their own high scores from previous sessions. 

## Technologies Used:
    - HTML
    - CSS
    - JAVASCRIPT
    - JSON

## Approach: 
I studied various tutorials online for the creation of a game like space invaders. 
It helped build a good foundation as i started to develop my wireframe and then the pseudo code that would go into it. 

After I watched and read enough tutorials i went into it. First i developed the Math classes and structure of the game. Then user input and keyboard integration. Finally enemy behavior, collision detection and projectiles were the last components. I began to build a feature to include the high score and show lives. Starting again halfway led me to not complete these features. 

## Challenges: 
It took me 2 attempts to get the game up and running. 
I restarted and rewrote the code halfway through. There were numerous ways to go about writing this, i eventually settled on the above approach after seeing what would work best and lay a good foundation so i can come back and update this code tp include sprites, explosions, and audio. 

Collision detection was difficult to understand and i will need to go back and improve on it. Understanding frame rates was also a difficult but joyous task. 

I will need to come back and finalize everything to fully get the game up and running as a saw it in my head. 

## Unsolved Problems
> Add the win state to show High Score
> Working Scoreboard
> Animated Sprites
> Exploding targets
> Audio 

## Additional information: 
## App Demo 
Please take a look at my project hosted on Heroku
https://github.com/Glouton-2020/Glouton-2020.github.io/tree/master/New%20Space%20Invaders


