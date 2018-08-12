import ui.View as View;
import ui.resource.Image as Image;

import src.gameObjects.Bubble as Bubble;
import src.gameObjects.BubbleRow as BubbleRow;

var layout = JSON.parse(CACHE['resources/data/level1.json']).layout;
var redBubbleImg = new Image({url: "resources/images/gameObjects/bubble_red.png"}),
	blueBubbleImg = new Image({url: "resources/images/gameObjects/bubble_blue.png"}),
    yellowBubbleImg = new Image({url: "resources/images/gameObjects/bubble_yellow.png"});
console.log(redBubbleImg.getWidth());

exports = Class(View, function(supr) {
    this.init = function(opts) {
        opts = merge(opts, {
            tag: 'GameBoard',
            width: GLOBAL.BASE_WIDTH,
            height: GLOBAL.BASE_HEIGHT * GLOBAL.BOARD_SCALE
        });

        supr(this, 'init', [opts]);

        this.bubbleGrid = [];

        this.build();
    }

    this._spawnBubble = function(identifier, x, y, row) {
        var type, image;
        switch(identifier) {
            case GLOBAL.BUBBLE_IDS.RED:
                type = GLOBAL.BUBBLE_TYPES.RED;
                image = redBubbleImg;
                break;
            case GLOBAL.BUBBLE_IDS.BLUE:
                type = GLOBAL.BUBBLE_TYPES.BLUE;
                image = blueBubbleImg;
                break;
            case GLOBAL.BUBBLE_IDS.YELLOW:
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

        return bubble;
    };

    this.getRowYModifier = function() {
        return (4/5);
    };

    this.getGridSizeX = function() {
        return layout[0].length;
    };

    this.getGridSizeY = function() {
        return layout.length;
    }

    this.build = function() {
        for(var y = 0; y < layout.length; y++){
            var row = new BubbleRow({
                superview: this,
                x: y % 2 === 1 ? 0 : GLOBAL.BUBBLE_WIDTH / 2,
                y: y * (GLOBAL.BUBBLE_WIDTH * this.getRowYModifier(),
                width: GLOBAL.BUBBLE_WIDTH * this.getGridSizeX(),
                height: GLOBAL.BUBBLE_WIDTH
            });

            for(var x = 0; x < layout[y].length; x++) {
                if(layout[y][x] !== 'e') {
                    row.bubbles.push(this._spawnBubble(layout[y][x], x, y, row));
                } else {
                    row.bubbles.push(null);
                }
            }
            this.bubbleGrid.push(row);
        }

        console.log(this.bubbleGrid);
    };
});