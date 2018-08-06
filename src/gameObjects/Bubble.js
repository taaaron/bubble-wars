import animate;
import ui.ImageView as ImageView;
import ui.resource.Image as Image;

var redBubbleImg = new Image({url: "resources/images/gameObjects/bubble_red.png"})

exports = Class(ImageView, function (supr) {
	this.init = function (opts) {
		opts = merge(opts, {
			width:	redBubbleImg.getWidth(),
			height: redBubbleImg.getHeight(),
			image: redBubbleImg,
			type: GLOBAL.BUBBLE_TYPES.RED,
			autoSize: true
		});

		supr(this, 'init', [opts]);

		this.type = opts.type;

		this.build();
	};

	this.build = function () {
		/* Create an animator object for bubble.
		 */
		this._animator = animate(this);
		this._interval = null;
	};
});
