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
        NULL: 'n',
        ENEMY: 'e'
    };

    GLOBAL.STARTING_AMMO = {
        RED: 3,
        BLUE: 3,
        YELLOW: 3
    };
    
    GLOBAL.BASE_WIDTH = 576;
    GLOBAL.BASE_HEIGHT = 1024;
    GLOBAL.SCREEN_DIAGANOL = Math.sqrt(Math.pow(GLOBAL.BASE_WIDTH, 2) * Math.pow(GLOBAL.BASE_HEIGHT, 2));

    GLOBAL.BASE_BUBBLE_WIDTH = 80;

    GLOBAL.BASE_WIDTH_CENTER = GLOBAL.BASE_WIDTH / 2;
    GLOBAL.BASE_HEIGHT_CENTER = GLOBAL.BASE_HEIGHT / 2;

    GLOBAL.BOARD_SCALE = 0.6;
    GLOBAL.HUD_SCALE = 0.9;
    GLOBAL.BUBBLE_SCALE = 0.625;

    GLOBAL.BUBBLE_WIDTH = GLOBAL.BASE_BUBBLE_WIDTH * GLOBAL.BUBBLE_SCALE;

    GLOBAL.MAX_GRID_SIZE_X = 11;
    GLOBAL.MAX_ROWS_ON_SCREEN = 13;

    GLOBAL.getViewCenterX = function(view) {
        return view.style.width / 2;
    };
    GLOBAL.getViewCenterY = function(view) {
        return view.style.height / 2;
    }
};
