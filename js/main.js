var game;
var ball;
var plate;

//defenite bricks
var brick;
var newBrick;
var brickInfo;

//the score
var scoreText;
var score = 0;
var youLoss;

//for lives
var lives = 3;
var livesText;
var lifeLostText;

//create a timer
var timer;
var speedX = 120;

//for button start
var playing = false;
var startButton;

//600 - width, 450 - height
game = new Phaser.Game(640, 360, Phaser.CANVAS, null, {
  preload: preload,
  create: create,
  update: update,
  render: render,
});

function preload() {
  //scalable
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;
  game.load.image('background', 'assets/images/background.png');
  game.stage.backgroundColor = '#1400ff';
  //game.load.image('ball', 'assets/images/ball.png');
  game.load.image('plate', 'assets/images/plate.png');
  game.load.image('brick', 'assets/images/brick.png');
  game.load.bitmapFont('goldfont', 'assets/fonts/goldfont.png', 'assets/fonts/goldfont.xml');
  //the spritesheet for the ball
  game.load.spritesheet('ball', 'assets/images/sp.png', 100, 100, 2);
  //the start button
  game.load.spritesheet('button', 'assets/images/start_b.png', 100, 100, 2);
}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.add.image(0, 0, 'background');
  //ball = game.add.sprite(game.world.width / 2, game.world.height - 100, 'ball');
  ball = game.add.sprite(game.world.width / 2, game.world.height - 100, 'ball');
  ball.animations.add('sp', [0, 1, 0], 12);
  //the end of animations
  plate = game.add.sprite(game.world.width * 0.5, game.world.height - 40, 'plate');
  plate.scale.setTo(0.5, 0.5);
  plate.anchor.setTo(0.5, 0.5);

  //setting of scale and pivot for ball
  ball.scale.setTo(0.3);
  ball.anchor.setTo(0.5, 0.5);
  game.world.bringToTop(ball);
  //enable physic to ball and plate
  game.physics.enable(ball, Phaser.Physics.ARCADE);
  game.physics.enable(plate, Phaser.Physics.ARCADE);

  //set border for bounce box of plate
  plate.body.setSize(110, 20, 10, 40);

  //add collide settings with borders of frame
  ball.body.collideWorldBounds = true;
  ball.body.bounce.set(1);
  //set movie to the ball
  // speedX;

  plate.body.immovable = true;

  //turn off collision with bottom border of the frame
  game.physics.arcade.checkCollision.down = false;
  ball.checkWorldBounds = true;
  ball.events.onOutOfBounds.add(
    //   function() {

    //   //location.reload();
    // },
    //if the ball leaves the screen
    ballLeaveScreen,
    this
  );
  initBricks();
  //  ball.body.gravity.y = 100;
  scoreText = game.add.bitmapText(5, 5, 'goldfont', 'Points: 0!', 48);
  //you loss stat
  youLoss = game.add.bitmapText(game.world.width / 2, game.world.height / 2, 'goldfont', '', 64);
  youLoss.anchor.setTo(0.5);
  youLoss.visible = false;

  // scoreText = game.add.text(5, 5, 'Points: 0', {
  //   font: '20px Arial',
  //   fill: '#ffff00',
  //   fontWeight: 'bold',
  // });
  //lives text
  livesText = game.add.bitmapText(500, 5, 'goldfont', 'Lives: ' + lives, 48);
  //
  lifeLostText = game.add.bitmapText(
    game.world.width / 2,
    game.world.height / 2,
    'goldfont',
    'you loss your lives',
    64
  );
  lifeLostText.anchor.setTo(0.5);
  lifeLostText.visible = false;
  //timer
  // timer = game.time.create(false);
  // timer.loop(2000, updateSpeed, this);
  // timer.start();
  // console.log(speedX);
  //the start button
  startGameButton();
}

function startGameButton() {
  startButton = game.add.button(
    game.world.width / 2,
    game.world.height / 2,
    'button',
    startGame,
    this,
    0,
    1,
    0
  );
  startButton.anchor.setTo(0.5);
}

function startGame() {
  startButton.destroy();
  ball.body.velocity.set(120, -400);
  playing = true;
}
// function updateSpeed() {
//   speedX += 10;
//   //  console.log(speedX);
// }

function ballLeaveScreen() {
  lives--;
  if (lives) {
    livesText.setText('Lives: ' + lives);
    lifeLostText.visible = true;

    game.input.onDown.addOnce(function() {
      plate.reset(game.world.width / 2, game.world.height - 40);
      ball.reset(plate.x, game.world.height - 50);
      lifeLostText.visible = false;
      ball.body.velocity.set(120, -400);
    });
  } else {
    livesText.setText('Lives: 0');
    youLoss.setText('GAME OVER!');
    //startGameButton();
    youLoss.visible = true;
    game.paused = true;
  }
}
// function collisionHandler(obj1, obj2) {
//   game.stage.backgroundColor = '#1400ff';
// }

function update() {
  //ball.angle += 10;
  game.physics.arcade.collide(ball, plate, ballHitPlate);
  game.physics.arcade.collide(ball, bricks, ballHitBrick);
  if (playing) {
    plate.x = game.input.x || game.world.width / 2;
  }
}

//for handling animation
function ballHitPlate(ball, plate) {
  ball.animations.play('sp');
  ball.body.velocity.x = -11 * (plate.x - ball.x);
  console.log(ball.body.velocity.x);
}

//draw bricks
function initBricks() {
  brickInfo = {
    width: 60,
    height: 20,
    count: {
      row: 3,
      col: 9,
    },
    offset: {
      top: 50,
      left: 52,
    },
    padding: 7,
  };
  bricks = game.add.group();
  for (c = 0; c < brickInfo.count.col; c++) {
    for (r = 0; r < brickInfo.count.row; r++) {
      var brickX = c * (brickInfo.width + brickInfo.padding) + brickInfo.offset.left;
      var brickY = r * (brickInfo.height + brickInfo.padding) + brickInfo.offset.top;

      newBrick = game.add.sprite(brickX, brickY, 'brick');
      game.physics.enable(newBrick, Phaser.Physics.ARCADE);
      newBrick.body.immovable = true;
      newBrick.anchor.set(0.5);
      newBrick.scale.setTo(0.5);
      newBrick.body.setSize(120, 30, 0, 10);
      bricks.add(newBrick);
    }
  }
}

function ballHitBrick(ball, brick) {
  //brick.kill();
  var killTween = game.add.tween(brick.scale);
  killTween.to({ x: 0, y: 0 }, 200, Phaser.Easing.Linear.None);
  killTween.onComplete.addOnce(function() {
    brick.kill();
  }, this);
  killTween.start();
  //
  ball.animations.play('sp');
  score += 1;

  scoreText.setText('Points: ' + score);
  var count_alive = 0;
  for (i = 0; i < bricks.children.length; i++) {
    if (bricks.children[i].alive == true) {
      count_alive++;
      // console.log(count_alive);
    }
  }
  if (count_alive == 1) {
    youLoss.visible = true;
    youLoss.setText('you win!');
    game.paused = true;
    //location.reload();
  }
  // if (score == brickInfo.count.row * brickInfo.count.col) {
  //   console.warn('win');
  //   youLoss.visible = true;
  //   youLoss.setText('you win!');
  //   game.paused = true;
  //   //location.reload();
  // }
}

//for debugging
function render() {
  //sgame.debug.body(newBrick);
  //game.debug.spriteInfo(ball, 32, 32);
}
