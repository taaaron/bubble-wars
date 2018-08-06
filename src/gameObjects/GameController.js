import ui.View as View;

import src.gameObjects.GameBoard as GameBoard;

exports = Class(View, function(supr) {
    this.init = function(opts) {
        opts = merge(opts, {
            id: 'GameController',
			infinite: true
        });

        supr(this, 'init', opts);

        this.build();
    };

    this.build = function() {
        this.gameBoard = new GameBoard({
            superview: this,
            x: 0,
            y: 0
        });
    };
});