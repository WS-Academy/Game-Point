const canvas  = document.getElementById('gameCanvas')
const c = canvas.getContext('2d')
const scoreC = document.getElementById('scoreC')
const startDiv = document.getElementById('start')
const gameOverDiv = document.getElementById('game-over')
let score = 0;


canvas.width = innerWidth
canvas.height = innerHeight
function startGame() {
    score = 0;
    startDiv.style.display = "none";
    gameOverDiv.style.display = "none";
    canvas.style.display = "block";
    animation();
}

function gameOver() {
    gameOverDiv.style.display = "block";
    canvas.style.display = "none";
    finalScore.innerHTML = score;


}

function restartGame() {
    location.reload()
    startGame();
}
class Boundary
{
    static width = 40
    static height = 40
    constructor({ position, image })
    {
        this.position = position
        this.width = 40
        this.height = 40
        this.image = image
    }
    draw()
    {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

class Pacman
{
    constructor({position, velocity}) 
    {
        this.position = position;
        this.velocity = velocity;
        this.radius = 12;
        this.radians = 0.75
        this.openRate = .03
    }

    draw()
    {
        c.beginPath()
        c.arc(this.position.x, this.position.y,
             this.radius, this.radians, Math.PI * 2 - this.radians)
        c.lineTo(this.position.x, this.position.y)
        c.fillStyle = 'yellow'
        c.fill()
        c.closePath();
    }

    update()
    {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        
        if(this.radians < 0 || this.radians > 0.75) 
        this.openRate = -this.openRate
        this.radians += this.openRate

    }


}

class Ghost
{
    static speed = 2
    constructor({position, velocity, color = 'red', image}) 
    {
        this.position = position;
        this.velocity = velocity;
        this.radius = 13
        this.color = color
        this.pervCollisions = []
        this.speed = 2
        this.image = image
    }

    draw()
    {
        c.drawImage(this.image, this.position.x - 12, this.position.y -12)
    }

    update()
    {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Pellet
{
    constructor({position}) 
    {
        this.position = position;
        this.radius = 3;
    }

    draw()
    {
        c.beginPath()
        c.arc(this.position.x, this.position.y,
             this.radius, 0, Math.PI * 2)
        c.fillStyle = 'white'
        c.fill()
        c.closePath();
    }
}

const pellets = []
const boundaries = []
const ghosts = [
    new Ghost({
        position:
        {
            x: Boundary.width * 6+ Boundary.width/2,
            y: Boundary.height + Boundary.height/2
        },
        velocity:
        {
            x: Ghost.speed,
            y: 0
        },
        image: createImage('./img/greenG.png')
    }),
    new Ghost({
        position:
        {
            x: Boundary.width * 6+ Boundary.width/2,
            y: Boundary.height * 6 + Boundary.height/2
        },
        velocity:
        {
            x: Ghost.speed,
            y: 0
        },
        image: createImage('./img/pinkG.png')
    }),
    new Ghost({
        position:
        {
            x: Boundary.width * 5+ Boundary.width/2,
            y: Boundary.height * 3 + Boundary.height/2
        },
        velocity:
        {
            x: Ghost.speed,
            y: 0
        },
        image: createImage('./img/whiteG.png')
    }),
    new Ghost({
        position:
        {
            x: Boundary.width * 4+ Boundary.width/2,
            y: Boundary.height * 9 + Boundary.height/2
        },
        velocity:
        {
            x: Ghost.speed,
            y: 0
        },
        image: createImage('./img/blueG.png')
    }),
    new Ghost({
        position:
        {
            x: Boundary.width * 2 + Boundary.width/2,
            y: Boundary.height * 8 + Boundary.height/2
        },
        velocity:
        {
            x: Ghost.speed,
            y: 0
        },
        image: createImage('./img/yellowG.png')
    }),
    new Ghost({
        position:
        {
            x: Boundary.width+ Boundary.width/2,
            y: Boundary.height * 8 + Boundary.height/2
        },
        velocity:
        {
            x: Ghost.speed,
            y: 0
        },
        image: createImage('./img/redG.png')
    }),
]
const pacman = new Pacman({
position: 
{
    x: Boundary.width + Boundary.width/2,
    y: Boundary.height + Boundary.height/2
},
velocity: 
{
     x: 0,
     y: 0
}
});

let lastKey = ''

const keys = 
{
    w: { pressed: false },
    a: { pressed: false },
    s: { pressed: false },
    d: { pressed: false }
}

const map = 
[
['1','_','_','_','_','_','_','_','_','_','2',],
['|',' ','.','.','.','.','.','.','.','.','|',],
['|','.','b','.','l','bc','r','.','b','.','|',],
['|','.','.','.','.','d','.','.','.','.','|',],
['|','.','l','r','.','.','.','l','r','.','|',],
['|','.','.','.','.','t','.','.','.','.','|',],
['|','.','b','.','l','c','r','.','b','.','|',],
['|','.','.','.','.','d','.','.','.','.','|',],
['|','.','l','r','.','.','.','l','r','.','|',],
['|','.','.','.','.','t','.','.','.','.','|',],
['|','.','b','.','l','tc','r','.','b','.','|',],
['|','.','.','.','.','.','.','.','.','.','|',],
['4','_','_','_','_','_','_','_','_','_','3',]
]

function createImage(src)
{
    const image = new Image()
    image.src = src
    return image
}

map.forEach((row, i) => {
    row.forEach((symbol, j) => {
        switch (symbol)
        {
            case '_':
            boundaries.push(new Boundary({
                position:
                {
                    x: Boundary.width * j,
                    y: Boundary.height * i
                },
                image: createImage('./img/pipeHorizontal.png')
            }));
            break
            case '|':
                boundaries.push(new Boundary({
                    position:
                    {
                        x: Boundary.width * j,
                        y: Boundary.height * i
                    },
                    image: createImage('./img/pipeVertical.png')
                }));
            break
            case '1':
                boundaries.push(new Boundary({
                    position:
                    {
                        x: Boundary.width * j,
                        y: Boundary.height * i
                    },
                    image: createImage('./img/pipeCorner1.png')
                }));
            break
            case '2':
                boundaries.push(new Boundary({
                    position:
                    {
                        x: Boundary.width * j,
                        y: Boundary.height * i
                    },
                    image: createImage('./img/pipeCorner2.png')
                }));
            break
            case '3':
                boundaries.push(new Boundary({
                    position:
                    {
                        x: Boundary.width * j,
                        y: Boundary.height * i
                    },
                    image: createImage('./img/pipeCorner3.png')
                }));
            break
            case '4':
                boundaries.push(new Boundary({
                    position:
                    {
                        x: Boundary.width * j,
                        y: Boundary.height * i
                    },
                    image: createImage('./img/pipeCorner4.png')
                }));
            break
            case 'b':
                boundaries.push(new Boundary({
                    position:
                    {
                        x: Boundary.width * j,
                        y: Boundary.height * i
                    },
                    image: createImage('./img/block.png')
                }));
            break
            case 't':
                boundaries.push(new Boundary({
                    position:
                    {
                        x: Boundary.width * j,
                        y: Boundary.height * i
                    },
                    image: createImage('./img/capTop.png')
                }));
            break
            case 'd':
                boundaries.push(new Boundary({
                    position:
                    {
                        x: Boundary.width * j,
                        y: Boundary.height * i
                    },
                    image: createImage('./img/capBottom.png')
                }));
            break
            case 'l':
                boundaries.push(new Boundary({
                    position:
                    {
                        x: Boundary.width * j,
                        y: Boundary.height * i
                    },
                    image: createImage('./img/capLeft.png')
                }));
            break
            case 'r':
                boundaries.push(new Boundary({
                    position:
                    {
                        x: Boundary.width * j,
                        y: Boundary.height * i
                    },
                    image: createImage('./img/capRight.png')
                }));
            break
            case 'bc':
                boundaries.push(new Boundary({
                    position:
                    {
                        x: Boundary.width * j,
                        y: Boundary.height * i
                    },
                    image: createImage('./img/pipeConnectorBottom.png')
                }));
            break
            case 'tc':
                boundaries.push(new Boundary({
                    position:
                    {
                        x: Boundary.width * j,
                        y: Boundary.height * i
                    },
                    image: createImage('./img/pipeConnectorTop.png')
                }));
            break
            case 'c':
                boundaries.push(new Boundary({
                    position:
                    {
                        x: Boundary.width * j,
                        y: Boundary.height * i
                    },
                    image: createImage('./img/pipeCross.png')
                }));
            break
            case '.':
                pellets.push(new Pellet({
                    position:
                    {
                        x: Boundary.width * j + Boundary.width / 2,
                        y: Boundary.height * i + Boundary.height / 2
                    },
                }));
            break
        }
    });
});

function circleWithRect( { circle, rectangle }) 
{
    return(
        circle.position.y - circle.radius  + circle.velocity.y <= rectangle.position.y + rectangle.height &&
        circle.position.x + circle.radius + circle.velocity.x>= rectangle.position.x &&
        circle.position.y + circle.radius + circle.velocity.y>= rectangle.position.y &&
        circle.position.x - circle.radius + circle.velocity.x<= rectangle.position.x + rectangle.width
    ) 
}
{

}

let animationId

function animation() {
    animationId = requestAnimationFrame(animation);
    c.clearRect(0, 0, canvas.width, canvas.height);

    if (keys.w.pressed) {
        pacman.velocity.x = 0;
        pacman.velocity.y = -3;
    
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
    
            if (circleWithRect({
                circle: pacman,
                rectangle: boundary
            })) {
                pacman.velocity.y = 0;
                break;
            }
        }
    } else if (keys.a.pressed) {
        pacman.velocity.x = -3;
        pacman.velocity.y = 0;
    
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
    
            if (circleWithRect({
                circle: pacman,
                rectangle: boundary
            })) {
                pacman.velocity.x = 0;
                break;
            }
        }
    } else if (keys.s.pressed) {
        pacman.velocity.x = 0;
        pacman.velocity.y = 3;
    
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
    
            if (circleWithRect({
                circle: pacman,
                rectangle: boundary
            })) {
                pacman.velocity.y = 0;
                break;
            }
        }
    } else if (keys.d.pressed) {
        pacman.velocity.x = 3;
        pacman.velocity.y = 0;
    
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
    
            if (circleWithRect({
                circle: pacman,
                rectangle: boundary
            })) {
                pacman.velocity.x = 0;
                break;
            }
        }
    }
    

