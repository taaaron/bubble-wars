import math.geom.Point as Point;
import math.geom.Line as Line;
import math.geom.intersect as intersect;

exports.getAngle = function (point1, point2) {
    var modifier = point1.x > point2.x ? -1 : 1;
    return Math.atan(Math.abs(point1.x - point2.x) / Math.abs(point1.y - point2.y)) * modifier;
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