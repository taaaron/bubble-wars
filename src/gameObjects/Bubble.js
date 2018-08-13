import animate;
import ui.ImageView as ImageView;
import ui.resource.Image as Image;
import math.geom.Circle as Circle;
import math.geom.Point as Point;
import ui.ParticleEngine as ParticleEngine;

var redBubbleImg = new Image({url: 'resources/images/gameObjects/bubble_red.png'});
var adjustForImgX = 0;
var adjustForImgY = 10;

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
		this.enemy = null;

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
		var centerX = this.getPosition().x - adjustForImgX + (GLOBAL.BUBBLE_WIDTH / 2);
		var centerY = this.getPosition().y - adjustForImgY + (GLOBAL.BUBBLE_WIDTH / 2);
		this.collisionCircle = new Circle(centerX, centerY, GLOBAL.BUBBLE_WIDTH / 2);
	};

	this.updateCollisionCircleWithScale = function() {
		var scaledPos = new Point(this.getPosition()).scale(1/GLOBAL.SCALE);
		var centerX = scaledPos.x - adjustForImgX + (GLOBAL.BUBBLE_WIDTH / 2);
		var centerY = scaledPos.y - adjustForImgY + (GLOBAL.BUBBLE_WIDTH / 2);
		this.collisionCircle = new Circle(centerX, centerY, GLOBAL.BUBBLE_WIDTH / 2);
	};

	this.shootParticles = function() {
		var particleObjects = this.pEngine.obtainParticleArray(10);
		for (var i = 0; i < 10; i++) {
		  var pObj = particleObjects[i];
		  pObj.dx = Math.random() * 100;
		  pObj.dy = Math.random() * 100;
		  pObj.ddy = 50;
		  pObj.width = 20;
		  pObj.height = 20;
		  pObj.image = 'resources/images/particles/round_red.png';
		}
		this.pEngine.emitParticles(particleObjects);
	};
	
	this.build = function () {
		this.updateCollisionCircle();
		this.neighborOffsets = this.determineNeighborOffsets();

		this.pEngine = new ParticleEngine({
			superview: this,
			width: 1,
			height: 1,
			initCount: 10
		});

		this.animator = animate(this);
	};
});
