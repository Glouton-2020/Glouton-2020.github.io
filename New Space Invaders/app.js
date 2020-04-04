
//
// VECTOR2D OBJECT
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

    this.dropTarget = 0;
    this.dropAmount = 1;
    this.timer = 0;
    this.firePercent = 4;
    this.fireWait = Math.random() * 3;
}
Enemy.prototype = Object.create(Entity.prototype);

Enemy.prototype.update = function (dt) { 

    //EDGE COLLISION
    var enemiesLeft = game.enemiesRect().left(),
        enemiesRight = game.enemiesRect().right(),
        edgeMargin = 5,
        gameLeftEdge = game.gameFieldRect().left() + edgeMargin, 
        gameRightEdge = game.gameFieldRect().right() - edgeMargin;

    Entity.prototype.update.call(this, dt);

    // Drop if the enemiesRect hits an edge margin
    if (( this.direction.x < 0 && enemiesLeft < gameLeftEdge) || 
        (this.direction.x > 0 && enemiesRight > gameRightEdge) ) {
            this.dropTarget += this.dropAmount;
        }

    // Determine Direction 
    if (this.position.y < this.dropTarget) {
        this.direction = new Vector2d(0, 1);
    }
    else if (this.direction.y > 0) {
        this.direction = (enemiesRight > gameRightEdge) ?
                                        new Vector2d( -1, 0) :
                                        new Vector2d(1, 0);
    }

    // Determine Firing Weapon

    var p = vectorAdd(this.position, new Vector2d(0, 5));

    function existsUnderneath(e) {
        var rect = e.collisionRect();
        return p.y <= rect.top() &&
                        rect.left() <= p.x && p.x <= rect.right();
    }

    this.timer += dt;
    if (this.timer > this.fireWait) {
        this.timer = 0;
        this.fireWait = 1 + Math.random() * 4;;

        if (randomInt(100) < this.firePercent &&
            !game.enemies().find(existsUnderneath) ) {
                this.fire(p);
            }
        }
};

    Enemy.prototype.fire = function (position) {
        game.addEntity (new Projectile ( position, 
                                        60,
                                        new Vector2d(0, 1),
                                        "enemy" ));
    };


//Player Object
// Needs to be able to perform 3 actions: move left, move right and fire. 
/////////////////

function Player(position, speed, direction) {
    Entity.call(this, position, speed, direction);

    this.width = 20;
    this.height = 10;

    this.movingLeft = false;
    this.movingRight = false; 
}

Player.prototype = Object.create(Entity.prototype);

Player.prototype.updateDirection = function () {
    var direction = new Vector2d(0, 0);
    if (this.movingLeft) {
        direction = vectorAdd (direction, new Vector2d(-1, 0) );
    }
    if (this.movingRight) {
        direction = vectorAdd (direction, new Vector2d(1, 0) );
    }
    this.direction = direction;
};

Player.prototype.moveRight = function (enable) {
    this.movingRight = enable;
    this.updateDirection();
};
Player.prototype.moveLeft = function (enable) {
    this.movingLeft = enable;
    this.updateDirection();
};

Player.prototype.fire = function () {
    function isPlayerType(proj) {
        return (proj.type === "player");
    }
    var playerProjectileCount =
game.projectiles().filter(isPlayerType).length;
    if (playerProjectileCount === 0) {
        game.addEntity (new Projectile (this.position, 
                                        180,
                                        new Vector2d(0, -1),
                                        "player" ));
    }
};

Player.prototype.update = function (dt) {
    Entity.prototype.update.call(this, dt);
};

//PROJECTILE
/////////////

function Projectile(position, speed, direction, type) {
    Entity.call (this, position, speed, direction);

    this.width = 1;
    this.height = 5;
    this.type = type;
}
Projectile.prototype = Object.create(Entity.prototype);


// // Explosion Object
// ////////////////////

// function Explosion(position, speed, direction, rank, duration) {
//     Entity.call (this, position, speed, direction);

//     this.width = 13;
//     this.height = 10; 

//     this.rank = rank; 
//     this.duration = duration;
// }

// Explosion.prototype = Object.create(Entity.prototype);

// Explosion.prototype.update = function (dt) {
//     Entity.prototype.update.call(this, dt);

//     if (this.time > this.duration) {
//         this.hp = 0;
//     }
// };

// // Player Explosion 
// ///////////////////

// function PlayerExplosion(position, duration) {
//     Entity.call(this, position, 0, new Vector2d(0, 0));

//     this.width = 20;
//     this.height = 10;
//     this.duration = duration;
// }
// PlayerExplosion.prototype = Object.create(Entity.prototype);

// PlayerExplosion.prototype.update = function (dt) {
//     Entity.prototype.update.call(this, dt);
//     if (this.time > this.duration) {
//         this.hp = 0;
//     }
// }

