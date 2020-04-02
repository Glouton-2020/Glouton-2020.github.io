
//
// Vector2d Object
///// Vectors will be used for the movement and position of game entities.

var Vector2d = function (x, y) {
    this.x = x;
    this.y = y;
};

// adds vectors v1 & v2 together
function vectorAdd(v1, v2) {
    return new Vector2d(v1.x + v2.x, v1.y + v2.y);
}

// subtract vector v2 from v1
function vectorSubtract(v1, v2) {
    return new Vector2d(v1.x - v2.x, v1.y - v2.y);
}

// multiplies the components of v1 by the scalar number s
function vectorScalarMultiply(v1, s) {
    return new Vector2d(v1.x * s, v1.y * s);
}

// returns the length of vector v
function vectorLength(v) {
    return Math.sqrt(v.x * v.x + v.y * v.y);
}

// returns a normalized vector v (a vector with length == 1)
function vectorNormalize(v) {
    var reciprocal = 1.0 / (vectorLength(v) + 1.0e-037); // Prevent division by zero
    return vectorScalarMultiply(v, reciprocal);
}

// Rectangle
// Rectangles will be used to check for collisions between entities as well as defining the boundary of the game area. 
// It will also keep track of the size of the entire group of enemies to make them move as a group. 

//Rectangle Object
////////////////////
function Rectangle (x, y, width, height) {
    this.x = x;
    this.y = y;
    this. width = width;
    this. height = height;
}
// Returns the left edge
Rectangle.prototype.left = function () {
    return this.x;
};
// Returns the right edge
Rectangle.prototype.right = function () {
    return this.x + this.width;
};
// Returns the top edge 
Rectangle.prototype.top = function () {
    return this.y;
};
// Returns the bottom edge
Rectangle.prototype.bottom = function () {
    return this.y + this.height;
};
// Returns true if the rectangle r2 intersects with this rectangle
Rectangle.prototype.intersects = function (r2) {
    return this.right() >= r2.left() && this.left() <= r2.right() &&
        this.top() <= r2.bottom() && this.bottom() >= r2.top();
};
// Returns a rectangle that contains both rectangles r1 and r2
function rectUnion (r1, r2) {
    var x, y, width, height;

    if (r1 === undefined) {
        return r2;
    }
    if (r2 === undefined) {
        return r1;
    }

    x = Math.min (r1.x, r2.x);
    y = Math.min(r1.y, r2.y);
    width = Math.max(r1.right(), r2.right() ) - Math.min(r1.left(), r2.left()
    );
    height = Math.max(r1.bottom(), r2.bottom() ) - Math.min(r1.top(), r2.top()
    );

    return new Rectangle(x, y, width, height);
}

// Random Number Function
////////////////////////////
//Returns an integer in the range 0 - max
function randomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

//Entity root class
/////////
// Entity Object
///////////////////

function Entity(position, speed, direction) {
    this.position = position; // position of the center of the entity
    this.speed = speed; //speed of motion
    this.direction = direction; //direction of motion 
    this.time = 0;  // system time in seconds
    this.width = 5; //width of the entity
    this.height = 5; //height of the entity
    this.hp = 1; // hit points
}
// dt (delta time) is the time difference since the last frame
Entity.prototype.update = function (dt) {
    this.time += dt;
};
//collision rectangle centered at position
Entity.prototype.collisionRect = function () {
    return new Rectangle (this.position.x - this.width/2, 
                            this.position.y - this.height/2,
                            this.width, 
                            this.height);
};

//Enemy Object
///////////////

function Enemy(position, speed, direction, rank) {
    Entity.call(this, position, speed, direction);

    this.width = 13;
    this.height = 10;
    this.rank = rank;
}
Enemy.prototype = Object.create(Entity.prototype);

Enemy.prototype.update = function (dt) {
    Entity.prototype.update.call(this, dt);
    if (this.collisionRect().top() <= 0 ||
        this.collisionRect().bottom() >=
    game.gameFieldrect().bottom() ) {
        this.direction.y *= -1;
    }
};

//Player Object
/////////////////

function Player(position, speed, direction) {
    Entity.call(this, position, speed, direction);

    this.width = 20;
    this.height = 10;
}

Player.prototype = Object.create(Entity.prototype);

Player.prototype.update = function (dt) {
    Entity.prototype.update.call(this, dt);
    if (this.collisionRect().top() <= 0 ||
        this.collisionRect().bottom() >= 
    game.gameFieldRect().bottom() ) {
        this.direction.y *= -1;
    }
};