import ui.View as View;
import math.geom.intersect as intersect;
import math.geom.Line as Line;
import math.geom.Point as Point;

import src.gameObjects.GameBoard as GameBoard;
import src.utils as utils;

exports = Class(View, function(supr) {
    this.init = function(opts) {
        opts = merge(opts, {
            tag: 'GameController',
			infinite: true
        });

        supr(this, 'init', [opts]);

        this.build();
    };

    this.checkBubbleCollision = function(aimLine) {
        //returns closest colliding bubble or null
        //Need position for where new bubble would be as well

        var bubbleGrid = this.gameBoard.bubbleGrid;
        var returnBubble = null;

        for(var bubbleRow of bubbleGrid) {
            for(var bubble of bubbleRow.bubbles) {
                if(bubble) {
                    if(intersect.circleAndLine(bubble.collisionCircle, aimLine)) {
                        if(returnBubble) {
                            console.log('2');
                            //console.log(bubble.getPosition());
                            //console.log(aimLine.start);
                            var currLine = new Line(bubble.getPosition(), aimLine.start);
                            var prevLine = new Line(returnBubble.getPosition(), aimLine.start);

                            if(currLine.getLength() < prevLine.getLength()) {
                                returnBubble = bubble;
                            }
                            //console.log(distanceLine);
                        } else {
                            console.log('1');
                            returnBubble = bubble;
                        }
                    }
                }
            }
        }

        return returnBubble;
    };

    this.getGridSpacePoint = function(space) {
        var spaceX = space.bubbleCol * GLOBAL.BUBBLE_WIDTH;
        var spaceY = space.bubbleRow * GLOBAL.BUBBLE_WIDTH * this.gameBoard.getRowYModifier();

        if(space.bubbleCol % 2 === 0) 
            spaceX = spaceX + GLOBAL.BUBBLE_WIDTH / 2

        return new Point({x: spaceX, y: spaceY});
    };

    this.getOpenGridSpace = function(bubble, collidePoint) {
        var returnSpace = null;
        var openGridSpaces = bubble.getOpenNeighborSpaces();
        var returnSpaceDistance, currSpaceDistance;

        for(var space in openGridSpaces) {
            currSpaceDistance = utils.getDistance(this.getGridSpacePoint(space), collidePoint);
            if(returnSpace) {
                if(currSpaceDistance < returnSpaceDistance) {
                    returnSpace = space;
                    returnSpaceDistance = currSpaceDistance;
                }
            } else {
                returnSpace = space;
                returnSpaceDistance = currSpaceDistance;
            } 
        }

        return returnSpace;
	};

    this.snapBubble = function(x, y) {
        //snap bubble to given position in given bubble row
        //then decide if bubbles should dissapear and make any bubbles not connected to an enemy drop
    };

    this.showMoreBoard = function() {
        //decide how much more of board to show
    };

    this.build = function() {
        this.gameBoard = new GameBoard({
            superview: this,
            x: 0,
            y: 0
        });
    };
});