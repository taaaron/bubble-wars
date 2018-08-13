import ui.View as View;
import ui.ImageView as ImageView;
import ui.resource.Image as Image;
import ui.TextView as TextView;

var enemyImg = new Image({url: 'resources/images/gameObjects/enemy2.png'});

exports = Class(View, function (supr) {
	this.init = function (opts) {
		opts = merge(opts, {
            tag: 'EnemyCountView',
            width: 150,
            height: 100
		});

		supr(this, 'init', [opts]);

		this.build();
    };

    this.updateCount = function(count) {
        this._enemyCount.updateOpts({
            text: count
        });
    };

    this.build = function() {
        this._enemyCount = new TextView({
            superview: this,
            text: '',
            color: 'white',
            width: 75,
            height: 100/3,
            x: 50,
            y: 0,
            fontFamily: 'KenVector Future Thin',
            autoFontSize: true
        });

        this._enemyIcon = new ImageView({
            superview: this,
            x: 25,
            y: 0,
            width:	100/3,
			height: 100/3 * (enemyImg.getHeight() / enemyImg.getWidth()),
			image: enemyImg
        });
    };
});