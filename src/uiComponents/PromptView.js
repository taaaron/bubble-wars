import ui.View as View;
import ui.ImageView as ImageScaleView;
import ui.resource.Image as Image;
import ui.TextView as TextView;

import src.uiComponents.BasicButton as BasicButton;

var promptBgImg = new Image({url: 'resources/images/ui/ui_bg.png'});

exports = Class(View, function (supr) {
	this.init = function (opts) {
		opts = merge(opts, {
            tag: 'PromptView',
            width: GLOBAL.BASE_WIDTH,
            height: GLOBAL.BASE_HEIGHT
		});

		supr(this, 'init', [opts]);

		this.build();
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

        this._promptBgView = new ImageScaleView({
            superview: this,
            image: promptBgImg,
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

        this._promptHeader = new TextView({
            superview: this,
            text: 'DEFEAT ALL ENEMIES',
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
            title: 'READY',
            on: {
                up: bind(this, function () {
                    this.emit('Close Prompt');
                })
            },
            zIndex: 3
        });
    };
});