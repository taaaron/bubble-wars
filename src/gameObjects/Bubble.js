import animate;
import ui.ImageView as ImageView;
import ui.resource.Image as Image;

var redBubbleImg = new Image({url: 'resources/images/gameObjects/bubble_red.png'});

exports = Class(ImageView, function (supr) {
	this.init = function (opts) {
		opts = merge(opts, {
			width:	GLOBAL.BUBBLE_WIDTH,
			height: GLOBAL.BUBBLE_WIDTH,
			image: redBubbleImg,
			type: GLOBAL.BUBBLE_TYPES.RED
		});

		supr(this, 'init', [opts]);

		this.type = opts.type;

		this.build();
	};

	this.build = function () {
		/* Create an animator object for bubble.
		 */
		this._animator = animate(this);
	};
});
