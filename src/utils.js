exports.getAngle = function (point1, point2) {
    return Math.atan(Math.abs(point1.x - point2.x) / Math.abs(point1.y - point2.y));
};