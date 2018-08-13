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
var playerReticleImg = new Image({url: 'resources/images/gameObjects/reticle.png'});

exports = Class(View, function (supr) {
	this.init = function (opts) {
		opts = merge(opts, {
			tag: 'PlayerController',
			infinite: true
		});

		supr(this, 'init', [opts]);

		this.ammo = {
			[GLOBAL.BUBBLE_TYPES.RED]: GLOBAL.STARTING_AMMO.RED,
			[GLOBAL.BUBBLE_TYPES.BLUE]: GLOBAL.STARTING_AMMO.BLUE,
			[GLOBAL.BUBBLE_TYPES.YELLOW]: GLOBAL.STARTING_AMMO.YELLOW
		};
		this.maxHP = 100;
		this.currHP = 100;
		this.ammoType = GLOBAL.BUBBLE_TYPES.RED;

		this.isShootActive = false;
		this.firePositions = [];
		this.shotGridSpace;

		this._shooterAbsPos = {
			x: GLOBAL.BASE_WIDTH / 2,
			y: GLOBAL.BASE_HEIGHT * GLOBAL.BOARD_SCALE
		};

		this.build();
	};

	/*
	Find where aiming reticle should be positioned based on collision Point
	*/
	this._getReticlePos = function(collideBubble, collidePoint) {
		var gridSpace = null;
		var targetBubble = collideBubble;
		var visitedBubbles = [];
		
		while(gridSpace === null) {
			gridSpace = this.getSuperview().gameController.determineGridSpace(targetBubble, collidePoint);
			visitedBubbles.push(targetBubble);
			targetBubble = this.getSuperview().gameController.getNextBubble(targetBubble, collidePoint, visitedBubbles);
		}

		this.shotGridSpace = gridSpace;
		
		return this.getSuperview().gameController.getGridSpacePoint(gridSpace);
	};

	/*
	Builds aiming line for shots that will be bounced off of the side of the screen
	*/
	this._buildBounceLine = function(aimLine) {
		var gameBoardPos = this.getSuperview().gameController.gameBoard.getPosition();
		var tempLine = new Line(aimLine.end, {
			x: aimLine.end.x - (aimLine.end.x - aimLine.start.x),
			y: aimLine.end.y + (aimLine.end.y - aimLine.start.y)
		});
		var endPoint = utils.getPointOnLineY(tempLine, gameBoardPos.y);

		return new Line(tempLine.start, endPoint);
	};

	/*
	Builds initial aiming line for shots
	*/
	this._buildAimLine = function(shooterPos, fingerPoint) {
		var gameBoardPos = this.getSuperview().gameController.gameBoard.getPosition();
		var endPoint;

		var initialLine = new Line(shooterPos, fingerPoint);

		endPoint = utils.getPointOnLineY(initialLine, gameBoardPos.y);

		return new Line(shooterPos, endPoint);
	};

	/*
	Handles the building of all aiming calculations and aiming views given a fingerPoint
	*/
	this._setAim = function(fingerPoint) {
		this.firePositions = [];
		var rotation = utils.getAngle(this._shooterAbsPos, fingerPoint);
		var aimLine = this._buildAimLine(this._shooterAbsPos, fingerPoint);
		var collideBubble = this.getSuperview().gameController.getCollisionBubble(aimLine);
		var collidePoint, reticlePos, bounceLine, bounceRotation;

		//hide reticle and bounceView by default
		this._reticleView.updateOpts({
			visible: false
		});
		this._bounceLaserView.updateOpts({
			visible: false
		});

		//Does it hit a bubble? 
		if(collideBubble) {
			collidePoint = utils.getLineCircleIntersection(aimLine, collideBubble.collisionCircle);
			reticlePos = this._getReticlePos(collideBubble, collidePoint);

			this._aimLaserView.updateOpts({
				x: collidePoint.x,
				y: collidePoint.y,
				r: rotation,
				width: 10,
				height: utils.getDistance(this._shooterAbsPos, collidePoint),
				visible: true
			});

			this._reticleView.updateOpts({
				x: reticlePos.x,
				y: reticlePos.y,
				visible: true
			});

			this.firePositions.push(reticlePos);
		} else {
			//if not then does it need to bounce?
			if(utils.getLineLineIntersection(aimLine, this.leftBound) && fingerPoint.x < GLOBAL.BASE_WIDTH_CENTER) {
				//bounce off left side
				aimEnd = utils.getLineLineIntersection(aimLine, this.leftBound);
				aimLine = new Line(aimLine.start, aimEnd);
				bounceLine = this._buildBounceLine(aimLine);
				bounceRotation = utils.getAngle2(bounceLine.start, bounceLine.end) - Math.PI/2;
				collideBubble = this.getSuperview().gameController.getCollisionBubble(bounceLine);
			} else if(utils.getLineLineIntersection(aimLine, this.rightBound)  && fingerPoint.x > GLOBAL.BASE_WIDTH_CENTER) {
				//bounce off right side
				aimEnd = utils.getLineLineIntersection(aimLine, this.rightBound);
				aimLine = new Line(aimLine.start, aimEnd);
				bounceLine = this._buildBounceLine(aimLine);
				bounceRotation = utils.getAngle2(bounceLine.start, bounceLine.end) - Math.PI/2;
				collideBubble = this.getSuperview().gameController.getCollisionBubble(bounceLine);
			}

			this.firePositions.push(aimLine.end);

			if(collideBubble) {
				collidePoint = utils.getLineCircleIntersection(bounceLine, collideBubble.collisionCircle);
				reticlePos = this._getReticlePos(collideBubble, collidePoint);
				bounceLine = new Line(bounceLine.start, collidePoint);

				this._reticleView.updateOpts({
					x: reticlePos.x,
					y: reticlePos.y,
					visible: true
				});

				this.firePositions.push(reticlePos);
			} else {
				//disable shooting if no target
				this.isShootActive = false;
			}

			if(bounceLine) {
				this._bounceLaserView.updateOpts({
					x: bounceLine.start.x,
					y: bounceLine.start.y,
					r: bounceRotation,
					width: 10,
					height: bounceLine.getLength(),
					visible: true
				});
			}

			this._aimLaserView.updateOpts({
				x: aimLine.end.x,
				y: aimLine.end.y,
				r: rotation,
				width: 10,
				height: aimLine.getLength(),
				visible: true
			});
		}
	};

	/*
	Check if player input is within allowed area for aiming
	*/
	this._checkInputWithinBounds = function(point) {
		return point.x >= 0 && point.x <= this.gestureView.style.width ? (
			point.y >= 0 && point.y <= this.gestureView.style.height ? true : false
		) : false;
	};

	/*
	Defines behavior for when players lifts finger off of screen
	*/
	this._fingerUp = function() {
		var gameController = this.getSuperview().gameController;

		if(this.isShootActive && this.ammo[this.ammoType] > 0 && !this.shooter.isShooting)
			this.shooter.shootBubble(this.ammoType, this.firePositions, this.shotGridSpace, gameController);
		else
			GC.app.audioManager.play('noAmmo');

		this._aimLaserView.style.visible = false;
		this._bounceLaserView.style.visible = false;
		this._reticleView.style.visible = false;
		this.isShootActive = false;
	};

	/*
	Switch current ammo type and emit event to update UI
	*/
	this.switchAmmo = function() {
		switch(this.ammoType) {
			case GLOBAL.BUBBLE_TYPES.RED:
				this.ammoType = GLOBAL.BUBBLE_TYPES.BLUE;
				break;
			case GLOBAL.BUBBLE_TYPES.BLUE:
				this.ammoType = GLOBAL.BUBBLE_TYPES.YELLOW;
				break;
			case GLOBAL.BUBBLE_TYPES.YELLOW:
				this.ammoType = GLOBAL.BUBBLE_TYPES.RED;
		}
		this.emit('Switch Ammo');
	};

	/*
	Function to adjust ammo count and emit event to update UI
	*/
	this.updateAmmo = function(ammoType, amount) {
		this.ammo[ammoType] += amount;
		if(!this.shooter.loadedBubbles[ammoType])
			this.shooter.reloadAmmo(ammoType);

		this.emit('Update Ammo');
	};

	/*
	Function to determine if out of ammo
	*/
	this.isAmmoEmpty = function() {
		var totalAmmo = this.ammo[GLOBAL.BUBBLE_TYPES.RED] + 
						this.ammo[GLOBAL.BUBBLE_TYPES.BLUE] + 
						this.ammo[GLOBAL.BUBBLE_TYPES.YELLOW];

		if(totalAmmo <= 0)
			return true;
		else
			return false;
	};

	this.build = function () {
		this.shooter = new Shooter({
			superview: this,
			zIndex: 2
		});

		this._reticleView = new ImageView({
			superview: this,
			image: playerReticleImg,
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

		this.leftBound = new Line(
			{x: 0, y: 0},
			{x: 0, y: GLOBAL.BASE_HEIGHT}
		);
		this.rightBound = new Line(
			{x: GLOBAL.BASE_WIDTH, y: 0},
			{x: GLOBAL.BASE_WIDTH, y: GLOBAL.BASE_HEIGHT}
		);

		/*
		Finger Down Event
		*/
		this.gestureView.on('InputStart', bind(this, function(event, point) {
			this.isShootActive = true;
			this._setAim(point);
		}));

		/*
		Finger Drag Event
		*/
		this.gestureView.on('Drag', bind(this, function(startEvt, dragEvt, delta) {
			var point = {x: dragEvt.srcPt.x / GLOBAL.SCALE, y: dragEvt.srcPt.y / GLOBAL.SCALE};

			if(this._checkInputWithinBounds(point)) {
				this.isShootActive = true;
				this._setAim(point);
			} else {
				this._aimLaserView.style.visible = false;
				this._bounceLaserView.style.visible = false;
				this._reticleView.style.visible = false;
				this.isShootActive = false;
			}
		}));

		/*
		Finger Up Event
		*/
		this.gestureView.on('InputSelect', bind(this, function() {
			this._fingerUp();
		}));

		/*
		Finger Drag Stop Event
		*/
		this.gestureView.on('DragStop', bind(this, function() {
			this._fingerUp();
		}));
	};
});
