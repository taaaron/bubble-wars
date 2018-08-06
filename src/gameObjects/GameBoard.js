import ui.View as View;
import ui.resource.Image as Image;

import src.gameObjects.Bubble as Bubble;

var layout = JSON.parse(CACHE['resources/data/level1.json']).layout;
var redBubbleImg = new Image({url: "resources/images/gameObjects/bubble_red.png"}),
	blueBubbleImg = new Image({url: "resources/images/gameObjects/bubble_blue.png"}),
    yellowBubbleImg = new Image({url: "resources/images/gameObjects/bubble_yellow.png"});

exports = Class(View, function(supr) {
    this.init = function(opts) {
        opts = merge(opts, {
            width: GLOBAL.BASE_WIDTH,
            height: GLOBAL.BASE_HEIGHT * GLOBAL.BOARD_SCALE,
            layoutWidth: 90
        });

        supr(this, 'init', opts);

        this.bubbleGrid = [];

        this.build();
    }

    this._spawnBubble = function(identifier, x, y) {
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

        // var bubble = new Bubble({
        //     superview: this,
        //     type: type,
        //     image: image,
        //     x: x * image.getWidth(),
        //     y: y * image.getHeight()
        // });

        // return bubble;
    };

    this.build = function() {
        // for(var x = 0; x < layout.length; x++){
        //     var row = [];
        //     for(var y = 0; y < layout[x].length; y++) {
        //         if(layout[x][y] !== 'e') {
        //             row.push(this._spawnBubble(layout[x][y], x, y));
        //         }
        //     }
        //     this.bubbleGrid.push(row);
        // }

        // console.log(this.bubbleGrid);

        var bubble = new Bubble({
            superview: this,
            type: GLOBAL.BUBBLE_TYPES.RED,
            image: redBubbleImg,
            x: 0,
            y: 0
        });
    };
});