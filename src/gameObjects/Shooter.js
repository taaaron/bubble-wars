import animate;
import ui.View as View;
import ui.ImageView as ImageView;
import ui.resource.Image as Image;

import src.gameObjects.Bubble as Bubble;

var shooterImg = new Image({url: "resources/images/shooter.png"});

exports = Class(View, function (supr) {
	this.init = function (opts) {
		opts = merge(opts, {
			width:	shooterImg.getWidth() + 100, //TODO: UPDATE THESE VALUES
			height: shooterImg.getHeight() + 100
		});

		supr(this, 'init', [opts]);

		this.bubbleViewPool = new ViewPool({
			ctor: Bubble,
			initCount: 15,
			initOpts: {
				superview: this,
				type: global.BUBBLE_TYPES.RED
			}
		});

		this.build();
	};

	this._loadRedBubble = function() {

	};

	this._loadBlueBubble = function() {

	};

	this._loadYellowBubble = function() {

	};

	this.shootBubble = function() {

	};

	this.on('InputSelect', bind(this, function () {
		//play sound
		//rotate shooterView
		//set currAmmo to correct color
	}));

	this.build = function () {
		this._shooterView = new ui.ImageView({
			superview: this,
			image: shooterImg,
			x: 0,
			y: 0,
			width: shooterImg.getWidth(),
			height: shooterImg.getHeight()
		});

		this.loadBlueBubble();
		this.loadBlueBubble();
		this.loadYellowBubble();

		/* Create an animator object for shooter.
		 */
		this._animator = animate(this._shooterView);
		this._interval = null;
	};
});
