import animate;
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

    this.deathSequence = function() {
        GC.app.audioManager.stop('bubbleShoot');
        GC.app.audioManager.stop('bubblePop');
        if(!GC.app.audioManager.isPlaying('enemyDefeat'))
            GC.app.audioManager.play('enemyDefeat', {time: 0.001, duration: 0.0018});

        //TODO: death sequence animation here
    };

    this.build = function() {
        this._enemyLaser = new ImageView({
            superview: this,
			image: enemyLaserImg,
			width: 15,
            height: 30,
            visible: false
        });

        this._animator = animate(this);
    };
});