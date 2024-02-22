let bug;
let bugs = [];
let score;
let gameState;
let bugSpeed = 1;
let bugCount = 15;
let timer = 30;
let bugsLeft = bugCount;
let animations;
let sheet;
let finalScore;
let frameD = 20;

function preload() 
{
  sheet = loadImage('assets/Bug.png');
  animations = 
  {
    walk: {row: 0, frames: 4},
    stand: {row:0, col: 0, frames: 1},
    dead: {row: 0, col: 4, frames:1 }
  };
}

function setup() {
  createCanvas(800, 600);
  gameState = "start";
}

function draw() {
  background(235);

  if(gameState == "start")
  {
    startScreen();
    if(kb.pressing('p'))
    {
      gameState = 'play';
      score = 0;
      makeBugs(bugCount);
    }
  }

  else if(gameState == "play")
  {
    fill(0);
    textSize(30);
    text("Time Left: "+ timer, 10, 25);
    text("Score: "+score, 10, 55);
    if(frameCount % 60 == 0 && timer > 0) 
    {
      timer--;
    }
    for(let i = 0; i < bugs.length; i++)
    {
      if(bugs[i].leftScreen() && !bugs[i].isMarked())
      {
        bugs[i].mark();
        bugsLeft--;
      }
    }
    if(bugsLeft == 0)
    {
      makeBugs(bugCount);
      bugsLeft =  bugCount;
    }
    if(timer == 0)
    {
      gameState = 'end';
      finalScore = score;
    }
  }

  else if(gameState == "end")
  {
    endScreen();
  }
}

class Bug {
  constructor(x, y, bWidth, bHeight, spriteSheet, animations) {
    this.sprite = new Sprite(x,y,bWidth,bHeight);
    this.sprite.spriteSheet = spriteSheet;
    this.sprite.collider = 'none';
    this.sprite.anis.frameDelay = frameD;
    this.sprite.addAnis(animations);
    this.sprite.startPos = random([1,2,3,4]);
    this.sprite.isAlive = true;
    this.sprite.mark = false;
    switch(this.sprite.startPos)
    {
      case 1:
        this.sprite.changeAni('walk');
        this.sprite.vel.y = bugSpeed;
        this.sprite.vel.x = 0;
        this.sprite.roatation = 180;
        break;
      case 2:
        this.sprite.changeAni('walk');
        this.sprite.vel.x = -bugSpeed;
        this.sprite.vel.y = 0;
        this.sprite.rotation = 270;
        break;
      case 3: 
        this.sprite.changeAni('walk');
        this.sprite.vel.y = -bugSpeed;
        this.sprite.vel.x = 0;
        break;
      case 4:
        this.sprite.changeAni('walk');
        this.sprite.vel.x = bugSpeed;
        this.sprite.vel.y = 0;
        this.sprite.rotation = 90;
        break;
      default:
        this.sprite.changeAni('stand');
        break;
    }
  }

  squish() {
    this.sprite.vel.x = 0;
    this.sprite.vel.y = 0;
    this.sprite.changeAni('dead');
    this.sprite.isAlive = false;
    bugsLeft--;
  }
  
  walkRight() {
    this.sprite.changeAni('walk');
    this.sprite.vel.x = bugSpeed;
    this.sprite.vel.y = 0;
    this.sprite.rotation = 90;
  }
  
  walkLeft() {
    this.sprite.changeAni('walk');
    this.sprite.vel.x = -bugSpeed;
    this.sprite.vel.y = 0;
    this.sprite.rotation = 270;
  }
  
  walkUp() {
    this.sprite.changeAni('walk');
    this.sprite.vel.y = -bugSpeed;
    this.sprite.vel.x = 0;
  }
  
  walkDown() {
    this.sprite.changeAni('walk');
    this.sprite.vel.y = bugSpeed;
    this.sprite.vel.x = 0;
    this.sprite.roatation = 180;
  }

  contains(x,y)
  {
    let insideX = x >= this.sprite.x - this.sprite.width/2 && x <= this.sprite.x + this.sprite.width/2;
    let insideY = y >= this.sprite.y - this.sprite.height/2 && y <= this.sprite.y + this.sprite.height/2;
    return insideX && insideY;
  }

  isAlive()
  {
    return this.sprite.isAlive;
  }

  isMarked()
  {
    return this.sprite.mark;
  }

  mark()
  {
    this.sprite.mark = true;
  }

  leftScreen()
  {
    return (this.sprite.x < 0 || this.sprite.x > 800 || this.sprite.y < 0 || this.sprite.y > 600);
  }
  
  getFrames()
  {
    return this.sprite.frameDelay;
  }

  increaseSpeed()
  {
    if(this.sprite.vel.x >= 1)
    {
      this.sprite.vel.x += 0.15;
    }
    else if(this.sprite.vel.x <= -1)
    {
      this.sprite.vel.x -= 0.15;
    }
    else if(this.sprite.vel.y >= 1)
    {
      this.sprite.vel.y += 0.15;
    }
    else if(this.sprite.vel.y <= -1)
    {
      this.sprite.vel.y -= 0.15;
    }
  }
}

function mousePressed()
{
    for(let i = 0; i < bugs.length; i++)
    {
      let contains = bugs[i].contains(mouseX, mouseY);
      if(contains && bugs[i].isAlive())
      {
        
        for(let i = 0; i < bugs.length; i++)
        {
          bugs[i].increaseSpeed();
        }
        if(frameD > 0)
        {
          frameD -= 1;
        }
        bugSpeed += 0.15;
        bugs[i].squish();
        contains = false;
        score++;
        break;
      }
    }
}

function makeBugs(count)
{
    for(let i = 0; i < count; i++)
    {
       bugs.push(new Bug(floor(random(25,775)), floor(random(0,575)), 60, 60, sheet, animations));
    }
}

function startScreen()
{
  push();
  fill('gray');
  strokeWeight(5);
  rect(width/2 - 250, height/2 - 200, 400, 200);
  
  noStroke;
  fill(0);
  textAlign(CENTER);
  textSize(20);
  text('Click as many bugs as you \ncan in thirty seconds.\nPress p to play.', width/2 - 50, height/2 -115);
  pop();
}

function endScreen()
{
  push();
  fill('gray');
  strokeWeight(5);
  rect(width/2 - 250, height/2 - 200, 400, 200);
  noStroke;
  fill(0);
  textAlign(CENTER);
  textSize(20);
  text('You squished '+finalScore+' bugs.\nRefresh to try again.', width/2 - 50, height/2 -115);
  bugs.removeAll();
  pop();
}