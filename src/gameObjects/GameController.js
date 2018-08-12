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

    this._adjustGridPoint = function(point) {
        return point.translate(GLOBAL.BUBBLE_WIDTH / 2, GLOBAL.BUBBLE_WIDTH / 2);
    };

    //returns closest colliding bubble or null
    this.checkBubbleCollision = function(aimLine) {
        var bubbleGrid = this.gameBoard.bubbleGrid;
        var returnBubble = null;

        for(var bubbleRow of bubbleGrid) {
            for(var bubble of bubbleRow.bubbles) {
                if(bubble) {
                    if(intersect.circleAndLine(bubble.collisionCircle, aimLine)) {
                        if(returnBubble) {
                            var currLine = new Line(bubble.getPosition(), aimLine.start);
                            var prevLine = new Line(returnBubble.getPosition(), aimLine.start);

                            if(currLine.getLength() < prevLine.getLength()) {
                                returnBubble = bubble;
                            }
                        } else {
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

        if(space.bubbleRow % 2 === 0) 
            spaceX = spaceX + GLOBAL.BUBBLE_WIDTH / 2

        return new Point({x: spaceX, y: spaceY});
    };

    this.getOpenNeighborSpaces = function(bubble) {
        var row, col;
        var maxCol = this.gameBoard.getGridSizeX() - 1;
        var maxRow = this.gameBoard.getGridSizeY() - 1;
        var openSpaces = [];

		for(offset of bubble.neighborOffsets) {
            row = bubble.bubbleRow + offset.y;
            col = bubble.bubbleCol + offset.x;
            if(row >= 0 && row <= maxRow && col >= 0 && col <= maxCol) {
                if(this.gameBoard.bubbleGrid[row].bubbles[col] === null) {
                    openSpaces.push({bubbleCol: col, bubbleRow: row});
                }
            }
        }
        
        return openSpaces;
    };

    this.determineGridSpace = function(bubble, collidePoint) {
        var returnSpace = null;
        var openGridSpaces = this.getOpenNeighborSpaces(bubble);
        var returnSpaceDistance, currSpaceDistance, adjustedGridPoint;

        for(var space of openGridSpaces) {
            adjustedGridPoint = this._adjustGridPoint(this.getGridSpacePoint(space));
            currSpaceDistance = utils.getDistance(adjustedGridPoint, collidePoint);
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
    
    this.getNextBubble = function(bubble, collidePoint, visitedBubbles) {
        var returnBubble = null;
        var maxCol = this.gameBoard.getGridSizeX() - 1;
        var maxRow = this.gameBoard.getGridSizeY() - 1;
        var row, col, returnDistance, currDistance, tempBubble;

        for(offset of bubble.neighborOffsets) {
            row = bubble.bubbleRow + offset.y;
            col = bubble.bubbleCol + offset.x;
            if(row >= 0 && row <= maxRow && col >= 0 && col <= maxCol) {
                tempBubble = this.gameBoard.bubbleGrid[row].bubbles[col];
                if(tempBubble && !visitedBubbles.includes(tempBubble)) {
                    currDistance = utils.getDistance(tempBubble.getPosition(), collidePoint);
                    if(returnBubble) {
                        if(currDistance < returnDistance) {
                            returnBubble = tempBubble;
                            returnDistance = currDistance;
                        }
                    } else {
                        returnBubble = tempBubble;
                        returnDistance = currDistance;
                    }
                }
            }
        }

        return returnBubble;
    };

    this.findIslands = function() {

    };

    this.findCluster = function(bubble) {
        var stack = [bubble];
        var visitedBubbles = [bubble];
        var cluster = [];
        var currBubble;

        while(stack.length !== 0) {
            currBubble = stack.pop();
            cluster.push(currBubble);

            //find all neighbors that have same type and havnt been visited add them to stack
            var maxCol = this.gameBoard.getGridSizeX() - 1;
            var maxRow = this.gameBoard.getGridSizeY() - 1;
            var row, col, tempBubble;
    
            for(offset of currBubble.neighborOffsets) {
                row = currBubble.bubbleRow + offset.y;
                col = currBubble.bubbleCol + offset.x;
                if(row >= 0 && row <= maxRow && col >= 0 && col <= maxCol) {
                    tempBubble = this.gameBoard.bubbleGrid[row].bubbles[col];
                    if(tempBubble && !visitedBubbles.includes(tempBubble) && tempBubble.type === bubble.type) {
                        stack.push(tempBubble);
                        visitedBubblespush(tempBubble);
                    }
                }
            }
        }

        if(cluster >= 3) {
            //remove all 
            //make sure to check if need to be released by view pool
            for(bubble of cluster) {
                bubble.removeFromSuperView();
                if(bubble.isFromPool)
                    this.getSuperview().playerController.shooter.releaseBubbleView(bubble);
            }
        }

        //find islands? Go to each enemy and find all bubbles connected to them. MAke sure not to go over ones already visited. Then delete all bubbles that don't connect
    };

    this.snapToNearestSpace = function() {

    };

    this.snapBubble = function(x, y, bubble) {
        //snap bubble to given position in given bubble row
        //then decide if bubbles should dissapear and make any bubbles not connected to an enemy drop
        var newRow = this.gameBoard.bubbleGrid[y];
        console.log(x, y);
        bubble.updateOpts({
            superview: newRow,
            x: x * BUBBLE_WIDTH,
            y: 0,
        });
        bubble.bubbleRow = y;
        bubble.bubbleCol = x;
        bubble.determineNeighborOffsets();
        bubble.updateCollisionCircleWithScale();
        newRow.bubbles[x] = bubble;

        console.log(bubble);

        //this.findCluster(bubble);
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