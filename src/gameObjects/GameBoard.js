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
            height: GLOBAL.BASE_HEIGHT * GLOBAL.BOARD_SCALE,
            centerAnchor: true
        });

        supr(this, 'init', [opts]);

        this.bubbleGrid = [];
        this.enemies = new Set();

        if(layout.length > GLOBAL.MAX_ROWS_ON_SCREEN) {
            this.style.y = (GLOBAL.MAX_ROWS_ON_SCREEN - layout.length) * GLOBAL.BUBBLE_WIDTH * this.getRowYModifier();
        }

        this.build();
    }

    /*
    Spawn a bubble given an identifier, grid position, and bubbleRow parent view
    */
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

    /*
    Get y value modifier for a bubbleRow's position so that
    they fit correctly in a hex pattern on screen
    */
    this.getRowYModifier = function() {
        return (4/5);
    };

    /*
    Return length of the Grid's X axis
    */
    this.getGridSizeX = function() {
        return this.bubbleGrid[0].bubbles.length;
    };

    /*
    Return length of the Grid's Y axis
    */
    this.getGridSizeY = function() {
        return this.bubbleGrid.length;
    }

    /*
    Update the locatin of each bubble's collision circle to reflect new board position
    */
    this.updateAllCollisionCircles = function() {
        for(var row of this.bubbleGrid) {
            for(var bubble of row.bubbles) {
                if(bubble)
                    bubble.updateCollisionCircleWithScale();
            }
        }
    };

    /*
    Show more of the board on screen if too many null rows on screen
    */
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
    
            this._animator.then({y: newY}, 300).then(bind(this, function() {
                this.updateAllCollisionCircles();
            }));
        }  
    };

    /*
    Screen shake effect
    */
    this.screenShake = function() {
        this._animator.then({r: Math.PI / 100}, 75, 'easeOutElastic')
            .then({r: -Math.PI / 100}, 75, 'easeOutElastic')
            .then({r: 0}, 50, 'easeOutElastic');
    }

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

		this._animator = animate(this);
    };
});