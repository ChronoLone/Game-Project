const canvas = document.querySelector('#canvas-game');
const context = canvas.getContext("2d");
document.body.style.overflow = 'hidden';

canvas.width = 640;
canvas.height = 480;

context.fillStyle = 'white';
context.fillRect(0, 0, canvas.width, canvas.height);
context.imageSmoothingEnabled = false;                       //renders pixel correctly (unblur pixels for small image)

//Images
const world1_image = new Image();
world1_image.src = "./images/tiles/World 1/World 1.png";
const world1_foregroundImage = new Image();
world1_foregroundImage.src = "./images/tiles/World 1/World 1 ForegroundObj.png";
const world2_image = new Image();
world2_image.src = "./images/tiles/World 2/World 2.png";
const world2_foregroundImage = new Image();
world2_foregroundImage.src = "./images/tiles/World 2/World 2 ForegroundObj.png";

const playerDownImage = new Image();
playerDownImage.src = "./images/boyWalkingDown.png";
const playerRightImage = new Image();
playerRightImage.src = "./images/boyWalkingRight.png";
const playerLeftImage = new Image();
playerLeftImage.src = "./images/boyWalkingLeft.png";
const playerUpImage = new Image();
playerUpImage.src = "./images/boyWalkingUp.png";

//Map and gameplay
let collisionMap;
let boundaries;
let triggerMap;
let triggers;
let offset;

let player = new Sprite({
    position: {
        x: 200,
        y: 200
    },
    image: playerDownImage,
    frames: {
        max: 4
    },
    scale: {
        max: 5
    },
    sprites: {
        up: playerUpImage,
        down: playerDownImage,
        left: playerLeftImage,
        right: playerRightImage
    }
});
let background;
let foreground;

//Player spawn
backgroundPosition = {
    x: -900,
    y: -1200
};
//Initial spawn coordinates (world 1)

let pendingWorld = null;
let transitioning = false;
let movables = [];
let world = 1;
let worldNext;
let worlds = {
    1: {
        init: () => {
            worldNext = 2;

            collisionMap = [];
            boundaries = [];
            for (let i = 0; i < collisions_1.length; i += 70) {
                collisionMap.push(collisions_1.slice(i, 70 + i));
            };

            triggerMap = [];
            triggers = [];
            for (let i = 0; i < trigger12.length; i += 70) {
                triggerMap.push(trigger12.slice(i, 70 + i));
            };

            offset = {
                x: -900,
                y: -1200
            };

            collisionMap.forEach((row, i) => {
                row.forEach((symbol, j) => {
                    if (symbol === 229) {
                        boundaries.push(new Boundary({
                            position: {
                                x: j * Boundary.width + offset.x,
                                y: i * Boundary.height + offset.y
                            }
                        }));
                    };
                });
            });

            triggerMap.forEach((row, i) => {
                row.forEach((symbol, j) => {
                    if (symbol === 260) {
                        triggers.push(new Trigger({
                            position: {
                                x: j * Trigger.width + offset.x,
                                y: i * Trigger.height + offset.y,
                            }
                        }));
                    };
                });
            });

            background = new Sprite({
                position : {
                    x: backgroundPosition.x,
                    y: backgroundPosition.y
                },
                image: world1_image
            });
            
            foreground = new Sprite({
                position : {
                    x: backgroundPosition.x,
                    y: backgroundPosition.y
                },
                image: world1_foregroundImage
            });
        }
    },
    2: {
        init: () => {
            worldNext = 1;

            collisionMap = [];
            boundaries = [];
            for (let i = 0; i < collisions_2.length; i += 70) {
                collisionMap.push(collisions_2.slice(i, 70 + i));
            };

            triggerMap = [];
            triggers = [];
            for (let i = 0; i < trigger21.length; i += 70) {
                triggerMap.push(trigger21.slice(i, 70 + i));
            };

            offset = {
                x: -1500,
                y: -600
            };

            collisionMap.forEach((row, i) => {
                row.forEach((symbol, j) => {
                    if (symbol === 355) {
                        boundaries.push(new Boundary({
                            position: {
                                x: j * Boundary.width + offset.x,
                                y: i * Boundary.height + offset.y
                            }
                        }));
                    }
                });
            });

            triggerMap.forEach((row, i) => {
                row.forEach((symbol, j) => {
                    if (symbol === 386) {
                        triggers.push(new Trigger({
                            position: {
                                x: j * Trigger.width + offset.x,
                                y: i * Trigger.height + offset.y,
                            }
                        }));
                    };
                });
            });
            
            background = new Sprite({
                position : {
                    x: -1500,
                    y: -600
                },
                image: world2_image
            });

            foreground = new Sprite({
                position : {
                    x: -1500,
                    y: -600
                },
                image: world2_foregroundImage
            });
        }
    }
};

//Movement and Boundary collisions
const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
};

