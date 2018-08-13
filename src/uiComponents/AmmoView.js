import animate;
import ui.View as View;
import ui.ImageScaleView as ImageScaleView;
import ui.ImageView as ImageView;
import ui.resource.Image as Image;
import ui.TextView as TextView;
import ui.widget.ButtonView as ButtonView;

var ammoBackingImg = new Image({url: 'resources/images/ui/ui_bg.png'});
var redBubbleImg = new Image({url: "resources/images/gameObjects/bubble_red.png"}),
	blueBubbleImg = new Image({url: "resources/images/gameObjects/bubble_blue.png"}),
    yellowBubbleImg = new Image({url: "resources/images/gameObjects/bubble_yellow.png"});

exports = Class(View, function (supr) {
	this.init = function (opts) {
		opts = merge(opts, {
            tag: 'AmmoView',
            width: 150,
            height: 100
		});

		supr(this, 'init', [opts]);

		this.build();
    };

    this.moveBacking = function(ammoType) {
        var newY = 0;

        switch(ammoType) {
            case GLOBAL.BUBBLE_TYPES.RED:
                newY = this._redAmmoCount.style.y;
                break;
            case GLOBAL.BUBBLE_TYPES.BLUE:
                newY = this._blueAmmoCount.style.y;
                break;
            case GLOBAL.BUBBLE_TYPES.YELLOW:
                newY = this._yellowAmmoCount.style.y;
        }

        this._animator.then({
            x: 0,
            y: newY
        }, 100);
    };

    this.updateAmmoCounts= function(ammo) {
        this._redAmmoCount.updateOpts({
            text: ammo[GLOBAL.BUBBLE_TYPES.RED]
        });
        this._blueAmmoCount.updateOpts({
            text: ammo[GLOBAL.BUBBLE_TYPES.BLUE]
        });
        this._yellowAmmoCount.updateOpts({
            text: ammo[GLOBAL.BUBBLE_TYPES.YELLOW]
        });
    };

    this.build = function() {
        this._redAmmoCount = new TextView({
            superview: this,
            text: String(GLOBAL.STARTING_AMMO.RED),
            color: 'white',
            width: 100,
            height: 100/3,
            x: 50,
            y: 0,
            fontFamily: 'KenVector Future Thin',
            autoFontSize: true
        });

        this._redAmmoIcon = new ImageView({
            superview: this,
            x: 25,
            y: 0,
            width:	100/3,
			height: 100/3,
			image: redBubbleImg
        });

        this._blueAmmoCount = new TextView({
            superview: this,
            text: String(GLOBAL.STARTING_AMMO.BLUE),
            color: 'white',
            width: 100,
            height: 100/3,
            x: 50,
            y: 100/3,
            fontFamily: 'KenVector Future Thin',
            autoFontSize: true
        });

        this._blueAmmoIcon = new ImageView({
            superview: this,
            x: 25,
            y: 100/3,
            width:	100/3,
			height: 100/3,
			image: blueBubbleImg
        });

        this._yellowAmmoCount = new TextView({
            superview: this,
            text: String(GLOBAL.STARTING_AMMO.YELLOW),
            color: 'white',
            width: 100,
            height: 100/3,
            x: 50,
            y: 100/3 * 2,
            fontFamily: 'KenVector Future Thin',
            autoFontSize: true
        });

        this._yellowAmmoIcon = new ImageView({
            superview: this,
            x: 25,
            y: 100/3 * 2,
            width:	100/3,
			height: 100/3,
			image: yellowBubbleImg
        });

        this.currAmmoBacking = new ImageScaleView({
            superview: this,
            x: 0,
            y: 0,
            width: 150,
            height: 100/3,
            image: ammoBackingImg,
            scaleMethod: '6slice',
			sourceSlices: {
				horizontal: {left: 20, center: 50, right: 20},
				vertical: {top: 10, bottom: 10}
            }
        });

        this._animator = animate(this.currAmmoBacking);
    };
});