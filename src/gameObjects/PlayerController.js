import ui.View as View;
import ui.GestureView as GestureView;
import ui.ImageScaleView as ImageScaleView;
import ui.resource.Image as Image;
import math.geom.Rect as Rect;
import math.geom.Line as Line;

import src.gameObjects.Shooter as Shooter;
import src.utils as utils;

var playerLaserImg = new Image({url: 'resources/images/particles/player_laser.png'});

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

	this._setAim = function(fingerPoint) {
		console.log(fingerPoint);
		console.log(this.shooter.getPosition());
		var rotation = utils.getAngle(this.shooter.getPosition(), fingerPoint);
		var distanceLine = new Line(this.shooter.getPosition(), fingerPoint);
		console.log(rotation);

		this._aimLaserView.updateOpts({
			x: fingerPoint.x,
			y: fingerPoint.y,
			r: rotation,
			width: 10,
			height: distanceLine.getLength() - this.shooter.style.height * 0.75,
			visible: true
		});

		console.log(this._aimLaserView.style);
	};

	this._bounceAim = function() {
		
	};

	this.build = function () {
		this.uiAmmo;
		this.uiHP;

		this.shooter = new Shooter({
			superview: this,
			zIndex: 2
		});

		var shooterPos = this.shooter.getPosition();

		this._aimLaserView = new ImageScaleView({
			superview: this,
			image: playerLaserImg,
			width: 10,
			height: 10,
			scaleMethod: '3slice',
			sourceSlices: {
				vertical: {
					top: 10, middle: 20, bottom: 10
				}
			},
			visible: false
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

		/*
		Finger Down Event
		*/
		this.gestureView.on('InputStart', bind(this, function(event, point) {
			console.log('Finger Down');
			this.isShootActive = true;
			//Draw ray to calculate where bubble will go
			this._setAim(point);
		}));

		/*
		Finger Out of Range of Up Event
		*/
		this.gestureView.on('InputOut', bind(this, function() {
			console.log('Finger Out of range or up');
			
			//SHOOT only if isShootActive = true
			this.isShootActive = false; //Only do this after a successful shot
		}));

		/*
		Finger Single Drag Event
		*/
		this.gestureView.on('DragSingle', bind(this, function() {
			console.log('Drag Single');
			//if overlap with location of shooter then stop working. MAke sure not to shoot. Turn isShootActive to false
			//Update ray of where bubble will go
		}));

		/*
		Click on Shooter Event
		*/
		this.shooter.on('InputOver', bind(this, function() {
			console.log('Over Shooter');
		}));

		/*
		Finger Moves while over Shooter Event
		*/
		this.shooter.on('InputMove', bind(this, function() {
			console.log('Over Shooter moving');
		}));
	};
});
