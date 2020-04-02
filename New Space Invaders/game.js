// console.log('Abra Kadabra Alakazam')
//BASIC GAME ENGINE BUILD TEST

// var canvas = document.getElementById("game-layer");
// var context = canvas.getContext("2d");

// Game Entities
/////////////////
//Player Object
/////////////////
function Player(x, y) {
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 20;
    this.direction = -1;
}

Player.prototype.update = function () {
    if ( this.y <= 0 || this.y+this.height >= game.gameFieldHeight() ) {
        this.direction *= -1;
    }
};

//Enemy Object
///////////////////
function Enemy(x, y) {
    this.x = x;
    this.y = y;
    this.width = 10;
    this.height = 10;
    this.direction = 1;
}

Enemy.prototype.update = function () {
    if ( this.y <= 0 || this.y+this.height >= game.gameFieldHeight() ) {
        this.direction *= -1;
    }
};

//Renderer Object
//////////////////

var renderer = (function () {

    function _drawEnemy(context, enemy) {
        context.fillStyle = "red";
        context.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    }

    function _drawPlayer(context, player) {
        context.fillStyle = "blue";
        context.fillRect(player.x, player.y, player.width, player.height);
    }

    function _render() {
        var canvas = document.getElementById("game-layer");
        var context = canvas.getContext("2d");

        context.fillStyle = "gray";
        context.fillRect(0, 0, canvas.width, canvas.height);

        var i, 
            entity, 
            entities = game.entities();

        for (i=0; i < entities.length; i++) {
            entity = entities[i];

            if (entity instanceof Enemy) {
                _drawEnemy(context, entity);
            }
            else if (entity instanceof Player) {
                _drawPlayer(context, entity);
            }
        }
    }
    // Rendering gets the game entities from the game object and draws based on the type of entity. 
    return {
        render: _render
    };
})();

// Physics Object > gets the game entities from the game object and applies the motion. 
//////////////////

var physics = (function () {
    function _update() {
        var i, 
        entities = game.entities();

        for (i = 0; i < entities.length; i++) {
            entities[i].y += entities[i].direction;
        }
    }
    return {
        update:_update
    };
})(); 

//Game Object > Game Object brings it all together, Owner of all other objects and where the game loop is processed. When updated you can add things like score check and the logic. 

var game = (function () {
    var _gameFieldHeight = 200;
    var _entities = [];

    function _start() {
        _entities.push(new Player(100, 175));
        _entities.push(new Enemy(20, 25));
        _entities.push(new Enemy(80, 25));
        _entities.push(new Enemy(160, 25));

window.requestAnimationFrame(this.update.bind(this));
    }

    function _update() {
        physics.update();

        var i;
        for( i = 0; i < _entities.length; i++) {
            _entities[i].update();
        }
        renderer.render();

window.requestAnimationFrame(this.update.bind(this));
    }

    return {
        start: _start,
        update: _update,
        entities: function () { return _entities; },
        gameFieldHeight: function () { return _gameFieldHeight; }
        };

})();

game.start();



// var player = new Player(100, 175);
// var enemy1 = new Enemy(20, 25);
// var enemy2 = new Enemy(80, 25);
// var enemy3 = new Enemy(160, 25);

// function frameUpdate() {
//     canvas = document.getElementById("game-layer");
//     context = canvas.getContext("2d");

// context.fillStyle = "gray";
// context.fillRect(0, 0, canvas.width, canvas.height);

// player.update();
// player.draw();

// enemy1.update();
// enemy1.draw();

// enemy2.update();
// enemy2.draw();

// enemy3.update();
// enemy3.draw();

//     window.requestAnimationFrame(frameUpdate);
// }

// frameUpdate();