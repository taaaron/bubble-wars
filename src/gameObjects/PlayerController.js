import ui.View as View;
import ui.GestureView as GestureView;

import src.gameObjects.Shooter as Shooter;

exports = Class(View, function (supr) {
	this.init = function (opts) {
		opts = merge(opts, {
			id: 'PlayerController',
			infinite: true
		});

		supr(this, 'init', [opts]);

		this.ammo = {
			RED: 25,
			BLUE: 25,
			YELLOW: 25
		};
		this.maxHP = 100;
		this.currHP = 100;
		this.ammoType = global.BUBBLE_TYPES.RED;

		this.build();
	};

	this.build = function () {
		this.shooter = new Shooter();

		this.uiAmmo;
		this.uiHP;

		this.gestureView = new GestureView();

		gestureView.on('FingerDown', function() {
			//Draw ray to calculate where bubble will go
		});

		gestureView.on('FingerUp', function() {
			//SHOOT
		});

		gestureView.on('DragSingle', function() {
			//Update ray of where bubble will go
		});
	};
});
