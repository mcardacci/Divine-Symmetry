var EndState = State.extend({

	init: function(game) {
		this._super(game);

		this.hasEnterName = false;
		this.nick = "no name";
		this.score = game.stateVars.score;

		this.hiscores = [
			["MENDAX", 2000],
			["Ziggy", 9999],
			["GROOT", 3000],
			["Decker", 10000],
			["noname", 1000]
		];

		this.namefield = document.getElementById("namefield");
		this.namefield.value = this.nick;
		this.namefield.focus();
		this.namefield.select();
	},

	handleInputs: function(input) {
		if (this.hasEnterName) {
			if (input.isPressed("spacebar")) {
				this.game.nextState = States.MENU;
			}
		} else {
			if (input.isPressed("enter")) {
				this.hasEnterName = true;
				this.namefield.blur();
				this.nick = this.nick.replace(/[^a-zA-Z0-9\s]/g, "");
				this.hiscores.push([this.nick, this.score]);
				

				this.hiscores.sort(function(a, b) {
					return b[1] - a[1];
				});
			}
		}
	},

	update: function() {
		if (!this.hasEnterName) {
			this.namefield.focus();

			if (this.nick === this.namefield.value){
				return;
			}
			this.namefield.value = this.namefield.value.replace(/[^a-zA-Z0-9\s]/g, "");
			this.nick = this.namefield.value;
		}

	},

	render: function(ctx) {
		ctx.clearAll();

		if (this.hasEnterName) {


			ctx.vectorText("Hi Score", 3, null, 130);
			for (var i = 0, len = this.hiscores.length; i < len; i++) {

				var hs = this.hiscores[i];
				ctx.vectorText(hs[0], 2, 200, 200+25*i);
				ctx.vectorText(hs[1], 2, 320, 200+25*i, 10);
			}
			ctx.vectorText("press space to continue", 1, 200, 350);
		} else {
			ctx.vectorText("Thanks for playing", 4, null, 100);
			ctx.vectorText("nick", 2, null, 180);
			ctx.vectorText(this.nick, 3, null, 220);
			ctx.vectorText(this.score, 3, null, 300);
		}
	}
});






