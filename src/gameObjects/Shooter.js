import animate;
import ui.View as View;
import ui.ImageView as ImageView;
import ui.resource.Image as Image;
import ui.ViewPool as ViewPool;

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
			id: 'Shooter',
			x: GLOBAL.BASE_WIDTH_CENTER - (shooterImg.getWidth() / dividedScale) / 2,
			y: GLOBAL.BASE_HEIGHT * GLOBAL.BOARD_SCALE,
			width:	shooterImg.getWidth() / dividedScale, //TODO: UPDATE THESE VALUES
			height: shooterImg.getHeight() / dividedScale,
			centerAnchor: true
		});

		supr(this, 'init', [opts]);

		this.bubbleViewPool = new ViewPool({
			ctor: Bubble,
			initCount: 15,
			initOpts: {
				superview: this,
				type: GLOBAL.BUBBLE_TYPES.RED
			}
		});

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
				x = this.style.width - GLOBAL.BUBBLE_WIDTH - 15; //TODO: FIX THESE
				y = this.style.height - GLOBAL.BUBBLE_WIDTH - 41; //TODO: FIX THESE
				r = 0;//(2 * Math.PI) / 3; TODO: FIX THESE
				break;
			case GLOBAL.BUBBLE_TYPES.YELLOW:
				x = 15;
				y = this.style.height - GLOBAL.BUBBLE_WIDTH - 43; //TODO: FIX THESE
				r = 0;//(4 * Math.PI) / 3; TODO: FIX THESE
		}
		console.log({x: x, y: y, r: r});
		return {x: x, y: y, r: r};
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
	};

	this._setAmmo = function() {

	};

	this._rotateShooter = function() {
		if(this._animator.hasFrames())
			this._animator.commit();

		var rotation = this.style.r + ((2 * Math.PI) / 3);
		this._animator.then({r: rotation}, 300, animate.easeInOut);

		console.log(rotation);
		console.log(this.style.r);
	};

	this.shootBubble = function() {

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
			//rotate shooterView
			//set currAmmo to correct color
	
			this._rotateShooter();
		}));

		console.log(this);
	};
});