    pellets.forEach((pellet, i) => {
        if (Math.hypot(
            pellet.position.x - pacman.position.x,
            pellet.position.y - pacman.position.y)
            < pellet.radius + pacman.radius) 
        {
            pellets.splice(i, 1);
            score += 10
            scoreC.innerHTML = score
        } 
        else 
        {
            pellet.draw();
        }
    });

    boundaries.forEach((boundary)=>{
        boundary.draw()
        if (circleWithRect({
                circle: pacman,
                rectangle: boundary
                })) 
        {
            pacman.velocity.x = 0;
            pacman.velocity.y = 0;
        }
    });
    pacman.update()
    pacman.velocity.x = 0
    pacman.velocity.y = 0
    ghosts.forEach((ghost) => {
        ghost.update();

        //win condition
        // if(pellets.length == 0)
        // {
        //     cancelAnimationFrame(animationId)

        //     this.gameOver()
            
        // }

        if (pellets.length === 0) {
            refillMapWithPellets();
        }

        //lose condition
        if (Math.hypot(
            ghost.position.x - pacman.position.x,
            ghost.position.y - pacman.position.y)
            < ghost.radius + pacman.radius) 
            {
               cancelAnimationFrame(animationId)
               this.gameOver()
            }
        // Check for collisions with boundaries
        const collisions = [];
        boundaries.forEach((boundary) => {
            if (
                !collisions.includes('right') &&
                circleWithRect({
                    circle: { ...ghost, velocity: { x: 3, y: 0 } },
                    rectangle: boundary,
                })
            ) {
                collisions.push('right');
            }
            if (
                !collisions.includes('left') &&
                circleWithRect({
                    circle: { ...ghost, velocity: { x: -3, y: 0 } },
                    rectangle: boundary,
                })
            ) {
                collisions.push('left');
            }
            if (
                !collisions.includes('up') &&
                circleWithRect({
                    circle: { ...ghost, velocity: { x: 0, y: -3 } },
                    rectangle: boundary,
                })
            ) {
                collisions.push('up');
            }
            if (
                !collisions.includes('down') &&
                circleWithRect({
                    circle: { ...ghost, velocity: { x: 0, y: 3 } },
                    rectangle: boundary,
                })
            ) {
                collisions.push('down');
            }
        });
    
        // If there are collisions, change direction
        if (collisions.length > 0) {
            let availableDirections = ['up', 'down', 'left', 'right'].filter(
                (direction) => direction !== ghost.direction
            );
    
            // Filter out the direction leading back to the border
            availableDirections = availableDirections.filter(
                (direction) => !collisions.includes(direction)
            );
    
            if (availableDirections.length > 0) {
                let newDirection =
                    availableDirections[
                        Math.floor(Math.random() * availableDirections.length)
                    ];
    
                // Check if the new direction is opposite to the current direction
                if (
                    (ghost.direction === 'up' && newDirection === 'down') ||
                    (ghost.direction === 'down' && newDirection === 'up') ||
                    (ghost.direction === 'left' && newDirection === 'right') ||
                    (ghost.direction === 'right' && newDirection === 'left')
                ) {
                    // If opposite, choose a different direction
                    newDirection = availableDirections.filter(
                        (direction) => direction !== ghost.direction
                    )[0];
                }
    
                ghost.direction = newDirection;
    
                // Update velocity based on the new direction
                switch (ghost.direction) {
                    case 'down':
                        ghost.velocity.y = 3;
                        ghost.velocity.x = 0;
                        break;
                    case 'up':
                        ghost.velocity.y = -3;
                        ghost.velocity.x = 0;
                        break;
                    case 'right':
                        ghost.velocity.y = 0;
                        ghost.velocity.x = 3;
                        break;
                    case 'left':
                        ghost.velocity.y = 0;
                        ghost.velocity.x = -3;
                        break;
                }
            }
        }
    });
}

function refillMapWithPellets() {
    pellets.length = 0;
    map.forEach((row, i) => {
        row.forEach((symbol, j) => {
            if (symbol === '.') {
                pellets.push(new Pellet({
                    position: {
                        x: Boundary.width * j + Boundary.width / 2,
                        y: Boundary.height * i + Boundary.height / 2
                    },
                }));
            }
        });
    });
    currentGhostSpeed += 100; // You can adjust the speed increment as needed
    updateGhostSpeed();
}
function updateGhostSpeed() {
    ghossts.forEach((ghost) => {
        ghost.speed = currentGhostSpeed + 100;
    });
}
window.addEventListener('keydown', ({key}) => {
    switch (key)
    {
        case 'w':
            keys.w.pressed = true
        break
        case 'a':
            keys.a.pressed = true
        break
        case 's':
            keys.s.pressed = true
        break
        case 'd':
            keys.d.pressed = true
        break
    }
});

window.addEventListener('keyup', ({key}) => {
    switch (key)
    {
        case 'w':
            keys.w.pressed = false
        break
        case 'a':
            keys.a.pressed = false
        break
        case 's':
            keys.s.pressed = false
        break
        case 'd':
            keys.d.pressed = false
        break
    }
});