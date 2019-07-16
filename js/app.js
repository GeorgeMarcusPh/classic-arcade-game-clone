"use strict";

// Arrays to hold enemies and gems
const allEnemies = [];
const allGems = [];

// Cooridinates of the player's start position
const x = 200;
const y = 410;

//  The Base class for The Player, Enemy and Gem classes
class Character {
     constructor(sprite, x, y){
        // The image of the object
        this.sprite = sprite;

        // The position of the object on the x axis of the canvas
        this.x = x;

        // the position of the object on the y axis of the canvas
        this.y = y;
    }


    // Draw the object on the screen, required method for game
    render() {

        // Using the canvas object from Engine.js 
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }


}
// Enemy class that will instantiate Enemy objects which our player must avoid
class Enemy extends Character{

    // This is where all the required variables are provided to the object 
    constructor(sprite, speed, x, y){

        // Inherited from the super class
        super(sprite, x, y);

        // The speed of the enemy added to the inherited variables from the base class
        this.speed = speed;
    }  

    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(dt) {

        // You should multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.
        this.x += this.speed * dt;
    }

}

// Player class to instantiate player objects
class Player extends Character{

    // This is where all the required variables are provided to the object 
    constructor(sprite, x, y) {
        super(sprite, x, y);

        //These variables are fixed to certain values when instantiating Player object 
        this.level = 1;
        this.score = 0;
        this.gems = 0;
    }

    // This method is used to restore the game state either when colliding with an Enemy or collecting a Gem
    reset() {

        // The default position of the Player on the screen
        this.x = x;
        this.y = y;

        // Removing all objects from the allEnemies Array
        for (let i = 0; i < allEnemies.length; i++) {
            allEnemies.pop();
        }
        
        // Removing all objects from the allGems Array
        for (let x = 0; x < allGems.length; x++) {
            allGems.pop();
        }

        // Gems are rendered and added to an array 
        addGems();
    }

    // This method checks when the Player collides with an Enemy, a Gem or a Water block - (object)
    // From 2D collision detection - MDN documentation
    //https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
    checkCollision(object, yAxis, width, height) {
        for (let i = 0; i < object.length; i++) {
            if (this.x +  85 > object[i].x &&
                this.x +  17 < object[i].x + width &&
                this.y + 140 > object[i].y + yAxis &&
                this.y +  63 < object[i].y + yAxis + height) {

                // Collision detected move object out of game board
                object[i].y += 800;
                return true;
            }
        }
    }

    // Update the player's position, required method for game
    update() {

        // Checks when the player hits the Water blocks(Top Section of the canvas)
        if (this.y < 4) {

            // increase level and score and reset the player's position, Enemies and Gems
            this.level += 1;
            this.score += 5;
            this.reset();
        }

        // Checks when the player collides withs an Enemy
        if (this.checkCollision(allEnemies, 77, 98, 66) === true) {

            // Hide the canvas element and display a game over screen
            document.querySelector('canvas').style.display = "none";
            document.querySelector('.game-over').style.display = "block";

            // Restoring the canvas element and hide the gameover screen to play again
            document.querySelector('button').addEventListener('click', ()=>{
                document.querySelector('canvas').style.display = 'block';
                document.querySelector('.game-over').style.display = "none";
            });

            // Resetting the game stats
            this.level = 1;
            this.score = 0;
            this.gems = 0;

            //  Resetting player's position, Enemies and Gems
            this.reset();
        }

        // Checks when the player collects a gem
        if (this.checkCollision(allGems, 77, 58, 66) === true) {

            // Increase the score and the number of gems
            this.score += 1;
            this.gems += 1;
        }

    }

     // Draw the player on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

        // Draw the stat text using the canvas's methods
        ctx.textAlign = 'center';
        ctx.font = '25px Georgia bold';
        ctx.fillStyle = '#000';
        ctx.fillText('Level: ' + this.level, 57, 100); /*@params Text, x position and y position */
        ctx.fillText('Score: ' + this.score, 253, 100);/*@params Text, x position and y position  */
        ctx.fillText('Gems: ' + this.gems, 450, 100);/*@params Text, x position and y position  */
    }

    // This method is required to prevent the player from going off the screen
    // From Engine.js we know that each column is 101 units and each row is 83 units
    handleInput(direction) {
        if (direction === 'up') {

            // Go up by one row
            this.y -= 83;

        // Knowing that the whole canvas height is 606 units, this ensures that the player is not off screen
        } else if (direction === 'down' && this.y < 406) {

            // Go down by one row
            this.y += 83;

        // Checking if the player is off screen, knowing that the canvas start from 0 on the x axis
        } else if (direction === 'left' && this.x > 0) {

            // Go left by one column
            this.x -= 101;

        // Checking if the player is off screen, knowing that the canvas ends at 505 units on the x axis
        } else if (direction === 'right' && this.x < 305) {

            // Go right by one column
            this.x += 101;
        }
    }
}

// Gem class to instantiate Gem objects
class Gem extends Character{

    // This is where all the required variables are provided to the object 
    constructor(sprite, x, y){

        // Inherited from the base class
        super(sprite, x, y);
    }
   
}

// Getting a random number between two values
function getRandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}


// Creating Enemies every certain amount of time
setInterval(()=> {  

    // This ensures that the Enemies appear only on the paved blocks
    // Starting from the second row at the top to the sixth row
    // Subtracting 24 to make sure the enemy is moving in the middle of the paved blocks
    const row = (getRandomNumber(1, 5) * 83) - 24;

    // Setting the speed of the enemy randomly
    const speed = getRandomNumber(100, 550);

    // Setting the enemy image from the images Folder
    const sprite = 'images/enemy-bug.png';

    // Adding the Enemy objects to the allEnemies Array 
    // The Enemies are created off screen by setting the x value to (-100)
    allEnemies.push(new Enemy(sprite, speed, -100, row));

    // The time taken to create another Enemy object
}, 1000);


// This function creates different gems in randomly chosen columns and rows
function addGems() {
    for (let i = 0; i < 3; i++) {

        // random columns and rows
        const col = getRandomNumber(0, 6) * 101;
        const row = (getRandomNumber(1, 5) * 83) - 24;

        // Set sprite image
        let sprite;

        if (i === 0) {
            sprite = 'images/blue-gem.png';
        } else if (i === 1) {
            sprite = 'images/green-gem.png';
        } else {
            sprite = 'images/rock.png';
        }

        // Add the created gems to allGems Array
        allGems.push(new Gem(sprite, col, row));
    }
}

//Adding the gems to the canvas 
addGems();

// Instantiating the player object
let player = new Player('images/char-boy.png', x, y);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});

// Toggle the player characters
 document.querySelector('.characters').addEventListener('click', (event)=>{
        if (event.target.classList.contains('boy')){

             player = new Player('images/char-boy.png', x, y);

        }else{

             player = new Player('images/char-cat-girl.png', x, y);
        }
});

