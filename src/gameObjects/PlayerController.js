import ui.View as View;
import ui.GestureView as GestureView;
import math.geom.Rect as Rect;

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
		this.ammoType = GLOBAL.BUBBLE_TYPES.RED;

		this.isShootActive = false;

		this.build();
	};

	this.build = function () {
		this.uiAmmo;
		this.uiHP;

		this.shooter = new Shooter({
			superview: this,
			zIndex: 2
		});

		this.gestureView = new GestureView({
			superview: this,
			swipeMagnitude: 150,
			width: GLOBAL.BASE_WIDTH,
			height: GLOBAL.BASE_HEIGHT * GLOBAL.BOARD_SCALE,
			zIndex: 1
		});

		this._leftBound = new Rect(0, 0, 10, GLOBAL.BASE_HEIGHT);
		this._rightBound = new Rect(GLOBAL.BASE_WIDTH - 10, 0, 10, GLOBAL.BASE_HEIGHT);

		this.gestureView.on('InputStart', bind(this, function(event, point) {
			console.log('Finger Down');
			this.isShootActive = true;
			//Draw ray to calculate where bubble will go
			this._aimVector = new Vec2D();
		}));

		this.gestureView.on('InputOut', bind(this, function() {
			console.log('Finger Out of range or up');
			
			//SHOOT only if isShootActive = true
			this.isShootActive = false; //Only do this after a successful shot
		}));

		this.gestureView.on('DragSingle', bind(this, function() {
			console.log('Drag Single');
			//if overlap with location of shooter then stop working. MAke sure not to shoot. Turn isShootActive to false
			//Update ray of where bubble will go
		}));

		this.shooter.on('InputOver', bind(this, function() {
			console.log('Over Shooter');
		}));

		this.shooter.on('InputMove', bind(this, function() {
			console.log('Over Shooter moving');
		}));
	};
});
