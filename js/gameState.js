var Points = {
	ASTEROIDS: [
		[-4,-2,-2,-4,0,-2,2,-4,4,-2,3,0,4,2,1,4,-2,4,-4,2,-4,-2],
		[-3,0,-4,-2,-2,-4,0,-3,2,-4,4,-2,2,-1,4,1,2,4,-1,3,-2,4,-4,2,-3,0],
		[-2,0,-4,-1,-1,-4,2,-4,4,-1,4,1,2,4,0,4,0,1,-2,4,-4,1,-2,0],
		[-1,-2,-2,-4,1,-4,4,-2,4,-1,1,0,4,2,2,4,1,3,-2,4,-4,1,-4,-2,-1,-2],
		[-4,-2,-2,-4,2,-4,4,-2,4,2,2,4,-2,4,-4,2,-4,-2]
	],

	SHIP:  [6,0,-3,-3,-2,0,-3,3,6,0],
	FLAMES:  [-2,0,-3,-1,-5,0,-3,1,-2,0],

	LETTERS: [
		[0,6,0,2,2,0,4,2,4,4,0,4,4,4,4,6],                 //A
		[0,3,0,6,2,6,3,5,3,4,2,3,0,3,0,0,2,0,3,1,3,2,2,3], //B
		[4,0,0,0,0,6,4,6],                                 //C
		[0,0,0,6,2,6,4,4,4,2,2,0,0,0],                     //D
		[4,0,0,0,0,3,3,3,0,3,0,6,4,6],                     //E
		[4,0,0,0,0,3,3,3,0,3,0,6],                         //F
		[4,2,4,0,0,0,0,6,4,6,4,4,2,4],                     //G
		[0,0,0,6,0,3,4,3,4,0,4,6],                         //H
		[0,0,4,0,2,0,2,6,4,6,0,6],                         //I
		[4,0,4,6,2,6,0,4],                                 //J
		[3,0,0,3,0,0,0,6,0,3,3,6],                         //K
		[0,0,0,6,4,6],                                     //L
		[0,6,0,0,2,2,4,0,4,6],                             //M
		[0,6,0,0,4,6,4,0],                                 //N
		[0,0,4,0,4,6,0,6,0,0],                             //O
		[0,6,0,0,4,0,4,3,0,3],                             //P
		[0,0,0,6,2,6,3,5,4,6,2,4,3,5,4,4,4,0,0,0],         //Q
		[0,6,0,0,4,0,4,3,0,3,1,3,4,6],                     //R
		[4,0,0,0,0,3,4,3,4,6,0,6],                         //S
		[0,0,4,0,2,0,2,6],                                 //T
		[0,0,0,6,4,6,4,0],                                 //U
		[0,0,2,6,4,0],                                     //V
		[0,0,0,6,2,4,4,6,4,0],                             //W
		[0,0,4,6,2,3,4,0,0,6],                             //X
		[0,0,2,2,4,0,2,2,2,6],                             //Y
		[0,0,4,0,0,6,4,6]                                  //Z
	],

	NUMBERS: [
		[0,0,0,6,4,6,4,0,0,0],                             //0
		[2,0,2,6],                                         //1
		[0,0,4,0,4,3,0,3,0,6,4,6],                         //2
		[0,0,4,0,4,3,0,3,4,3,4,6,0,6],                     //3
		[0,0,0,3,4,3,4,0,4,6],                             //4
		[4,0,0,0,0,3,4,3,4,6,0,6],                         //5
		[0,0,0,6,4,6,4,3,0,3],                             //6
		[0,0,4,0,4,6],                                     //7
		[0,3,4,3,4,6,0,6,0,0,4,0,4,3],                     //8
		[4,3,0,3,0,0,4,0,4,6],                             //9
	]
};
var AsteroidSize = 8; 


