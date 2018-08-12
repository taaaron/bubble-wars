import ui.View as View;
import ui.GestureView as GestureView;
import ui.ImageView as ImageView;
import ui.ImageScaleView as ImageScaleView;
import ui.resource.Image as Image;
import math.geom.Rect as Rect;
import math.geom.Line as Line;
import math.geom.intersect as intersect;

import src.gameObjects.Shooter as Shooter;
import src.utils as utils;

var playerLaserImg = new Image({url: 'resources/images/particles/player_laser.png'});

exports = Class(View, function (supr) {
	this.init = function (opts) {
		opts = merge(opts, {
			tag: 'PlayerController',
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

		this._shooterAbsPos = {
			x: GLOBAL.BASE_WIDTH / 2,
			y: GLOBAL.BASE_HEIGHT * GLOBAL.BOARD_SCALE
		}; //Needed to be hardcoded because was getting odd behavior from this.shooter.getPosition()

		this._wallAngleL = utils.getAngle(this._shooterAbsPos, {x: 0, y: 0});
		this._wallAngleR = utils.getAngle(this._shooterAbsPos, {x: GLOBAL.BASE_WIDTH, y: GLOBAL.BASE_HEIGHT});

		this.build();
	};

	this._adjustXForShooter = function(x) {
		return this._shooterAbsPos.x - x;
	};

	this._adjustYForShooter = function(y) {
		return this._shooterAbsPos.y + y;
	};

	this._buildBounceLine = function(fingerPoint) {

		//find distance between fingerPoint x and wall x. Then use ratio of x and y from _setAim to find distance of y to wall.
		//Now you have a line to wall and can extend the laser line to there if you realize that laser does not intercept any bubbles
		//Then create line with mirrored angle of current laser line form wall back into game board and see if it connects with any bubbles
		return null;
	};

	this._getReticlePos = function(aimLine) {
		//get collideBubble and then find open space for reticle to be on that bubble based on where aimLine intersects the bubble
		var collideBubble = this.getSuperview().gameController.checkBubbleCollision(aimLine);
		if(!collideBubble) {
			return null;
		}

		var collidePoint = utils.getLineCircleIntersection(aimLine, collideBubble.collisionCircle);
		console.log(collidePoint);

		var location = this.getSuperview().gameController.getOpenGridSpace(collideBubble, collidePoint);
	};

	this._buildAimLine = function(shooterPos, fingerPoint, angle) {
		//using y=mx + b if when x is 0 I get a y that is off screen then I know it hits the top of screen. Otherwise goes to side of screen
		var slope = utils.getSlope(shooterPos, fingerPoint);
		var startPoint = shooterPos;
		var endPoint;

		//If angle is between wallAngleL and wallAngleR then it will not bounce off the walls
		if(angle > this._wallAngleL && angle < this._wallAngleR) {
			var aimX;

			aimX = this._adjustXForShooter(shooterPos.y / slope);
			endPoint = {x: aimX, y: 0};
		} else {
			var aimY;

			if(fingerPoint.x < shooterPos.x * GLOBAL.SCALE) {
				aimY = this._adjustYForShooter(slope * (-shooterPos.x));
				endPoint = {x: 0, y: aimY};
			} else {
				aimY = this._adjustYForShooter(slope * (shooterPos.x));
				endPoint = {x: GLOBAL.BASE_WIDTH, y: aimY};
			}
		}

		aimLine = new Line(startPoint, endPoint);
		return aimLine;
	};

	this._setAim = function(fingerPoint) {
		var rotation = utils.getAngle(this._shooterAbsPos, fingerPoint);
		var aimLine = this._buildAimLine(this._shooterAbsPos, fingerPoint, rotation);
		var reticlePos = this._getReticlePos(aimLine);

		if(reticlePos) {

		}


		//check if collision with any bubbles. If yes, then draw fake bubble at nearest colliding bubble. 
		//If no then check bounce aim and do collision detection on bounce laser

		this._aimLaserView.updateOpts({
			x: aimLine.end.x,
			y: aimLine.end.y,
			r: rotation,
			width: 10,
			height: aimLine.getLength(),
			visible: true
		});
	};

	this._checkInputWithinBounds = function(point) {
		return point.x >= 0 && point.x <= this.gestureView.style.width ? (
			point.y >= 0 && point.y <= this.gestureView.style.height ? true : false
		) : false;
	};

	this.build = function () {
		this.shooter = new Shooter({
			superview: this,
			zIndex: 2
		});

		this._reticleView = new ImageView({
			superview: this,
			image: playerLaserImg,
			width: GLOBAL.BUBBLE_WIDTH,
			height: GLOBAL.BUBBLE_WIDTH,
			visible: false
		});

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

		this._bounceLaserView = new ImageScaleView({
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
			console.log('point', point);
			this.isShootActive = true;
			//Draw ray to calculate where bubble will go
			this._setAim(point);
		}));

		/*
		Finger Drag Event
		*/
		this.gestureView.on('Drag', bind(this, function(startEvt, dragEvt, delta) {
			//if overlap with location of shooter then stop working. MAke sure not to shoot. Turn isShootActive to false
			//Update ray of where bubble will go

			var point = {x: dragEvt.srcPt.x / GLOBAL.SCALE, y: dragEvt.srcPt.y / GLOBAL.SCALE};

			if(this._checkInputWithinBounds(point)) {
				this.isShootActive = true;
				this._setAim(point);
			} else {
				this._aimLaserView.style.visible = false;
				this.isShootActive = false;
			}
		}));

		/*
		Finger Drag Stop Event
		*/
		this.gestureView.on('DragStop', bind(this, function() {
			console.log('Drag Stop');
			this._aimLaserView.style.visible = false;
			this.isShootActive = false;
		}));
	};
});
