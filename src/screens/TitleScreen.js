import ui.TextView as TextView;
import ui.View as View;
import ui.widget.ButtonView as ButtonView;

exports = Class(View, function(supr) {
    this.init = function(opts) {
        opts = merge(opts, {
            x: 0,
            y: 0,
            width: 320,
            height: 480
        });

        supr(this, 'init', [opts]);

        this.build();
    }

    this.build = function() {
        this.gameTitle = new TextView({
            superview: this,
            text: 'Bubble Wars',
            color: 'white',
            x: 50,
            y: 100,
            width: 200,
            height: 100,
            fontFamily: 'KenVector Future'
        });

        this.startButton = new ButtonView({
            superView: this,
            x: 58,
            y: 313,
            width: 200,
            height: 100
        });

        this.startButton.on('InputSelect', bind(this, function() {
            this.emit('StartGame');
        }));
    };
});