var GameState = State.extend({

	init: function(game) {
		this._super(game);

		this.canvasWidth = game.canvas.ctx.width;
		this.canvasHeight = game.canvas.ctx.height;

		this.ship = new Ship(Points.SHIP, Points.FLAMES, 2, 0, 0);
		this.ship.maxX = this.canvasWidth;
		this.ship.maxY = this.canvasHeight;

		this.lives = 3;
		this.lifepolygon = new Polygon(Points.SHIP);
		this.lifepolygon.scale(1.5);
		this.lifepolygon.rotate(-Math.PI/2);
		this.gameOver = false;

		this.score = 0;

		this.lvl = 0;

		this.generateLvl();

	},

	generateLvl: function() {
		var num = Math.round(10 * Math.atan(this.lvl/25)) + 3;

		this.ship.x = this.canvasWidth/2;
		this.ship.y = this.canvasHeight/2;
		
		this.bullets = [];
		this.asteroids = [];
		for (var i = 0; i < num; i++) {

			var n = Math.round(Math.random() * (Points.ASTEROIDS.length - 1));

			var x = 0, y = 0;
			if (Math.random() >  0.5) {
				x = Math.random() * this.canvasWidth;
			} else {
				y = Math.random() * this.canvasHeight;
			}

			var astr = new Asteroid(Points.ASTEROIDS[n], AsteroidSize, x, y);
			astr.maxX = this.canvasWidth;
			astr.maxY = this.canvasHeight;
		
			this.asteroids.push(astr);

		}
	},

	handleInputs: function(input) {

		if (!this.ship.visible) {
			if (input.isPressed("spacebar")) {
				if (this.gameOver) {
					this.game.nextState = States.END;
					this.game.stateVars.score = this.score;
					return;	
				}
				this.ship.visible = true;
			}
			return;
		}

		if(input.isDown("right")) {
			this.ship.rotate(0.06);
		}
		if(input.isDown("left")) {
			this.ship.rotate(-0.06);
		}
		if(input.isDown("up")) {
			this.ship.addVel();
		}

		if (input.isPressed("spacebar")) {
			this.bullets.push(this.ship.shoot());
		}
	},

	update: function() {
		for (var i = 0, len = this.asteroids.length; i < len; i++) {
			var a = this.asteroids[i];
			a.update();

			if (this.ship.collide(a)) {
				this.ship.x = this.canvasWidth/2;
				this.ship.y = this.canvasHeight/2;
				this.ship.vel = {
					x: 0,
					y: 0
				};
				this.lives--;
				if (this.lives <= 0) {
					this.gameOver = true;
				}
				this.ship.visible = false;
			}

			for (var j = 0, len2 = this.bullets.length; j < len2; j++) {
				var b = this.bullets[j];
				
				if (a.hasPoint(b.x, b.y)) {
					this.bullets.splice(j, 1);
					len2--;
					j--;

					switch (a.size) {
						case AsteroidSize:
							this.score += 20;
							break;
						case AsteroidSize/2:
							this.score += 50;
							break;
						case AsteroidSize/4:
							this.score += 100;
							break; 
					}

					if  (a.size > AsteroidSize/4) {
						for (var k = 0; k < 2; k++) {
							var n = Math.round(Math.random() * (Points.ASTEROIDS.length - 1));

							var astr = new Asteroid(Points.ASTEROIDS[n], a.size/2, a.x, a.y);
							astr.maxX = this.canvasWidth;
							astr.maxY = this.canvasHeight;
						
							this.asteroids.push(astr);
							len++;
						}
					}
					this.asteroids.splice(i, 1);
					len--; 
					i--;
				}
			}
		}
		for (var i = 0, len = this.bullets.length; i < len; i++) {
			var b = this.bullets[i];
			b.update();

			if (b.shallRemove) {
				this.bullets.splice(i, 1);
				len--;
				i--;
			}
		}
		this.ship.update();

		if (this.asteroids.length === 0) {
			this.lvl++;
			this.generateLvl();
		}
		
	},

	render: function(ctx) {
		ctx.clearAll();

		ctx.vectorText(this.score, 3, 35, 15);
		for (var i = 0; i < this.lives; i++) {
			ctx.drawPolygon(this.lifepolygon, 40+15*i, 50);
		}

		for (var i = 0, len = this.asteroids.length; i < len; i++) {
			this.asteroids[i].draw(ctx);
		}
		for (var i = 0, len = this.bullets.length; i < len; i++) {
			this.bullets[i].draw(ctx);
			
		}

		if (this.gameOver) {
			ctx.vectorText("Game Over", 4, null, null);
		}
		this.ship.draw(ctx);
	}
});











