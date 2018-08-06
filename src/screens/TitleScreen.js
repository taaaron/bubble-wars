import ui.TextView as TextView;
import ui.View as View;
import ui.widget.ButtonView as ButtonView;

exports = Class(View, function(supr) {
    this.init = function(opts) {
        opts = merge(opts, {
            x: 0,
            y: 0,
            wdith: GLOBAL.BASE_WIDTH,
            height: GLOBAL.BASE_HEIGHT
        });

        supr(this, 'init', [opts]);

        this.build();
    }

    this.build = function() {
        this.gameTitle = new TextView({
            superview: this,
            text: 'Bubble   Wars',
            color: 'white',
            width: 500,
            height: 300,
            x: GLOBAL.BASE_WIDTH_CENTER - 250,
            y: 0,
            fontFamily: 'KenVector Future',
            autoFontSize: true
        });

        this.startButton = new ButtonView({
            superview: this,
            width: 300,
            height: 100,
            x: GLOBAL.BASE_WIDTH_CENTER - 150,
            y: GLOBAL.BASE_HEIGHT_CENTER - 50,
            images: {
                up: 'resources/images/ui/buttons/basic_button.png',
                down: 'resources/images/ui/buttons/basic_button.png',
                disabled: 'resources/images/ui/buttons/basic_button.png'
            },
            scaleMethod: "9slice",
			sourceSlices: {
				horizontal: {left: 10, center: 80, right: 10},
				vertical: {top: 10, center: 50, bottom: 10}
            },
            destSlices: {
                horizontal: {left: 20, right: 20},
                vertical: {top: 20, bottom: 20}
            },
            title: 'PLAY',
            text: {
                color: 'white',
                fontFamily: 'KenVector Future Thin',
                size: 50
            },
            on: {
                up: bind(this, function () {
                    this.emit('StartGame');
                })
            }
        });
    };
});