// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: create, update: update };


// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var game;// = new Phaser.Game(640, 350, Phaser.AUTO, 'game', stateActions);
var score;
score = 0;
var labelscore;
var player;
var pipes = [];
/*

 * Loads all resources for the game and gives them names.
 * game.add.sprite(event.x, event.y, "playerImg2");
 */
jQuery("#greeting-form").on("submit", function(event_details) {
    var greeting = "Hello ";
    var name = jQuery("#fullName").val();
    jQuery("#greeting-form").hide();
    jQuery("#greeting").append("<p>" + greeting_message + "</p>");
    event_details.preventDefault();
});
function preload() {
    game.load.image("playerImg", "../assets/flappy_frog.png");
    game.load.image("backgroundImg","../assets/f.jpg");
    game.load.image("playerImg2", "../assets/TB.png");
    game.load.audio("score", "../assets/point.ogg");
    game.load.image("pipe"," ../assets/pipe2-body.png")
    game.load.image("pipeLid", "../assets/pipe2-end.png");
}
function clickHandler(event) {
// var gapSize = 3;
}

var lastGap = 2;


game = new Phaser.Game(640, 350, Phaser.AUTO, 'game', stateActions);


function generatePipe(x) {
        x += 750;
        var gapSize = 2;

        var gap = game.rnd.integerInRange(-1, 1);
        gap = lastGap + gap;
        if (gap < 1) {
            gap = 1;
        }else if (gap > 5){
            gap = 5;
        }

        if (gap == lastGap) {
            if (Math.random() >= 0.5)
                gap--;
            else
                gap++;
        }

        lastGap = gap;

        for (var count=0; count < 8; count++) {
            if (count != gap && count != gap + 1) {
                addPipeBlock(x, count * 50)
            }

            if (count == gap) {
               addToPipes(game.add.sprite(x - 2.5, (count) * 50, "pipeLid"));
            }else {
                if (count == (gap + gapSize)) {
                    addToPipes(game.add.sprite(x - 2.5, (count) * 50, "pipeLid"));
                }
            }
        }
}




function create() {

    game.add.image(0,0, "backgroundImg");
    player = game.add.sprite(100,300,"playerImg2");
    player.scale.setTo(0.01, 0.01);
    game.input
        .keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(start);

}


function start() {
    score = 0;


    for (var count=2;count < 100; count+=3){
        generatePipe(count * 50);
    }
    game.add.text(100, 50, "Welcome to our bouncy ball game",
        {font: "30px Hobo Std Medium", fill: "#FFFFFF"});


    game.add.sprite(10, 10, "playerImg");
    game.add.sprite(10, 310, "playerImg");
    game.add.sprite(580, 10, "playerImg");
    game.add.sprite(580, 310, "playerImg");
    game.input
        .onDown
        .add(clickHandler);


    game.input
        .keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.removeAll();
    game.input
        .keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(spaceHandler);
    labelscore = game.add.text(270,20, "Score = 0",
        {font: "20px Hobo Std Medium", fill: "#FFFFFF"});



    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.enable(player);



    player.scale.setTo(0.10, 0.10);
    player.x = 150;
    player.y = 200;
    //player.body.velocity.x = 50;
    player.body.velocity.y = -50;
    player.body.gravity.y = 400;
    game.input.keyboard
        .addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(playerJump);

}

function playerJump() {
    player.body.velocity.y = -200;

}

function spaceHandler() {
    game.sound.play("score");
    changescore();
}

function addPipeBlock(x, y) {
    var pipeBlock = game.add.sprite(x,y, "pipe");
    addToPipes(pipeBlock);
}

function addToPipes(pipe) {
    pipes.push(pipe);
    game.physics.arcade.enable(pipe);
    pipe.body.velocity.x = -200;
}


var colours = [
    "#FF00FF",
    "#00FF00",
    "#FF00FF",
    "#FF0000",
    "#FFFFFF",
    "#000000",
    "#33FF33",
    "#FF8000",
    "#FFFF00"
];

function changescore(){
        score = score + 1;
        labelscore.setText("Score = " + score.toString());
        labelscore.fill = colours[score % colours.length];
}


/*
 * This function updates the scene. It is called for every new frame.
 */

function update() {
    if(player.y > 350){
        gameOver()
    }
    if(player.y< 0){
        gameOver()
    }
    for (var index = 0; index < pipes.length; index++) {
        game.physics.arcade
            .overlap(player,


            pipes[index],
            gameOver);
    }

}
function gameOver(){
    game.destroy();
    alert("You score: " + score + "\nPress OK to retry...");
    $("#score").val(score.toString());
    $("#greeting").show();
}

$.get("/score", function(scores){
    for (var i = 0; i < scores.length; i++) {
        $("#scoreBoard").append(
        "<li>" +
        scores[i].name + ": " + scores[i].score +
        "</li>");
    }
});