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

    /*
    returns the center of a grid point given its location as a point
    */
    this._adjustGridPoint = function(point) {
        return point.translate(GLOBAL.BUBBLE_WIDTH / 2, GLOBAL.BUBBLE_WIDTH / 2);
    };

    /*
    Returns the closest colliding bubble or null
    */
    this.getCollisionBubble = function(aimLine) {
        var bubbleGrid = this.gameBoard.bubbleGrid;
        var returnBubble = null;

        for(var bubbleRow of bubbleGrid) {
            for(var bubble of bubbleRow.bubbles) {
                if(bubble) {
                    if(intersect.circleAndLine(bubble.collisionCircle, aimLine)) {
                        if(returnBubble) {
                            var currLine = new Line(bubble.collisionCircle, aimLine.start);
                            var prevLine = new Line(returnBubble.collisionCircle, aimLine.start);

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

    /*
    Derives the location of a given grid space.
    Expects an object with bubbleCol and bubbleRow
    */
    this.getGridSpacePoint = function(space) {
        var spaceX = space.bubbleCol * GLOBAL.BUBBLE_WIDTH;
        var spaceY = space.bubbleRow * GLOBAL.BUBBLE_WIDTH * this.gameBoard.getRowYModifier() + this.gameBoard.style.y;

        if(space.bubbleRow % 2 === 0) 
            spaceX = spaceX + GLOBAL.BUBBLE_WIDTH / 2

        return new Point({x: spaceX, y: spaceY});
    };

    /*
    Gets all open grid locations surrounding a bubble and 
    returns them in an array of objects with bubbleCol and bubbleRow
    */
    this.getOpenNeighborSpaces = function(bubble) {
        var row, col;
        var openSpaces = [];

		for(var offset of bubble.neighborOffsets) {
            row = bubble.bubbleRow + offset.y;
            col = bubble.bubbleCol + offset.x;
            if(row >= 0 && row <= this._maxRow && col >= 0 && col <= this._maxCol) {
                if(this.gameBoard.bubbleGrid[row].bubbles[col] === null) {
                    openSpaces.push({bubbleCol: col, bubbleRow: row});
                }
            }
        }
        
        return openSpaces;
    };

    /*
    Determines the valid grid space for player to shoot at given a bubble and collision point
    */
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

    /*
    Gets next valid bubble nearest to collision point
    */
    this.getNextBubble = function(bubble, collidePoint, visitedBubbles) {
        var returnBubble = null;
        var row, col, returnDistance, currDistance, tempBubble;

        for(var offset of bubble.neighborOffsets) {
            row = bubble.bubbleRow + offset.y;
            col = bubble.bubbleCol + offset.x;
            if(row >= 0 && row <= this._maxRow && col >= 0 && col <= this._maxCol) {
                tempBubble = this.gameBoard.bubbleGrid[row].bubbles[col];
                if(tempBubble && !visitedBubbles.includes(tempBubble)) {
                    currDistance = utils.getDistance(tempBubble.collisionCircle, collidePoint);
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


    /*
    Search for detached islands of Bubbles and drop them
    */
    this.findIslands = function() {
        var visitedBubbles = [];
        var masterList = [];
        var stack = [];
        var row, col, currBubble, tempBubble;

        //grab all enemies and find the bubbles connected to them
        this.gameBoard.enemies.forEach(bind(this, function(enemy) {
            row = enemy.getSuperview().bubbleRow;
            col = enemy.getSuperview().bubbleCol;
            neighborOffsets = enemy.getSuperview().neighborOffsets;
            stack.push(this.gameBoard.bubbleGrid[row].bubbles[col]);

            while(stack.length !== 0) {
                currBubble = stack.pop();
        
                for(var offset of currBubble.neighborOffsets) {
                    row = currBubble.bubbleRow + offset.y;
                    col = currBubble.bubbleCol + offset.x;
                    if(row >= 0 && row <= this._maxRow && col >= 0 && col <= this._maxCol) {
                        tempBubble = this.gameBoard.bubbleGrid[row].bubbles[col];
                        if(tempBubble && !visitedBubbles.includes(tempBubble)) {
                            stack.push(tempBubble);
                            visitedBubbles.push(tempBubble);
                        }
                    }
                }
            }
        }));

        //build a master list of all bubbles on the board
        for(var row of this.gameBoard.bubbleGrid) {
            if(!row.isRowNull()) {
                masterList = masterList.concat(row.bubbles);
            }
        }

        //remove all bubbles that are not connected to an enemy
        for(var node of masterList) {
            if(node && !visitedBubbles.includes(node)) {
                this.gameBoard.bubbleGrid[node.bubbleRow].bubbles[node.bubbleCol] = null;
                this.getSuperview().playerController.updateAmmo(node.type, 1);

                if(!GC.app.audioManager.isPlaying('bubbleAbsorb'))
                    GC.app.audioManager.play('bubbleAbsorb');

                node.animator.then({
                    x: GLOBAL.BASE_WIDTH_CENTER,
                    y: this.getSuperview().playerController.shooter.getPosition().y,
                }, 300, 'easeOutCubic')
                    .then(bind(this, function(node) {
                        node.removeFromSuperview();
                        if(node.isFromPool)
                            this.getSuperview().playerController.shooter.releaseBubbleView(node);
                    }, node));
            }
        }
    };

    /*
    Finds all bubbles of same type connected to given bubble
    */
    this.findCluster = function(bubble) {
        var stack = [bubble];
        var visitedBubbles = [bubble];
        var cluster = [];
        var currBubble;

        //While the stack is not empty, find connected bubbles of same type and add them to cluster
        while(stack.length !== 0) {
            var row, col, tempBubble;

            currBubble = stack.pop();
            cluster.push(currBubble);
    
            //find all neighbors that have same type and havnt been visited  and add them to the stack
            for(var offset of currBubble.neighborOffsets) {
                row = currBubble.bubbleRow + offset.y;
                col = currBubble.bubbleCol + offset.x;
                if(row >= 0 && row <= this._maxRow && col >= 0 && col <= this._maxCol) {
                    tempBubble = this.gameBoard.bubbleGrid[row].bubbles[col];
                    if(tempBubble && !visitedBubbles.includes(tempBubble) && tempBubble.type === bubble.type) {
                        stack.push(tempBubble);
                        visitedBubbles.push(tempBubble);
                    }
                }
            }
        }

        //If cluster is larger than 3, remove the cluster from the board
        if(cluster.length >= 3) {
            for(var node of cluster) {
                GC.app.audioManager.stop('bubbleShoot');
                if(!GC.app.audioManager.isPlaying('bubblePop'))
                    GC.app.audioManager.play('bubblePop');

                node.removeFromSuperview();
                this.gameBoard.bubbleGrid[node.bubbleRow].bubbles[node.bubbleCol] = null;

                if(node.enemy) {
                    node.enemy.deathSequence();
                    this.gameBoard.screenShake();
                    this.gameBoard.enemies.delete(node.enemy);
                }

                if(node.isFromPool)
                    this.getSuperview().playerController.shooter.releaseBubbleView(node);
            }
        }
    };

    /*
    Snaps given bubble to given x and y position in the bubbleGrid
    */
    this.snapBubble = function(x, y, bubble) {
        var newRow = this.gameBoard.bubbleGrid[y];

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

        this.findCluster(bubble);
        this.findIslands();
        this.gameBoard.showMoreBoard();

        if(this.gameBoard.enemies.size <= 0)
            this.emit('Victory');
    };

    this.build = function() {
        this.gameBoard = new GameBoard({
            superview: this,
            x: 0,
            y: 0
        });

        this._maxCol = this.gameBoard.getGridSizeX() - 1;
        this._maxRow = this.gameBoard.getGridSizeY() - 1;
    };
});