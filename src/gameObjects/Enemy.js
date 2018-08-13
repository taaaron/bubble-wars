import animate;
import ui.ImageView as ImageView;
import ui.resource.Image as Image;
import math.geom.Point as Point;
import math.util as mathUtil;

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

    this.deathSequence = function(gameController) {
        this.updateOpts({
            superview: gameController,
            x: this.getPosition(gameController).x,
            y: this.getPosition(gameController).y
        });

        GC.app.audioManager.stop('bubbleShoot');
        GC.app.audioManager.stop('bubblePop');
        if(!GC.app.audioManager.isPlaying('enemyDefeat'))
            GC.app.audioManager.play('enemyDefeat', {time: 0.001, duration: 0.0018});

        var deathX = mathUtil.random(-200, GLOBAL.BASE_WIDTH + 200);
        var deathY = mathUtil.random(0, -500);
        this._animator.then({x: deathX, y: deathY, r: Math.PI * 7}, 500, 'easeInOutCubic')
            .then(bind(this, function() {
                this.removeFromSuperview();
            }));
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