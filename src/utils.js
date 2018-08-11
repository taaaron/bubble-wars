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