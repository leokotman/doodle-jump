const gameGrid = document.querySelector(".grid");
const doodler = document.createElement("div");
const scoreBlock = document.querySelector(".score");
let leftSpace = 50;
let startPoint = 100;
let bottomSpace = startPoint;
let isGameOver = false;
let gameHeight = gameGrid.clientHeight;
let gameWidth = gameGrid.clientWidth;
let platformsCount = 5;
let platforms = [];
let upInterval, downInteral;
let isJumping = true;
let score = 0;

function createDoodler() {
  gameGrid.appendChild(doodler);
  doodler.classList.add("doodler");
  leftSpace = platforms[0].left;
  doodler.style.left = leftSpace + "px";
  doodler.style.bottom = bottomSpace + "px";
}

class Platform {
  constructor(newPlatBottom) {
    this.bottom = newPlatBottom;
    this.left = Math.random() * (gameWidth - 85);
    this.visual = document.createElement("div");

    const visual = this.visual;
    visual.classList.add("platform");
    visual.style.left = this.left + "px";
    visual.style.bottom = this.bottom + "px";
    gameGrid.appendChild(visual);
  }
}

function createPlatforms() {
  for (let i = 0; i <= platformsCount; i++) {
    let platformGap = gameHeight / platformsCount;
    let newPlatBottom = 50 + i * platformGap;
    let newPlatform = new Platform(newPlatBottom);
    platforms.push(newPlatform);
    console.log(platforms);
  }
}

function movePlatforms() {
  if (bottomSpace > 200) {
    platforms.forEach((platform) => {
      platform.bottom -= 4;
      let visual = platform.visual;
      visual.style.bottom = platform.bottom + "px";

      //bottom platforms disappear, new appear from top
      if (platform.bottom < 5) {
        let firstPlatform = platforms[0].visual;
        firstPlatform.classList.remove("platform");
        platforms.shift();
        score++;
        scoreBlock.innerHTML = score;
        let newPlatform = new Platform(gameHeight);
        platforms.push(newPlatform);
      }
    });
  }
}

function jump() {
  clearInterval(downInteral);
  isJumping = true;
  upInterval = setInterval(function () {
    bottomSpace += 20;
    doodler.style.bottom = bottomSpace + "px";
    if (bottomSpace > startPoint + 200) {
      fall();
    }
  }, 40);
}

function fall() {
  clearInterval(upInterval);
  isJumping = false;
  downInteral = setInterval(function () {
    bottomSpace -= 5;
    doodler.style.bottom = bottomSpace + "px";
    if (bottomSpace <= 0) {
      gameOver();
    }

    //check collision with platforms when falling
    platforms.forEach((platform) => {
      if (
        bottomSpace >= platform.bottom &&
        bottomSpace <= platform.bottom + 15 &&
        leftSpace + 60 >= platform.left &&
        leftSpace <= platform.left + 85 &&
        !isJumping
      ) {
        console.log("landed");
        startPoint = bottomSpace; //jumping start will be here
        jump();
      }
    });
  }, 40);
}

function gameOver() {
  console.log("game is over");
  isGameOver = true;
  clearInterval(upInterval);
  clearInterval(downInteral);
  document.removeEventListener("keyup", control);
  alert("Your score is: " + score);
}

function moveLeft() {
  if (leftSpace >= 40) {
    leftSpace -= 40;
    doodler.style.left = leftSpace + "px";
  }
}

function moveRight() {
  if (leftSpace < gameWidth - 100) {
    leftSpace += 40;
    doodler.style.left = leftSpace + "px";
  }
}

function control(e) {
  console.log(e.key);
  if (e.key === "ArrowLeft") {
    moveLeft();
  } else if (e.key === "ArrowRight") {
    moveRight();
  }
}

function startGame() {
  if (!isGameOver) {
    createPlatforms();
    createDoodler();
    setInterval(movePlatforms, 50);
    document.addEventListener("keyup", control);
    jump();
  }
}
startGame();
