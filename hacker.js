var
pi = Math.PI,
UpArrow   = 38,
DownArrow = 40,
WIDTH = window.innerWidth*(3/4),
HEIGHT = '600',
gamestate = 0,
canvas,
ctx,
keystate,


paddle1 = {
	x: null,
	y: null,
	width:  20,
	height: 160,
	state: 1,
	score : 0,
	update: function() {
		if (keystate[UpArrow]&& this.state == 1 && gamestate == 1 && this.y > 20) this.y -= 10;
		if (keystate[DownArrow]&& this.state == 1 && gamestate == 1 && this.y < 580-this.height) this.y += 10;
	},
	draw: function() {
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}
},

paddle2 = {
	x: null,
	y: null,
	width:  20,
	height: 160,
	state: 0,
	score : 0,
	update: function() {
		if (keystate[UpArrow]&& this.state == 1 && gamestate == 1 && this.y > 20) this.y -= 10;
		if (keystate[DownArrow]&& this.state == 1 && gamestate == 1 && this.y < 580-paddle1.height) this.y += 10;
		},
	draw: function() {
		ctx.fillRect(this.x, this.y, this.width, this.height);
		}
},
ball = {
	x:   null,
	y:   null,
	vel: null,
	r : 25,
	spdX: -5,
	spdY: 5,
	update: function() {
				if(checkcollision(paddle1)){
					//Inverting the direction
					this.spdX = -this.spdX;
					//Increasing the score
					paddle1.score++;
					//Random position of paddle after hit
					paddle1.y = Math.floor(Math.random()*(600-40-paddle1.height)/10)*10+20;
					//Flag values for changing the controls of paddles
					paddle1.state = 0;
					paddle2.state = 1;
					//Preventing more than one collision at a time by placing the ball away from paddle after first collision
					this.x = paddle1.x + paddle1.width + this.r;
				}
				else{
					//if ball touches boundary
					if(this.x-this.r <= 20)
					{
					document.getElementById("gameOver").innerHTML="GAME OVER ::PLAYER 2 WON      Please refresh the page to play again";
					}
				}
				if(checkcollision(paddle2)){
					this.spdX = -this.spdX;
					//Increasing the speed after hit
					this.spdX -= 0.5;
					paddle2.score++;
					paddle2.y = Math.floor(Math.random()*(600-40-paddle1.height)/10)*10+20;
					paddle1.state = 1;
					paddle2.state = 0;
					this.x = paddle2.x - this.r;
				}
				else{
					if(this.x + this.r >= WIDTH-20)
					{
					document.getElementById("gameOver").innerHTML="GAME OVER ::PLAYER 1 WON       Please refresh the page to play again"
					}
				}
				if(ball.y - ball.r < 20 || ball.y + ball.r > HEIGHT-20){
					ball.spdY = -ball.spdY;
				}
			this.x += this.spdX;
			this.y += this.spdY;
	},
	draw: function() {
		ctx.beginPath();
		ctx.arc(this.x,this.y,this.r,0,2*Math.PI);
		ctx.fillStyle = "#FFF";
		ctx.fill();
	},
};


function draw() {
	ctx.fillRect(0,0,WIDTH,HEIGHT);
	ctx.save();
	ctx.fillStyle = "#000";
	ctx.rect(20,20,WIDTH-40,HEIGHT-40);
	ctx.strokeStyle = "#FFF";
	ctx.stroke();
	ctx.setLineDash([10,10]);
	ctx.beginPath();
	ctx.moveTo(WIDTH/2,20);
	ctx.lineTo(WIDTH/2,HEIGHT-20);
	ctx.stroke();
	display_score();
	ball.draw();
	paddle1.draw();
	paddle2.draw();
	ctx.restore();
}
function main() {
	// create, initiate and append game canvas
	canvas = document.getElementById("myCanvas");
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	ctx = canvas.getContext("2d");
	
	keystate = {};
	// keep track of keyboard presses
	document.addEventListener("keydown", function(e) {
		keystate[e.keyCode] = true;
	});
	document.addEventListener("keyup", function(e) {
		delete keystate[e.keyCode];
	});
	
	gamestate=1;
	
	init(); // initiate game objects
	// game loop function
	var loop = function() {
		update();
		draw();
		window.requestAnimationFrame(loop);
	};
	window.requestAnimationFrame(loop);
}

function init() {
	paddle1.x = 25;
	paddle1.y = 220;
	paddle2.x = WIDTH - 45;
	paddle2.y = 220;
	ball.x = WIDTH/2;
	ball.y = HEIGHT/2;
	ball.vel = {
		x:ball.spdX,
		y:ball.spdY
	}
}

function update() {
	ball.update();
	paddle1.update();
	paddle2.update();
	
}
main();
function checkcollision(paddle){
	
	var diff_x = Math.abs(ball.x -(paddle.x + paddle.width/2));
	var diff_y = Math.abs(ball.y -(paddle.y + paddle.height/2));
	
	if(diff_x > (paddle.width/2 + ball.r)){return false;}
	if(diff_y > (paddle.height/2 + ball.r)){return false;}
		
	if (diff_x <= (paddle.width/2)) { return true; } 
	if (diff_y <= (paddle.height/2)) { return true; }
	
	//Checking collisions near corners
	//Distance between corner and ball center should be less than radius
	var corner1dist_sq = Math.pow(ball.x - paddle.x,2) + Math.pow(ball.y - paddle.y,2);
	if(corner1dist_sq < Math.pow(ball.r,2)){return true;}
	
	var corner2dist_sq = Math.pow(ball.x - (paddle.x+paddle.width),2) + Math.pow(ball.y - paddle.y,2);
	if(corner2dist_sq < Math.pow(ball.r,2)){return true;}
	
	var corner3dist_sq = Math.pow(ball.x - (paddle.x + paddle.width),2) + Math.pow(ball.y - (paddle.y + paddle.height),2);
	if(corner3dist_sq < Math.pow(ball.r,2)){return true;}
	
	var corner4dist_sq = Math.pow(ball.x - paddle.x,2) + Math.pow(ball.y - (paddle.y + paddle.height),2);
	if(corner4dist_sq < Math.pow(ball.r,2)){return true;}
	
	return false;
}

function display_score(){
	ctx.save();
	ctx.font = "25px Georgia";
	ctx.fillStyle = "#FFF";
	ctx.textAlign = "center"
	
	ctx.fillText("PLAYER 1",WIDTH/4,50);
	ctx.fillText(paddle1.score,WIDTH/4,100);
	
	ctx.fillText("PLAYER 2",3*WIDTH/4,50);
	ctx.fillText(paddle2.score,3*WIDTH/4,100);
	
	ctx.restore();
}
