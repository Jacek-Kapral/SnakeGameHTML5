var 
canvas = document.getElementById('canvas'),
ctx = canvas.getContext('2d'),
scoreIs = document.getElementById('score'),
direction = '',
directionQueue = '',
fps = 70,
snake = [],
snakeLength = 5,
cellSize = 20,
snakeColor = '#9ACD32',
foodColor = '#FF8C00',
foodX = [],
foodY = [],
food = {
	x: 0, 
	y: 0
},
score = 0,
hit = new Audio('hit.wav');
pick = new Audio('pick.wav');

for(i = 0; i <= canvas.width - cellSize; i+=cellSize) {
	foodX.push(i);
	foodY.push(i);
}

canvas.setAttribute('tabindex',1);
canvas.style.outline = 'none';
canvas.focus();

function drawSquare(x,y,color) {
	ctx.fillStyle = color;
	ctx.fillRect(x, y, cellSize, cellSize);	
}

function createFood() { 
	food.x = foodX[Math.floor(Math.random()*foodX.length)]; 
	food.y = foodY[Math.floor(Math.random()*foodY.length)]; 
	
	for(i = 0; i < snake.length; i++) {
		if(checkCollision(food.x, food.y, snake[i].x, snake[i].y)) {
			createFood(); 
		}
	}
}

function drawFood() {
	drawSquare(food.x, food.y, foodColor);
}

function setBackground(color1, color2) {
	ctx.fillStyle = color1;
	ctx.strokeStyle = color2;

	ctx.fillRect(0, 0, canvas.height, canvas.width);

	for(var x = 0.5; x < canvas.width; x += cellSize) {
		ctx.moveTo(x, 0);
		ctx.lineTo(x, canvas.height);
	}
	for(var y = 0.5; y < canvas.height; y += cellSize) {
		ctx.moveTo(0, y);
		ctx.lineTo(canvas.width, y);
	}

	ctx.stroke()
}

function createSnake() {
	snake = [];
		for(var i = snakeLength; i > 0; i--) {
		k = i * cellSize;
		snake.push({x: k, y:0});
	}
}

function drawSnake() {
	for(i = 0; i < snake.length; i++) {
		drawSquare(snake[i].x, snake[i].y, snakeColor);
	}
}

function changeDirection(keycode) {
	if(keycode == 37 && direction != 'right') { directionQueue = 'left'; }
	else if(keycode == 38 && direction != 'down') { directionQueue = 'up'; }
	else if(keycode == 39 && direction != 'left') { directionQueue = 'right'; }
	else if(keycode == 40 && direction != 'top') { directionQueue = 'down' }
}

function moveSnake() {
	var x = snake[0].x; 
	var y = snake[0].y;

	direction = directionQueue;

	if(direction == 'right') {
		x+=cellSize;
	}
	else if(direction == 'left') {
		x-=cellSize;
	}
	else if(direction == 'up') {
		y-=cellSize;
	}
	else if(direction == 'down') {
		y+=cellSize;
	}
	// removes the tail and makes it the new head...very delicate, don't touch this
	var tail = snake.pop(); 
	tail.x = x;
	tail.y = y;
	snake.unshift(tail);
}

function checkCollision(x1,y1,x2,y2) {
	if(x1 == x2 && y1 == y2) {
		return true;
	}
	else {
		return false;
	}
}

function game(){
	var head = snake[0];
	if(head.x < 0 || head.x > canvas.width - cellSize  || head.y < 0 || head.y > canvas.height - cellSize) {
		hit.play();
		setBackground();
		createSnake();
		drawSnake();
		createFood();
		drawFood();
		directionQueue = 'right';
		score = 0;
	}
	for(i = 1; i < snake.length; i++) {
		if(head.x == snake[i].x && head.y == snake[i].y) {
			setBackground();
			createSnake();
			drawSnake();
			createFood();
			drawFood();
			directionQueue = 'right';
			score = 0;
		}
	}
	if(checkCollision(head.x, head.y, food.x, food.y)) {
		snake[snake.length] = {x: head.x, y: head.y};
		createFood();
		drawFood();
		pick.play();
		score += 1;
	}

	canvas.onkeydown = function(evt) {
		evt = evt || window.event;
		changeDirection(evt.keyCode);
	};

   ctx.beginPath();
   setBackground('#fff', '#eee');
   scoreIs.innerHTML = score;
   drawSnake();
   drawFood();
   moveSnake();
}
function newGame() {
	direction = 'right';
	directionQueue = 'right';
	ctx.beginPath();
	createSnake();
	createFood();

	if(typeof loop != 'undefined') {
		clearInterval(loop);
	}
	else {
		loop = setInterval(game, fps);
	}
}
newGame();