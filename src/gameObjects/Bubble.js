import animate;
import ui.ImageView as ImageView;
import ui.resource.Image as Image;
import math.geom.Circle as Circle;
import math.geom.Point as Point;

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
			bubbleCol: 0,
			isFromPool: false
		});

		supr(this, 'init', [opts]);

		this.type = opts.type;
		this.bubbleRow = opts.bubbleRow;
		this.bubbleCol = opts.bubbleCol;
		this.isFromPool = opts.isFromPool;

		this.build();
	};

	this.determineNeighborOffsets = function() {
		var determinedOffsets = [];

		if(this.bubbleRow % 2 === 1) {
			determinedOffsets = [
				{x: 1, y: 0},
				{x: -1, y: 0},
				{x: 0, y: 1},
				{x: 0, y: -1},
				{x: -1, y: 1},
				{x: -1, y: -1},
			];
		} else {
			determinedOffsets = [
				{x: 1, y: 0},
				{x: -1, y: 0},
				{x: 0, y: 1},
				{x: 0, y: -1},
				{x: 1, y: 1},
				{x: 1, y: -1},
			];
		}

		return determinedOffsets;
	};

	this.updateCollisionCircle = function() {
		var centerX = this.getPosition().x - adjustForImg + (GLOBAL.BUBBLE_WIDTH / 2);
		var centerY = this.getPosition().y - adjustForImg + (GLOBAL.BUBBLE_WIDTH / 2);
		this.collisionCircle = new Circle(centerX, centerY, GLOBAL.BUBBLE_WIDTH / 2);
	};

	this.updateCollisionCircleWithScale = function() {
		var scaledPos = new Point(this.getPosition()).scale(1/GLOBAL.SCALE);
		var centerX = scaledPos.x - adjustForImg + (GLOBAL.BUBBLE_WIDTH / 2);
		var centerY = scaledPos.y - adjustForImg + (GLOBAL.BUBBLE_WIDTH / 2);
		this.collisionCircle = new Circle(centerX, centerY, GLOBAL.BUBBLE_WIDTH / 2);
	};

	this.build = function () {
		this.updateCollisionCircle();
		this.neighborOffsets = this.determineNeighborOffsets();

		/* Create an animator object for bubble.
		 */
		this.animator = animate(this);
	};
});
