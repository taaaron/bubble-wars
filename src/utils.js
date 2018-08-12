import math.geom.Point as Point;
import math.geom.Line as Line;
import math.geom.intersect as intersect;

exports.getAngle = function (point1, point2) {
    var modifier = point1.x > point2.x ? -1 : 1;
    return Math.atan(Math.abs(point1.x - point2.x) / Math.abs(point1.y - point2.y)) * modifier;
};

exports.getAngle2 = function(point1, point2) {
    return Math.atan2(point2.y - point1.y, point2.x - point1.x);
};

exports.getSlope = function(point1, point2) {
    if(point1.x - point2.x === 0)
        return null;
    return (point1.y - point2.y) / (point1.x - point2.x);
};

exports.getTriangleSide = function(side1, hypotenuse) {
    return Math.sqrt(Math.pow(hypotenuse, 2) - Math.pow(side1, 2));
};

exports.getDistance = function(point1, point2) {
    return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
};

exports.getLineCircleIntersection = function(line, circle) {
    var dx, dy, cx, cy, A, B, C, det, t, intersect1, intersect2;
    var collidePoint;

    dx = line.end.x - line.start.x;
    dy = line.end.y - line.start.y;

    cx = circle.x;
    cy = circle.y;

    A = Math.pow(dx, 2) + Math.pow(dy, 2);
    B = 2 * (dx * (line.end.x - cx) + dy * (line.end.y - cy));
    C = Math.pow(line.end.x - cx, 2) + Math.pow(line.end.y - cy, 2) - Math.pow(circle.radius, 2);

    det = B * B - 4 * A * C;

    if(det < 0) {
        return null;
    } else if(det === 0) {
        //one solution
        t = -B / (2 * A);
        intersect1 = new Point({
            x: line.end.x + t * dx,
            y: line.end.y + t * dy
        });
        collidePoint = intersect1;
    } else {
        //two solutions
        t = (-B + Math.sqrt(det)) / (2 * A);
        intersect1 = new Point({
            x: line.end.x + t * dx,
            y: line.end.y + t * dy
        });

        t = (-B - Math.sqrt(det)) / (2 * A);
        intersect2 = new Point({
            x: line.end.x + t * dx,
            y: line.end.y + t * dy
        });
        
        var line1 = new Line(line.start, intersect1);
        var line2 = new Line(line.start, intersect2);

        collidePoint = line1.getLength() < line2.getLength ? intersect1 : intersect2;
    }

    return collidePoint;
};

exports.getLineLineIntersection = function(line1, line2) {
    var a1 = line1.end.y - line1.start.y;
    var b1 = line1.start.x - line1.end.x;
    var c1 = a1 * line1.start.x + b1 * line1.start.y;

    var a2 = line2.end.y - line2.start.y;
    var b2 = line2.start.x - line2.end.x;
    var c2 = a2 * line2.start.x + b2 * line2.start.y;

    var det = a1 * b2 - a2 * b1;

    if(det === 0) {
        return null;
    } else {
        return new Point({
            x: (b2 * c1 - b1 * c2) / det,
            y: (a1 * c2 - a2 * c1) / det 
        });
    }
};

exports.getPointOnLineX = function(line, x) {
    var a = line.end.y - line.start.y;
    var b = line.start.x - line.end.x;
    var c = a * line.start.x + b * line.start.y;
    var y = (c - a * x) / b;

    return new Point({x: x, y: y});
};

exports.getPointOnLineY = function(line, y) {
    var a = line.end.y - line.start.y;
    var b = line.start.x - line.end.x;
    var c = a * line.start.x + b * line.start.y;
    var x = (c - b * y) / a;

    return new Point({x: x, y: y});
};