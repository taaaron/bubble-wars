import ui.ImageView as ImageView;
import ui.resource.Image as Image;

var enemyImg = new Image({url: 'resources/images/gameObjects/enemy2.png'});
var enemyLaserImg = new Image({url: 'resources/images/particles/enemy_laser.png'});

exports = Class(ImageView, function(supr) {
    this.init = function(opts) {
        opts = merge(opts, {
            tag: 'Enemy',
            image: enemyImg,
            x: -10,
            y: -20,
			width: GLOBAL.BUBBLE_WIDTH + 20,
			height: (GLOBAL.BUBBLE_WIDTH + 20) * (enemyImg.getHeight() / enemyImg.getWidth())
        });

        supr(this, 'init', [opts]);

        this.build();
    };

    //every three turns the enemies on screen will fire a laser at the player
    //slowly charges every turn

    this.build = function() {
        this._enemyLaser = new ImageView({
            superview: this,
			image: enemyLaserImg,
			width: 15,
            height: 30,
            visible: false
        });

    };
});