exports = function() {
    GLOBAL.BUBBLE_TYPES = {
        RED: 'bubble_red',
        BLUE: 'bubble_blue',
        YELLOW: 'bubble_yellow'
    };

    GLOBAL.BUBBLE_IDS = {
        RED: 'r',
        BLUE: 'b',
        YELLOW: 'y',
        EMPTY: 'e'
    };
    
    GLOBAL.BASE_WIDTH = 576;
    GLOBAL.BASE_HEIGHT = 1024;

    GLOBAL.BASE_WIDTH_CENTER = GLOBAL.BASE_WIDTH / 2;
    GLOBAL.BASE_HEIGHT_CENTER = GLOBAL.BASE_HEIGHT / 2;

    GLOBAL.BOARD_SCALE = 0.6;

    GLOBAL.getViewCenterX = function(view) {
        return view.style.width / 2;
    };
    GLOBAL.getViewCenterY = function(view) {
        return view.style.height / 2;
    }
};
