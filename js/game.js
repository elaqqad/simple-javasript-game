// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 800;
document.body.appendChild(canvas);

// Background image : loading  ***********************************************************
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";


// Hero image : loading ******************************************************************
var heroReady = true;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/icon_heart.png";


// The images of all numbers 0,1,2,4,8,16,32 ******************************************************************
var imageArray = new Array();
var arrayReady = false;

// Image factory
var createImage = function(src, title) {
  var img   = new Image();
  img.src   = src;
  img.alt   = title;
  img.title = title;
  return img; 
};

// push all the images to the array
imageArray.push(createImage("images/0.png", "0"));
imageArray.push(createImage("images/1.png", "1"));
imageArray.push(createImage("images/2.png", "2"));
imageArray.push(createImage("images/4.png", "4"));
imageArray.push(createImage("images/8.png", "8"));
imageArray.push(createImage("images/16.png", "16"));
imageArray.push(createImage("images/32.png", "32"));


var arrow_a_up=createImage("images/arrow_a_up.png", "a up");
var arrow_a_down=createImage("images/arrow_a_down.png", "a down");
var arrow_b_up=createImage("images/arrow_b_up.png", "b up");
var arrow_b_down=createImage("images/arrow_b_down.png", "b down");
var arrow_c_up=createImage("images/arrow_c_up.png", "c up");
var arrow_c_down=createImage("images/arrow_c_down.png", "c down");


// Game objects : ************************************************************************
var hero = {
	speed: 256 // movement in pixels per second
};

var score = 0;
var game={};

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player succeded
var reset = function () {
	hero.x = 16;
	hero.y = 150;
	game.a = Math.floor(1+Math.random()*20);
	game.b = Math.floor(1+Math.random()*20);
	game.c = Math.floor(1+Math.random()*20);
	game.k=0;

};

// drawing all images :
var drawABC=function(a,b,c){
	// drawing the A images :
	var binarya = (a >>> 0).toString(2);
	var k=0;
	for (i = 0; i < binarya.length; i++) { 
		if (binarya[i]=='1' ){
			ctx.drawImage(imageArray[binarya.length-i],696-k*110,150);
			k++;
		}
	}
	game.k=k;
	hero.x = Math.min(hero.x,696-game.k*110);
	// drawing the B images :
	var binaryb = (b >>> 0).toString(2);
	var k=0;
	for (i = 0; i < binaryb.length; i++) { 
		if (binaryb[i]=='1' ){
			ctx.drawImage(imageArray[binaryb.length-i],696-k*110,315);
			k++;
		}
	}
	
	
	// drawing the C images :
	var binaryc = (c >>> 0).toString(2);
		var binaryb = (b >>> 0).toString(2);
	var k=0;
	for (i = 0; i < binaryc.length; i++) { 
		if (binaryc[i]=='1' ){
			ctx.drawImage(imageArray[binaryc.length-i],696-k*110,480);
			k++;
		}
	}
	
	if (b>a){
		ctx.drawImage(arrow_a_up,830,200);
	} else{
		ctx.drawImage(arrow_a_down,830,200);
	}
	
	if (c>b){
		ctx.drawImage(arrow_b_up,830,360);
	} else{
		ctx.drawImage(arrow_b_down,830,360);
	}
	
	if (c>a){
		ctx.drawImage(arrow_c_up,880,200);
	} else{
		ctx.drawImage(arrow_c_down,880,200);
	}
	
}


// Update game objects
var update = function (modifier) {

	if (37 in keysDown) { // Player holding left
		hero.x = Math.max(16,hero.x-hero.speed * modifier);
	}
	if (39 in keysDown) { // Player holding right
		hero.x = Math.min(hero.x+hero.speed * modifier,696-game.k*110);
	}
	// changing a,b,c
	if (65 in keysDown) { // Player holding a
		if (game.a<game.b){
			game.a= 2*game.a;
			game.b=game.b-game.a/2;
			} 
		else {
			game.b= 2*game.b;
			game.a= game.a-game.b/2;
		}
		delete keysDown[65];
	}
	if (66 in keysDown) { // Player holding b
		if (game.c<game.b){
			game.c= 2*game.c;
			game.b=game.b-game.c/2;
			} 
		else {
			game.b= 2*game.b;
			game.c=game.c-game.b/2;
		}
		delete keysDown[66];
	}
	if (67 in keysDown) { // Player holding c
		if (game.a<game.c){
			game.a= 2*game.a;
			game.c=game.c-game.a/2;
			} 
		else {
			game.c= 2*game.c;
			game.a=game.a-game.c/2;
		}
		delete keysDown[67];
	}

	// Are they touching?
	if (
		hero.x == 696) {
		++score;
		reset();
	}
};

// Draw everything
var render = function () {
	

	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}
	for (k = 0; k< 6; k++) {
		ctx.drawImage(imageArray[0],696-k*110,150);
		ctx.drawImage(imageArray[0],696-k*110,315);
		ctx.drawImage(imageArray[0],696-k*110,480);
	}
	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}
   
    
	drawABC(game.a,game.b,game.c);
	
	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText(score, 75,70 );
	ctx.fillText("no", 235,70 );
	
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;
	update(delta / 1000);
	
	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();