// Renderer Object
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
        _projectileColors = {"player": "rgb(196, 208, 106)",
                            "enemy": "rgb(96, 195, 96)"};

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
        else if(entity instanceof Projectile) {
            _drawRectangle(_projectileColors[entity.type], entity);
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
        var i, j,
            entities = game.entities(),
            enemies = game.enemies(),
            projectiles = game.projectiles(),
            player = game.player();

        for( i = entities.length -1; i >= 0; i-- ) {
            var e = entities[i];
            velocity = vectorScalarMultiply( e.direction, e.speed);
            e.position = vectorAdd (e.position, vectorScalarMultiply(velocity, dt) );
        }

        // COLLISION DETECTION
        var collisionPairs = [];

        // Enemies vs Player
        for ( i = enemies.length-1; i > 0; i-- ) {
            collisionPairs.push( {entity0: enemies[i],
                                entity1: player } );
        }

        //Projectiles vs other Entities
        for ( i = projectiles.length-1; i >= 0; i-- ) {

            //Enemy Projectiles vs Player
            if ( projectiles[i].type === "enemy") {
                collisionPairs.push ( { entity0: projectiles[i],
                                        entity1: player } );
            }
            //Player Projectiles vs Enemies
            if ( projectiles[i].type === "player") {
                for ( j=enemies.length-1; j >= 0; j-- ) {
                    collisionPairs.push ( {entity0: projectiles[i],
                                            entity1: enemies[j] } );
                }
            }
        }

        // Collision Check
        for ( i = collisionPairs.length-1; i >= 0; i-- ) {
            var e0 = collisionPairs[i].entity0;
            var e1 = collisionPairs[i].entity1;

            if ( e0 && e1 && e0.collisionRect().intersects(e1.collisionRect() ) ) {
                //Resolve Collision
                e0.hp -= 1;
                e1.hp -= 1;
            }
        }

        // Enemy vs floor (special case)
        if (game.enemiesRect() && player && 
            game.enemiesRect().bottom() > player.collisionRect().bottom() ) {
            game.setGameOver();
            }

            // Projectile leaves Game field (special case)
            for ( i = projectiles.length-1; i >= 0; i-- ) {
                var proj = projectiles[i];
                if ( !game.gameFieldRect().intersects(proj.collisionRect()) ) {
                    proj.hp -= 1;
                }
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
        _started = false,
        _lastFrameTime, 
        _enemiesRect, 
        _enemySpeed, 
        _enemyFirePercent, 
        _enemyDropAmount,
        _projectiles,
        _livesRemaining, 
        _gameOver, 
        _score, 
        _highScores;

        //Initializes Game
    function _start() {
        _lastFrameTime = 0;

        _entities = [];
        _enemies = [];
        _gameFieldRect = new Rectangle(0, 0, 300, 180);
        _enemiesRect = new Rectangle(0, 0, 0, 0);
        _enemySpeed = 10;
        _enemyFirePercent = 10;
        _enemyDropAmount = 1;
        _projectiles = [];
        _livesRemaining = 2;
        _gameOver = false;
        _score = 0;
        _highScores = [];

        //High scores are stored in local storage if available. 
        // Saves the score between page loads. If score doesn't exist or corrupted an empty high score array is created.
        if (typeof(Storage) !== "undefined") {
            try {
                _highScores = JSON.parse(localStorage.invadersScores);
            }
            catch(e) {
                _highScores = [];
            }
        }

        this.addEntity(new Player (new Vector2d(100, 175), 90, new Vector2d(0, 0)) );

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
        if (entity instanceof Projectile) {
            _projectiles.push(entity);
        }
    }

    function _removeEntities(entities) {
        if (!entities) return;

        function isNotInEntities(item) { return !entities.includes(item); }
        _entities = _entities.filter(isNotInEntities);
        _enemies = _enemies.filter(isNotInEntities);
        _projectiles = _projectiles.filter(isNotInEntities);

        if(entities.includes(_player)) {
            _player = undefined;
        }
    }

    function _update( time ) {
        var i, j;
            dt = Math.min( (time - _lastFrameTime) / 1000, 3/60);

            _lastFrameTime = time; 

            if (_gameOver) {
                _started = false;
                return;
            }

        //Update Physics
        physics.update(dt);

        // Calculates the bounding rectangle around the enemies
        _enemiesRect = _enemies.reduce( function(rect, e) {
                return rectUnion(rect, e.collisionRect());
            }, 
            undefined);
        
        // Update Entities
        for (i=_entities.length-1; i >= 0; i-- ) {
            _entities[i].update(dt);
        }

        // Remove Hit Enemy Objects
        var removeEntities =[];
        for (i=_entities.length-1; i >= 0; i-- ) {
            var e = _entities[i];
            if ( e.hp <= 0 ) {
                removeEntities.push(e);

                if ( e instanceof Enemy ) {
                    _score += e.rank + 1;
                }

                else if ( e instanceof Player ) {
                    _livesRemaining--;
                    this.addEntity( new Player( new Vector2d(100, 175), 90, new Vector2d(0, 0) ));
                }
            }
        }
        _removeEntities(removeEntities);

        // Update Enemy Speed
        var speed = _enemySpeed + (_enemySpeed * (1-(_enemies.length/50)));
        for (i=_enemies.length-1; i >= 0; i-- ) {
            _enemies[i].speed = speed;
        }

        // Creates new Enemies if there are 0
        if (_enemies.length === 0) {
            for (i = 0; i < 10; i++) {
                for (j=0; j < 5; j++) {
                    var dropTarget = 10+j*20,
                        position = new Vector2d(50+i*20, dropTarget-100),
                        direction = new Vector2d(1, 0), 
                        rank = 4-j, 
                        enemy = new Enemy(position, 
                                        _enemySpeed,
                                        direction, 
                                        rank);
                                        
                    enemy.dropTarget = dropTarget;
                    enemy.firePercent = _enemyFirePercent;
                    enemy.dropAmount = _enemyDropAmount;

                    this.addEntity (enemy);
                }
            }

            _enemySpeed += 8;
            _enemyFirePercent += 8;
            _enemyDropAmount += 3;
        }

        //Check for Game Over 
        if (_livesRemaining < 0 && !_gameOver) {
            _setGameOver();
        }

            // Render the frame 
        renderer.render(dt);

        window.requestAnimationFrame(this.update.bind(this));
    }

    function _addScore(score) {
        _highScores.push(score);
        _highScores.sort(function(a, b) {return b-a});
        _highScores = _highScores.slice(0, 10); // top 10 Scores are saved

        if (typeof(Storage) !== "undefined") {
            localStorage.invadersScores = JSON.stringify(_highScores);
        }
    }

    // Function that sets the _gameOver variable and records the current score
    function _setGameOver() {
        _gameOver = true;
        _addScore(Math.round(game.score()));
    }

    return {
        start: _start,
        update: _update,
        addEntity: _addEntity, 
        entities: function() {return _entities; },
        enemies: function() {return _enemies; },
        player: function() {return _player; },
        gameFieldRect: function() {return _gameFieldRect; },
        enemiesRect: function() {return _enemiesRect; },
        projectiles: function() {return _projectiles; },
        score: function() {return _score; },
        highScores: function() {return _highScores; },
        livesRemaining: function() {return _livesRemaining; },
        gameOver: function() {return _gameOver; },
        setGameOver: _setGameOver
    };
})();


