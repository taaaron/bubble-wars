import animate;
import ui.View as View;
import ui.ImageView as ImageView;
import ui.resource.Image as Image;
import ui.ViewPool as ViewPool;
import math.geom.Point as Point;

import src.gameObjects.Bubble as Bubble;

var shooterImg = new Image({url: 'resources/images/gameObjects/shooter.png'});
var redBubbleImg = new Image({url: 'resources/images/gameObjects/bubble_red.png'}),
	blueBubbleImg = new Image({url: 'resources/images/gameObjects/bubble_blue.png'}),
	yellowBubbleImg = new Image({url: 'resources/images/gameObjects/bubble_yellow.png'});
var dividedScale = 2.5;
var shooterAngleAdjust = Math.PI / 3.6;

exports = Class(View, function (supr) {
	this.init = function (opts) {
		opts = merge(opts, {
			tag: 'Shooter',
			x: GLOBAL.BASE_WIDTH_CENTER - (shooterImg.getWidth() / dividedScale) / 2,
			y: GLOBAL.BASE_HEIGHT * GLOBAL.BOARD_SCALE,
			width:	shooterImg.getWidth() / dividedScale, //TODO: UPDATE THESE VALUES
			height: shooterImg.getHeight() / dividedScale,
			centerAnchor: true,
			centerX: true,
			centerY: true
		});

		supr(this, 'init', [opts]);

		this.bubbleViewPool = new ViewPool({
			ctor: Bubble,
			initCount: 15,
			initOpts: {
				superview: this,
				type: GLOBAL.BUBBLE_TYPES.RED,
				isFromPool: true
			}
		});

		this.loadedBubbles = {
			[GLOBAL.BUBBLE_TYPES.RED]: null,
			[GLOBAL.BUBBLE_TYPES.BLUE]: null,
			[GLOBAL.BUBBLE_TYPES.YELLOW]: null
		};

		this.build();
	};

	this._getBubbleSpawnLocation = function(bubbleType) {
		var x, y, r;

		switch(bubbleType) {
			case GLOBAL.BUBBLE_TYPES.RED:
				x = GLOBAL.getViewCenterX(this) - (GLOBAL.BUBBLE_WIDTH / 2);
				y = 0;
				r = 0;
				break;
			case GLOBAL.BUBBLE_TYPES.BLUE:
				x = GLOBAL.getViewCenterX(this) - Math.cos(Math.PI / 6) * (getViewCenterX(this) + 5);
				y = GLOBAL.getViewCenterY(this) + Math.sin(Math.PI / 6) * (getViewCenterY(this)) - Math.sin(Math.PI / 6) * (GLOBAL.BUBBLE_WIDTH * 1.5);
				r = 0;
				break;
			case GLOBAL.BUBBLE_TYPES.YELLOW:
				x = GLOBAL.getViewCenterX(this) + Math.cos(Math.PI / 6) * (getViewCenterX(this)) - Math.sin(Math.PI / 6) * (GLOBAL.BUBBLE_WIDTH * 1.85);
				y = GLOBAL.getViewCenterY(this) + Math.sin(Math.PI / 6) * (getViewCenterY(this)) - Math.sin(Math.PI / 6) * (GLOBAL.BUBBLE_WIDTH * 1.5);
				r = 0;
		}
		return new Point({x: x, y: y, r: r});
	};

	this._loadRedBubble = function() {
		this._redBubble = this.bubbleViewPool.obtainView();

		var spawnLocation = this._getBubbleSpawnLocation(GLOBAL.BUBBLE_TYPES.RED);
		var opts = merge(spawnLocation, {
			superview: this,
			image: redBubbleImg,
			type: GLOBAL.BUBBLE_TYPES.RED,
			centerAnchored: true,
			zIndex: 1
		});

		this._redBubble.updateOpts(opts);
		this._redBubble.type = GLOBAL.BUBBLE_TYPES.RED;
		this.loadedBubbles[GLOBAL.BUBBLE_TYPES.RED] = this._redBubble;
	};

	this._loadBlueBubble = function() {
		this._blueBubble = this.bubbleViewPool.obtainView();

		var spawnLocation = this._getBubbleSpawnLocation(GLOBAL.BUBBLE_TYPES.BLUE);
		var opts = merge(spawnLocation, {
			superview: this,
			image: blueBubbleImg,
			type: GLOBAL.BUBBLE_TYPES.BLUE,
			centerAnchored: true,
			zIndex: 1
		});

		this._blueBubble.updateOpts(opts);
		this._blueBubble.type = GLOBAL.BUBBLE_TYPES.BLUE;
		this.loadedBubbles[GLOBAL.BUBBLE_TYPES.BLUE] = this._blueBubble;
	};

	this._loadYellowBubble = function() {
		this._yellowBubble = this.bubbleViewPool.obtainView();

		var spawnLocation = this._getBubbleSpawnLocation(GLOBAL.BUBBLE_TYPES.YELLOW);
		var opts = merge(spawnLocation, {
			superview: this,
			image: yellowBubbleImg,
			type: GLOBAL.BUBBLE_TYPES.YELLOW,
			centerAnchored: true,
			zIndex: 1
		});

		this._yellowBubble.updateOpts(opts);
		this._yellowBubble.type = GLOBAL.BUBBLE_TYPES.YELLOW;
		this.loadedBubbles[GLOBAL.BUBBLE_TYPES.YELLOW] = this._yellowBubble;
	};

	this._rotateShooter = function() {
		if(this._animator.hasFrames())
			this._animator.commit();

		var rotation = this.style.r + ((2 * Math.PI) / 3);
		this._animator.then({r: rotation}, 300, animate.easeInOut);
		this.getSuperview().switchAmmo(); //TODO: switch getSuperview to getParent and then search by tag
	};

	this._reloadAmmo = function(ammoType) {
		if(this.getSuperview().ammo[ammoType] > 0)
		{
			switch(ammoType) {
				case GLOBAL.BUBBLE_TYPES.RED:
					this._loadRedBubble();
					break;
				case GLOBAL.BUBBLE_TYPES.BLUE:
					this._loadBlueBubble();
					break;
				case GLOBAL.BUBBLE_TYPES.YELLOW:
					this._loadYellowBubble();
			}
		}
	};

	this.releaseBubbleView = function(bubble) {
		this.bubbleViewPool.releaseView(bubble);
	};

	this.shootBubble = function(ammoType, positions, gridSpace, gameController) {
		//play sound
		var loadedBubble = this.loadedBubbles[ammoType];

		this.getSuperview().updateAmmo(ammoType, -1);
		loadedBubble.updateOpts({
			superview: this.getSuperview(),
			x: loadedBubble.getPosition(this.getSuperview()).x,
			y: loadedBubble.getPosition(this.getSuperview()).y
		});
		for(var position of positions) {
			//Keep bubble from going off screen
			position.x = position.x > GLOBAL.BASE_WIDTH - GLOBAL.BUBBLE_WIDTH ? GLOBAL.BASE_WIDTH - GLOBAL.BUBBLE_WIDTH : position.x;
			loadedBubble.animator.then({x: position.x, y: position.y}, 150, 'easeOutCubic')
		}
		loadedBubble.animator.then(bind(this, function() {
			gameController.snapBubble(gridSpace.bubbleCol, gridSpace.bubbleRow, loadedBubble);
			this._reloadAmmo(ammoType);
		}));
	};

	this.build = function () {
		this._shooterView = new ImageView({
			superview: this,
			image: shooterImg,
			x: 0,
			y: 0,
			r: shooterAngleAdjust,
			width: this.style.width,
			height: this.style.height,
			zIndex: 2,
			centerAnchor: true
		});

		this._loadRedBubble();
		this._loadBlueBubble();
		this._loadYellowBubble();

		/* Create an animator object for shooter.
		 */
		this._animator = animate(this);

		this._shooterView.on('InputSelect', bind(this, function () {
			console.log('clicked!');
			//play sound
			this._rotateShooter();
		}));

		console.log(this);
	};
});
