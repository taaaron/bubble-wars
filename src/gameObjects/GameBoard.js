import animate;
import ui.View as View;
import ui.resource.Image as Image;

import src.gameObjects.Bubble as Bubble;
import src.gameObjects.BubbleRow as BubbleRow;
import src.gameObjects.Enemy as Enemy;

var layout = JSON.parse(CACHE['resources/data/level1.json']).layout;
var redBubbleImg = new Image({url: "resources/images/gameObjects/bubble_red.png"}),
	blueBubbleImg = new Image({url: "resources/images/gameObjects/bubble_blue.png"}),
    yellowBubbleImg = new Image({url: "resources/images/gameObjects/bubble_yellow.png"});

exports = Class(View, function(supr) {
    this.init = function(opts) {
        opts = merge(opts, {
            tag: 'GameBoard',
            width: GLOBAL.BASE_WIDTH,
            height: GLOBAL.BASE_HEIGHT * GLOBAL.BOARD_SCALE
        });

        supr(this, 'init', [opts]);

        this.bubbleGrid = [];
        this.enemies = new Set();

        if(layout.length > GLOBAL.MAX_ROWS_ON_SCREEN) {
            this.style.y = (GLOBAL.MAX_ROWS_ON_SCREEN - layout.length) * GLOBAL.BUBBLE_WIDTH * this.getRowYModifier();
        }

        this.build();
    }

    this._spawnBubble = function(identifier, x, y, row) {
        var type, image;

        if(identifier.includes(GLOBAL.BUBBLE_IDS.RED)) {
            type = GLOBAL.BUBBLE_TYPES.RED;
            image = redBubbleImg;
        } else if(identifier.includes(GLOBAL.BUBBLE_IDS.BLUE)) {
            type = GLOBAL.BUBBLE_TYPES.BLUE;
            image = blueBubbleImg;
        } else if(identifier.includes(GLOBAL.BUBBLE_IDS.YELLOW)) {
            type = GLOBAL.BUBBLE_TYPES.YELLOW;
            image = yellowBubbleImg;
        }

        var bubble = new Bubble({
            superview: row,
            type: type,
            image: image,
            x: x * GLOBAL.BUBBLE_WIDTH,
            y: 0,
            bubbleRow: y,
            bubbleCol: x
        });

        if(identifier.includes(GLOBAL.BUBBLE_IDS.ENEMY)) {
            var enemy = new Enemy({
                superview: bubble,
            });

            this.enemies.add(enemy);

            bubble.updateOpts({
                zIndex: 2
            });
            bubble.enemy = enemy;

            bubble.getSuperview().updateOpts({
                zIndex: 2
            });
        }

        return bubble;
    };

    this.getRowYModifier = function() {
        return (4/5);
    };

    this.getGridSizeX = function() {
        return this.bubbleGrid[0].bubbles.length;
    };

    this.getGridSizeY = function() {
        return this.bubbleGrid.length;
    }

    this.updateAllCollisionCircles = function() {
        for(var row of this.bubbleGrid) {
            for(var bubble of row.bubbles) {
                if(bubble)
                    bubble.updateCollisionCircleWithScale();
            }
        }
    };

    this.showMoreBoard = function() {
        if(this.style.y !== 0) {
            var nullCount = 0;
            var newY;
    
            for(var i = layout.length - 1; i > -1; i--) {
                if(this.bubbleGrid[i].isRowNull()) {
                    nullCount++;
                } else {
                    break;
                }
            }
    
            if(layout.length - nullCount > GLOBAL.MAX_ROWS_ON_SCREEN) {
                newY = (GLOBAL.MAX_ROWS_ON_SCREEN - layout.length + nullCount - 1) * GLOBAL.BUBBLE_WIDTH * this.getRowYModifier();
            } else {
                newY = 0;
            }
            console.log(nullCount);
            console.log(newY);
    
            this._animator.then({y: newY}, 300).then(bind(this, function() {
                this.updateAllCollisionCircles();
            }));
        }  
    };

    this.build = function() {
        for(var y = 0; y < layout.length; y++){
            var row = new BubbleRow({
                superview: this,
                x: y % 2 === 1 ? 0 : GLOBAL.BUBBLE_WIDTH / 2,
                y: y * GLOBAL.BUBBLE_WIDTH * this.getRowYModifier(),
                width: GLOBAL.BUBBLE_WIDTH * GLOBAL.MAX_GRID_SIZE_X,
                height: GLOBAL.BUBBLE_WIDTH
            });

            for(var x = 0; x < layout[y].length; x++) {
                if(layout[y][x] !== GLOBAL.BUBBLE_IDS.NULL) {
                    row.bubbles.push(this._spawnBubble(layout[y][x], x, y, row));
                } else {
                    row.bubbles.push(null);
                }
            }
            this.bubbleGrid.push(row);
        }

        /* Create an animator object for GameBoard.
		 */
		this._animator = animate(this);
    };
});