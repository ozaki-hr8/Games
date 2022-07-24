var frontImages = [];
var backImage;
var completedImage;
var startImage;
var gameoverImage;
var firstCard;
var secondCard;
var flipSound;
var correctSound;
var completedSound;
var gameoverSound;
var flippedCount = 0;
var timer = 0;
var pairCount = 0;
var gameMode;
var roundNumber = 0;
var lastChances = 10;
var lastNumber = 10;
var scoreNumber = 0;
var pointsX;
var pointsY;
var combo = 0;
var comboTable = [100, 200, 400, 800, 1600, 3200];  

function preload() {
    frontImages['doctor'] = loadImage('imgs/doctor.png');
    frontImages['fdoctor'] = loadImage('imgs/fdoctor.png');
    frontImages['gang'] = loadImage('imgs/gang.png');
    frontImages['gran'] = loadImage('imgs/gran.png');
    frontImages['police'] = loadImage('imgs/police.png');
    frontImages['president'] = loadImage('imgs/president.png');
    backImage = loadImage('imgs/backside.png');
    completedImage = loadImage('imgs/completed.png');
    startImage  = loadImage('imgs/start.png');
    gameoverImage  = loadImage('imgs/gameover.png');
    // flipSound = loadSound('turn_card.mp3');
    // correctSound = loadSound('correct.mp3');
    // completedSound = loadSound('completed.mp3');
  
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    gameMode = 'roundSetup';
}

function roundSetup() {
    allSprites.removeSprites();
    var cardTypes = ['doctor','doctor','fdoctor','fdoctor','gang','gang','gran','gran','police','police','president','president'];
    cardTypes = shuffleCards(cardTypes);

    var cardNumber = 0;
    for (var y = 0; y < 3; y++) {
        for (var x = 0; x < 4; x++) {
            var card = createSprite(236 + windowWidth/8 * x, 140 + windowHeight/3 * y);
            card.addImage('back', backImage);
            var type = cardTypes[cardNumber];
            card.addImage('front', frontImages[type]);
            card.type = type;
            card.onMousePressed = clicked;
            cardNumber++;
        }   
    }
    roundNumber++;
    pairCount = 0;
    combo = 0;
    lastNumber = lastChances;
    lastChances--;
    if (lastChances < 5) {
        lastChances = 5;
    }
    timer = 90;
    gameMode = 'roundStart';
}

function shuffleCards(cardTypes) {
    for (var i = 0; i < 100; i++) {
        var random1 = floor(random(12));
        var random2 = floor(random(12));
        var savedType = cardTypes[random1];
        cardTypes[random1] = cardTypes[random2];
        cardTypes[random2] = savedType;
    }    
    return cardTypes;
}

function draw() {
    background(0,128,128);
    drawSprites();
    textSize(32);
    textFont('Georgia');
    fill(255, 255, 255);
    text('Round',  1200, windowHeight/2-130);
    fill(255,255,255);
    text('Chance', 1200, windowHeight/2-30);
    fill(255,255,255);
    text('Score', 1200, windowHeight/2+70)
    drawNumber(roundNumber, 80, 1240, windowHeight/2-100);
    drawNumber(lastNumber, 80, 1240, windowHeight/2);
    drawNumber(scoreNumber, 80, 1240, windowHeight/2+100);

    if (gameMode == 'roundSetup') {
        roundSetup();
    }
    else if (gameMode == 'roundStart') {
        roundStart();
    }
    else if (gameMode == 'roundPlay') {
        roundPlay();
    }
    else if (gameMode == 'roundCompleted') {
        roundCompleted();
    }
    else if (gameMode == 'addPoints') {
        addPoints();
    }
    else if (gameMode == 'gameOver') {
        gameOver();
    }
}

function roundStart() {
    image(startImage, windowWidth/4, windowHeight/4);
    timer--;
    if (timer == 0) {
        gameMode = 'roundPlay';
    } 
}

function roundPlay() {
timer--;
  if (timer == 0) {
    firstCard.changeImage('back');
    secondCard.changeImage('back');
    // flipSound.play();
    flippedCount = 0;
  }
  if (pairCount == 6) {
     gameMode = 'roundCompleted';
    //  completedSound.play();
     timer = 150;
 }
}

function addPoints() {
    comboImage=comboTable[combo - 1]
    comboImage.toString()
    text(comboImage, pointsX, pointsY);
    pointsY--;
    timer--;
    if (timer == 0) {
        gameMode = 'roundPlay'; 
    }
}

function roundCompleted() {
    image(completedImage, 250, 250);
    timer--;   
    if (timer == 0) {
        gameMode = 'roundSetup';
    }
}

function gameOver() {
    image(gameoverImage, windowWidth/2, windowHeight/2);
}

function drawNumber(number, size, x, y) {
    var numberString = number.toString();
    fill(255,255,255);
    text(numberString, x, y);
}
function clicked(card) {
    if (gameMode != 'roundPlay') {
        return;
    }
    if (card.getAnimationLabel() == 'front') {
        return;
    }
    if (flippedCount == 2) {
        return;
    }

    flippedCount++;
    card.changeImage('front');
    // flipSound.play();
    if (flippedCount == 1) {
        firstCard = card;
    }
    if (flippedCount == 2) {
        secondCard = card;
        if (firstCard.type == secondCard.type) {
        pairCount++;
        // correctSound.play();
        if (pairCount == 6) {
            // completedSound.play();
        }
        flippedCount = 0;
        scoreNumber += comboTable[combo];
        pointsX = mouseX;
        pointsY = mouseY;
        timer = 45;
        gameMode = 'addPoints';
        combo++;
        } else {
            timer = 120;
            combo = 0;

            lastNumber--;
            if (lastNumber == 0) {
                gameMode = 'gameOver';
                // gameoverSound.play();
            }
        }
    }
}