/*const testBoundary = new Boundary({
    position: {
        x: 200,
        y: 200
    }
});*/



function objectCollision({object1, object2}) {
    return (
        object1.position.x + object1.width >= object2.position.x && 
        object1.position.x <= object2.position.x + object2.width &&
        object1.position.y <= object2.position.y + object2.height &&
        object1.position.y + object1.height >= object2.position.y
    )
};

function animate() {
    window.requestAnimationFrame(animate);

    if (pendingWorld !== null) {
        world = pendingWorld;
        pendingWorld = null;

        worlds[world].init();
        updateMovables();

        transitioning = false;
    }

    background.draw();
    boundaries.forEach((boundary) => {
        boundary.draw();
    });
    //testBoundary.draw();
    triggers.forEach((trigger) => {
        trigger.draw();
    });
    player.draw();
    foreground.draw();

    let moving = true;
    player.moving = false;
    if (keys.w.pressed && lastKey === 'w') {
        player.moving = true;
        player.image = player.sprites.up;
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (
                objectCollision({
                    object1: player,
                    object2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x,
                            y: boundary.position.y + 3 //detect whether it will collide up in the future
                        }
                    }
                })
            ) {
                moving = false;
                break
            };
        };

        for (let i = 0; i < triggers.length; i++) {
            const trigger = triggers[i];
            if (
                objectCollision({
                    object1: player,
                    object2: {
                        ...trigger,
                        position: {
                            x: trigger.position.x,
                            y: trigger.position.y + 3
                        }
                    }
                }) && !transitioning
            ) {
                transitioning = true;
                       
                // allow movement again next frame
                setTimeout(() => {
                    transitioning = true;
                    pendingWorld = worldNext;
                }, 0);
            };
        };
        
        if (moving) {
            movables.forEach(movable => {movable.position.y += 3});
        }
    } else if (keys.a.pressed && lastKey === 'a') {
        player.moving = true;
        player.image = player.sprites.left;
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (
                objectCollision({
                    object1: player,
                    object2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x + 3,
                            y: boundary.position.y
                        }
                    }
                })
            ) {
                moving = false;
                break
            };
        };

        for (let i = 0; i < triggers.length; i++) {
            const trigger = triggers[i];
            if (
                objectCollision({
                    object1: player,
                    object2: {
                        ...trigger,
                        position: {
                            x: trigger.position.x,
                            y: trigger.position.y + 3
                        }
                    }
                }) && !transitioning
            ) {
                transitioning = true;
                pendingWorld = worldNext;
            };
        };

        if (moving) {
            movables.forEach(movable => {movable.position.x += 3});
        };    
    } else if (keys.s.pressed && lastKey === 's') {
        player.moving = true;
        player.image = player.sprites.down;
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (
                objectCollision({
                    object1: player,
                    object2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x,
                            y: boundary.position.y - 3
                        }
                    }
                })
            ) {
                moving = false;
                break
            };
        };

        for (let i = 0; i < triggers.length; i++) {
            const trigger = triggers[i];
            if (
                objectCollision({
                    object1: player,
                    object2: {
                        ...trigger,
                        position: {
                            x: trigger.position.x,
                            y: trigger.position.y + 3
                        }
                    }
                }) && !transitioning
            ) {
                transitioning = true;
                pendingWorld = worldNext;
            };
        };
        
        if (moving) {
            movables.forEach(movable => {movable.position.y -= 3});
        };
    } else if (keys.d.pressed && lastKey === 'd') {
        player.moving = true;
        player.image = player.sprites.right;
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (
                objectCollision({
                    object1: player,
                    object2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x - 3,
                            y: boundary.position.y
                        }
                    }
                })
            ) {
                moving = false;
                break
            };
        };

        for (let i = 0; i < triggers.length; i++) {
            const trigger = triggers[i];
            if (
                objectCollision({
                    object1: player,
                    object2: {
                        ...trigger,
                        position: {
                            x: trigger.position.x,
                            y: trigger.position.y + 3
                        }
                    }
                }) && !transitioning
            ) {
                transitioning = true;
                pendingWorld = worldNext;
            };
        };

        if (moving) {
           movables.forEach(movable => {movable.position.x -= 3}); 
        }
    }
};

function updateMovables() {
    movables.length = 0;
    movables.push(background, foreground, ...boundaries, ...triggers);
}

worlds[world].init();
updateMovables();
animate();

let lastKey = '';
window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'w':
            keys.w.pressed = true;
            lastKey = 'w';
            break;
        case 'a':
            keys.a.pressed = true;
            lastKey = 'a';
            break;
        case 's':
            keys.s.pressed = true;
            lastKey = 's';
            break;
        case 'd':
            keys.d.pressed = true;
            lastKey = 'd';
            break;
    };
});

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'w':
            keys.w.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 's':
            keys.s.pressed = false;
            break;
        case 'd':
            keys.d.pressed = false;
            break;
    };
});
