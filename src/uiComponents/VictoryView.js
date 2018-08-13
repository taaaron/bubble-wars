import ui.View as View;
import ui.ImageView as ImageScaleView;
import ui.resource.Image as Image;
import ui.TextView as TextView;

import src.uiComponents.BasicButton as BasicButton;

var victoryBgImg = new Image({url: 'resources/images/ui/ui_bg.png'});

exports = Class(View, function (supr) {
	this.init = function (opts) {
		opts = merge(opts, {
            tag: 'VictoryView',
            width: GLOBAL.BASE_WIDTH,
            height: GLOBAL.BASE_HEIGHT
		});

		supr(this, 'init', [opts]);

		this.build();
    };

    this.setHeaderText = function(text) {
        this._victoryHeader.updateOpts({
            text: text
        });
    };

    this.build = function() {
        this._blackOverlay = new View({
            superview: this,
            x: 0,
            y: 0,
            width: GLOBAL.BASE_WIDTH,
            height: GLOBAL.BASE_HEIGHT,
            backgroundColor: 'black',
            opacity: 0.9,
            zIndex: 0
        });

        this._victoryBgView = new ImageScaleView({
            superview: this,
            image: victoryBgImg,
            x: this.style.width / 2 - 200,
            y: this.style.height / 2 - 200,
            width: 400,
            height: 250,
            scaleMethod: '9slice',
			sourceSlices: {
				horizontal: {left: 5, center: 100, right: 5},
				vertical: {top: 5, center: 100, bottom: 5}
            },
            zIndex: 1
        });

        this._victoryHeader = new TextView({
            superview: this,
            text: 'VICTORY',
            color: 'white',
            width: 300,
            height: 50,
            x: this.style.width / 2 - 150,
            y: this.style.height / 2 - 175,
            fontFamily: 'KenVector Future',
            autoFontSize: true,
            zIndex: 2
        });

        this.quitButton = new BasicButton({
            superview: this,
            x: GLOBAL.BASE_WIDTH_CENTER - 150,
            y: GLOBAL.BASE_HEIGHT_CENTER - 100,
            title: 'QUIT',
            on: {
                up: bind(this, function () {
                    this.emit('End Game');
                })
            },
            zIndex: 3
        });
    };
});