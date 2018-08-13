import ui.View as View;
import ui.ImageScaleView as ImageScaleView;
import ui.resource.Image as Image;
import ui.TextView as TextView;
import ui.widget.ButtonView as ButtonView;

import src.uiComponents.AmmoView as AmmoView;

var uiBackgroundImg = new Image({url: 'resources/images/ui/ui_bg.png'});

exports = Class(View, function (supr) {
	this.init = function (opts) {
		opts = merge(opts, {
            tag: 'HUD',
            width: GLOBAL.BASE_WIDTH,
            height: GLOBAL.BASE_HEIGHT - GLOBAL.BASE_HEIGHT * GLOBAL.HUD_SCALE
		});

		supr(this, 'init', [opts]);

		this.build();
    };

    this.build = function() {
        this._background = new ImageScaleView({
            superview: this,
            x: 0,
            y: 0,
            width: this.style.width,
            height: this.style.height,
            image: uiBackgroundImg,
            scaleMethod: '9slice',
			sourceSlices: {
				horizontal: {left: 50, center: 50, right: 50},
				vertical: {top: 10, center: 50, bottom: 10}
            }
        });

        this.menuButton = new ButtonView({
            superview: this,
            width: 80,
            height: 80,
            x: this.style.width - 85,
            y: this.style.height - 85,
            images: {
                up: 'resources/images/ui/buttons/menu_button.png',
                down: 'resources/images/ui/buttons/menu_button_down.png',
                disabled: 'resources/images/ui/buttons/menu_button.png'
            },
            scaleMethod: 'stretch',
            on: {
                up: bind(this, function () {
                    this.emit('Open Menu');
                })
            }
        });

        this.ammoView = new AmmoView({
            superview: this,
            x: 0,
            y: 0
        });
    };
});