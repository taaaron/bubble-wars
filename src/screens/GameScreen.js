import ui.View as View;

import src.gameObjects.PlayerController as PlayerController;
import src.gameObjects.GameController as GameController;

exports = Class(View, function (supr) {
	this.init = function (opts) {
		opts = merge(opts, {
			id: 'GameScreen',
			x: 0,
			y: 0,
			width: GLOBAL.BASE_WIDTH,
			height: GLOBAL.BASE_HEIGHT,
		});

		supr(this, 'init', [opts]);

		this.build();
    };

    this.build = function() {
		this.playerController = new PlayerController({
			superview: this,
			x: 0,
			y: 0,
			zIndex: 2
		});
		
		this.gameController = new GameController({
			superview: this,
			x: 0,
			y: 0,
			zIndex: 1
		});
    };
});