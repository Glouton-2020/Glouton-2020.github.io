
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
        this.collisionRect().bottom() >= game.gameFieldRect().bottom() ) {
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
        this.collisionRect().bottom() >= game.gameFieldRect().bottom() ) {
        this.direction.y *= -1;
    }
};

// Render Object
// Enemy rank will be shown by changing colors.
//////////////////

var renderer = (function () {
    // Drawing canvas from the DOM
    var _canvas = document.getElementById("game-layer"), 
        _context = _canvas.getContext("2d"),
        //Array of colors corresponding to th enemy ranks
        _enemyColors = ["rgb(150, 7, 7)",
                        "rgb(150, 89, 7)",
                        "rgb(56, 150, 7)",
                        "rgb(7, 150, 122)",
                        "rgb(46, 7, 150)"];

    function _drawRectangle(color, entity) {
        _context.fillStyle = color;
        _context.fillRect(entity.position.x-entity.width/2, 
                            entity.position.y-entity.height/2,
                            entity.width,
                            entity.height);
    }
    // renders the scene
    function _render(dt) {
        _context.fillStyle = "black";
        _context.fillRect(0, 0, _canvas.width, _canvas.height);

    var i, 
        entity, 
        entities = game.entities();

    for( i = entities.length-1; i >= 0; i-- ) {
        entity = entities[i];

        if (entity instanceof Enemy) {
            _drawRectangle(_enemyColors[entity.rank], entity);
        }
        else if(entity instanceof Player) {
            _drawRectangle("rgb(255, 255, 0)", entity);
        }
    }
}
    return {
        render: _render
    };
})();

// Physics Object 
// Collision detection will go here. This will work in play with the Vector Math
/////////////////

var physics = (function () {

    function _update(dt) {
        var i, 
            e,
            velocity, 
            entities = game.entities();

        for( i = entities.length -1; i >= 0; i-- ) {
            e = entities[i];
            velocity = vectorScalarMultiply( e.direction, e.speed
                );
            e.position = vectorAdd (e.position, vectorScalarMultiply(velocity, dt) 
            );
        }
    }
        return {
            update: _update
        };
})();

// Game Object
/////////////////

var game = (function () {
    var _entities,
        _enemies, 
        _player, 
        _gameFieldRect, 
        _started = false; 

    function _start() {
        _entities = [];
        _enemies = [];
        _gameFieldRect = new Rectangle(0, 0, 300, 180);

        this.addEntity(new Player (new Vector2d(100, 175), 25, new Vector2d(0, -1)));
        this.addEntity(new Enemy (new Vector2d(20, 25), 20, new Vector2d(0, 1), 0));
        this.addEntity(new Enemy (new Vector2d(50, 25), 10, new Vector2d(0, 1), 1));
        this.addEntity(new Enemy (new Vector2d(80, 25), 15, new Vector2d(0, 1), 2));
        this.addEntity(new Enemy (new Vector2d(120, 25), 25, new Vector2d(0, 1), 3));
        this.addEntity(new Enemy (new Vector2d(140, 25), 30, new Vector2d(0, 1), 4));

        if (!_started) {
            window.requestAnimationFrame(this.update.bind(this));
            _started = true;
        }
    }

    function _addEntity(entity) {
        _entities.push(entity);

        if (entity instanceof Player) {
            _player = entity;
        }
        if (entity instanceof Enemy) {
            _enemies.push(entity);
        }
    }

    function _removeEntities(entities) {
        if (!entities) return;

        function isNotInEntities(item) { return !entities.includes(item); }
        _entities = _entities.filter(isNotInEntities);
        _enemies = _enemies.filter(isNotInEntities);

        if(entities.includes(_player)) {
            _player = undefined;
        }
    }

    function _update() {
        var dt =  1/60; // Fixed 60 frames per second time step
        physics.update(dt);

        var i;
        for (i=_entities.length -1; i >= 0; i--) {
            _entities[i].update(dt);
        }

        renderer.render(dt);

        window.requestAnimationFrame(this.update.bind(this));
    }
    return {
        start: _start,
        update: _update,
        addEntity: _addEntity, 
        entities: function() {return _entities; },
        enemies: function() {return _enemies; },
        player: function() {return _player; },
        gameFieldRect: function() {return _gameFieldRect; }
    };
})();
