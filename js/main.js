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
  game.load.image('ball', 'assets/images/ball.png');
  game.load.image('plate', 'assets/images/plate.png');
  game.load.image('brick', 'assets/images/brick.png');
  game.load.bitmapFont('goldfont', 'assets/fonts/goldfont.png', 'assets/fonts/goldfont.xml');

}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.add.image(0, 0, 'background');
  ball = game.add.sprite(game.world.width / 2, game.world.height - 100, 'ball');
  plate = game.add.sprite(game.world.width * 0.5, game.world.height - 40, 'plate');
  plate.scale.setTo(0.5, 0.5);
  plate.anchor.setTo(0.5, 0.5);

  //setting of scale and pivot for ball
  ball.scale.setTo(0.1, 0.1);
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
  ball.body.velocity.set(120, -400);
  plate.body.immovable = true;

  //turn off collision with bottom border of the frame
  game.physics.arcade.checkCollision.down = false;
  ball.checkWorldBounds = true;
  ball.events.onOutOfBounds.add(function() {
    youLoss.setText('you loss!');
    youLoss.visible = true;
    game.paused = true;
    //location.reload();
  }, this);
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
}

function collisionHandler(obj1, obj2) {
  game.stage.backgroundColor = '#1400ff';
}
The Complete Mobile Game Development Course with Phaser

function update() {
  ball.angle += 10;
  game.physics.arcade.collide(ball, plate);
  game.physics.arcade.collide(ball, bricks, ballHitBrick);
  plate.x = game.input.x || game.world.width / 2;
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
  brick.kill();
  score += 1;
  scoreText.setText('Points: ' + score);
  var count_alive = 0;
  for (i = 0; i < bricks.children.length; i++) {
    if (bricks.children[i].alive == true) {
      count_alive++;
    }
  }
  if (count_alive == 0) {
    youLoss.visible = true;
    youLoss.setText('you win!');
    game.paused = true;
    // TODO: need will to add lives for user
    //location.reload();
  }
}

//for debugging
function render() {
  //sgame.debug.body(newBrick);
  //game.debug.spriteInfo(ball, 32, 32);
}
