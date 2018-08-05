import animate;
import ui.View as View;
import ui.ImageView as ImageView;
import ui.resource.Image as Image;

var redBubbleImg = new Image({url: "resources/images/bubble_red.png"}),
	blueBubbleImg = new Image({url: "resources/images/bubble_blue.png"}),
	yellowBubbleImg = new Image({url: "resources/images/bubble_yellow.png"});

exports = Class(View, function (supr) {

	this.init = function (opts) {
		opts = merge(opts, {
			width:	redBubbleImg.getWidth(),
			height: redBubbleImg.getHeight()
		});

		supr(this, 'init', [opts]);

		switch(opts.type) {
			case global.BUBBLE_TYPES.RED:
				this._imageToLoad = redBubbleImg;
				this.type = opts.type;
				break;
			case global.BUBBLE_TYPES.BLUE:
				this._imageToLoad = blueBubbleImg;
				this.type = opts.type;
				break;
			case global.BUBBLE_TYPES.YELLOW:
				this._imageToLoad = yellowBubbleImg;
				this.type = opts.type;
				break;
			default:
				this._imageToLoad = redBubbleImg;
				this.type = global.BUBBLE_TYPES.RED;
		}

		this.build();
	};

	this.build = function () {
		this._bubbleView = new ui.ImageView({
			superview: this,
			image: this._imageToLoad,
			x: 0,
			y: 0,
			autoSize: true
		});

		/* Create an animator object for bubble.
		 */
		this._animator = animate(this._bubbleView);
		this._interval = null;
	};
});
