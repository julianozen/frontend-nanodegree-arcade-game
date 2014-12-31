var Y_VALUE = 83;
var X_VALUE = 101;

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x_grid = Math.ceil( (Math.random() * 5))
    //get pixel value for grid value
    this.x = X_VALUE * this.x_grid
    this.y_grid = Math.floor( (Math.random() * 4))
    //center the y value within the grid
    this.y = Y_VALUE/2 + (Y_VALUE * this.y_grid)+20
    //give the bug a random speed factor
    this.speed = Math.random() + .75
    //calculate the bugs right edge x value for collisions
    this.right_edge = this.x + X_VALUE



}


// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // update bugs position realtive to its speed. Mod functions keeps
    // it within the grid
    this.x = (this.x + (Y_VALUE*dt*this.speed)) % (Y_VALUE * 5)
    // update the bugs right edge
    this.right_edge = this.x + X_VALUE
}

//Draws enemy in the correct position
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

//Gives the enemy a new x position and y position
Enemy.prototype.reset = function() {
    this.x_grid = Math.floor( (Math.random() * 5))
    this.y_grid = Math.floor( (Math.random() * 4))
    this.y = Y_VALUE/2 + (Y_VALUE * this.y_grid)+20
}


var Player = function(enemies){
    //Overide the players image
    this.sprite = 'images/char-boy.png'
    // next_x and next_y are used to update player position
    // based on keyboard input. they start at 0.
    this.next_x = 0;
    this.next_y = 0;
    //player contains list of enemies for determining collisions
    this.enemies = enemies;
}

// Inherit from the Enemy class the draw functions and several varibales
Player.prototype = Object.create(Enemy.prototype)

// Take user keyboard input and translate it into player motion
Player.prototype.handleInput = function(direction) {
    if (direction == 'left'){
        this.next_x = -1
        this.next_y = 0
    }
    if (direction == 'up'){
        this.next_x = 0
        this.next_y = -1
    }
    if (direction == 'right'){
        this.next_x = 1
        this.next_y = 0
    }
    if (direction == 'down'){
        this.next_x = 0
        this.next_y = 1
    }
    // update the player's position
    this.update()
    //set the change in x and y values back to 0
    this.next_x = 0
    this.next_y = 0
}

// player starts at (0,4), unlike the bugs which are placed randomly
Player.prototype.reset = function() {
    this.x_grid = 2
    this.y_grid = 4
}

//Determines End Game Condition
Player.prototype.gameOver = function() {
    // If the player has collideed with any enemy return true
    for (i in this.enemies) {
        //If the enemy is in the same y grid as the player
        // Check if the right edge of the bug is within the bounds of the player
        // and return true if it is.
        if (this.y_grid == this.enemies[i].y_grid){
            if (this.enemies[i].right_edge-20 > this.x && this.enemies[i].right_edge < this.right_edge){
                return true
            }
        }
    }
    // Otherwise, check if the player is at the winning row
    return this.y_grid == -1;
}

//Update player
Player.prototype.update = function() {
    // Update player grid position
    this.x_grid = (this.x_grid + (this.next_x))
    this.y_grid = (this.y_grid + (this.next_y))

    //If the player will have moved past any edge,
    // prevent the player from moving too far
    if (this.y_grid < -1) {
        this.y_grid = -1
    }
    if (this.x_grid < 0) {
        this.x_grid = 0
    }
    if (this.y_grid > 4) {
        this.y_grid = 4
    }
    if (this.x_grid > 4) {
        this.x_grid = 4
    }
    //update the x and y pixel values to represent their grid value
    this.x = (X_VALUE *this.x_grid)
    this.right_edge = this.x + X_VALUE
    this.y=Y_VALUE/2 + (Y_VALUE * this.y_grid)+20
}


var allEnemies = []
var gems = []
var enemyCount = 4
for (i = 0; i < enemyCount; i++){
    allEnemies.push(new Enemy())
}
var player = new Player(allEnemies);


document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
