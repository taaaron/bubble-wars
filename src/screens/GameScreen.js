import ui.View as View;

import src.gameObjects.PlayerController as PlayerController;
import src.gameObjects.GameController as GameController;
import src.uiComponents.UIController as UIController;
import src.uiComponents.Hud as Hud;

exports = Class(View, function (supr) {
	this.init = function (opts) {
		opts = merge(opts, {
			tag: 'GameScreen',
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

		this.uiController = new UIController({
			superview: this,
			x: 0,
			y: 0,
			zIndex: 4
		});

		this.hudView = new Hud({
            superview: this,
            x: 0,
			y: GLOBAL.BASE_HEIGHT * GLOBAL.HUD_SCALE,
			zIndex: 3
        });

		this.gameController.on('Victory', bind(this, function() {
			GC.app.audioManager.play('victory');
			console.log('victory');
			this.uiController.showVictory();
		}));

		this.playerController.on('Switch Ammo', bind(this, function() {
			GC.app.audioManager.play('shooterRotate');
			this.hudView.ammoView.moveBacking(this.playerController.ammoType);
		}));

		this.playerController.on('Update Ammo', bind(this, function() {
			this.hudView.ammoView.updateAmmoCounts(this.playerController.ammo);
		}));

		this.hudView.on('Open Menu', bind(this, function() {
			GC.app.audioManager.play('buttonClick');
			this.uiController.showMenu();
		}))
    };
});