import animate;
import ui.ImageView as ImageView;
import ui.resource.Image as Image;
import math.geom.Circle as Circle;

var redBubbleImg = new Image({url: 'resources/images/gameObjects/bubble_red.png'});
var adjustForImg = 5;

exports = Class(ImageView, function (supr) {
	this.init = function (opts) {
		opts = merge(opts, {
			tag: 'Bubble',
			width:	GLOBAL.BUBBLE_WIDTH,
			height: GLOBAL.BUBBLE_WIDTH,
			image: redBubbleImg,
			type: GLOBAL.BUBBLE_TYPES.RED,
			bubbleRow: 0,
			bubbleCol: 0
		});

		supr(this, 'init', [opts]);

		this.type = opts.type;
		this.bubbleRow = opts.bubbleRow;
		this.bubbleCol = opts.bubbleCol;

		this.build();
	};

	this.getOpenNeighborSpaces = function() {
		this.neighborArray
	};

	this._determineNeighbors = function() {
		var maxBubbleCol = this.getSuperview().getSuperview().getGridSizeX();
		var maxBubbleRow = this.getSuperview().getSuperview().getGridSizeY();
		var determinedNeighbors = [];

		if(bubbleCol % 2 === 1) {
			determinedNeighbors.push();
		}
		if(bubbleCol !== 0) {
			
		}
		if(bubbleRow !== 0) {

		}
		if(bubbleCol !== maxBubbleCol) {

		}
		if(bubbleRow !== maxBubbleRow) {

		}

	};

	this.build = function () {
		var centerX = this.getPosition().x - adjustForImg + (GLOBAL.BUBBLE_WIDTH / 2);
		var centerY = this.getPosition().y - adjustForImg + (GLOBAL.BUBBLE_WIDTH / 2);
		this.collisionCircle = new Circle(centerX, centerY, GLOBAL.BUBBLE_WIDTH / 2);

		//this.neighborArray = this._determineNeighbors();

		

		/* Create an animator object for bubble.
		 */
		this._animator = animate(this);
	};
});