//PLAYER ACTIONS
// This object is responsible for executing commands on the Player Object. 
// Actions are identified by the strings: "moveLeft", "moveRight", and 'fire'. 
// Every input event has a unique identifier, Keyboard events have the keycode of the key pressed. 
/////////////////

var playerActions = (function () {
    var _ongoingActions = []; //An array of currently active playerActions

    function _startAction(id, playerAction) { //starts the playerAction id and store it in ongoingActions
        if (playerAction === undefined) {
            return;
        }

        var f, 
            acts = {"moveLeft": function() { if(game.player()) game.player().moveLeft(true); },
                    "moveRight": function() { if(game.player()) game.player().moveRight(true); },
                    "fire": function() {if(game.player()) game.player().fire(); } };

                if (f = acts[playerAction]) f(); 
                
            _ongoingActions.push( {identifier:id, playerAction:playerAction} );
            }

        function _endAction(id) { //stops the action with id and removes it from ongoingActions
            var f, 
            acts = {"moveLeft": function() { if(game.player()) game.player().moveLeft(false); }, 
                    "moveRight": function() { if(game.player()) game.player().moveRight(false); } };

            var idx = _ongoingActions.findIndex(function(a) { return a.identifier === id; });

            if (idx >= 0) {
                if(f = acts[_ongoingActions[idx].playerAction]) f();
                _ongoingActions.splice(idx, 1); // remove action at idx
            }
        }
        return {
            startAction: _startAction, 
            endAction: _endAction
        };
    })();

// KEYBOARD INPUT
/////////////////

var keybinds = {    32: "fire",
                    37: "moveLeft",
                    39: "moveRight" 
                };

        function keyDown(e) {
            var  x = e.which || e.keyCode; 

            if (keybinds[x] !== undefined ) {
                e.preventDefault();
                playerActions.startAction(x, keybinds[x]); 
            }
        }

        function keyUp(e) {
            var x = e.which || e.keyCode;

            if( keybinds[x] !== undefined ) {
                e.preventDefault();
                playerActions.endAction(x);
            }
        }
    
    document.body.addEventListener('keydown', keyDown);
    document.body.addEventListener('keyup', keyUp);