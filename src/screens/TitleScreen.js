import ui.TextView as TextView;
import ui.View as View;

import src.uiComponents.BasicButton as BasicButton;

exports = Class(View, function(supr) {
    this.init = function(opts) {
        opts = merge(opts, {
            tag: 'TitleScreen',
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

        this.startButton = new BasicButton({
            superview: this,
            x: GLOBAL.BASE_WIDTH_CENTER - 150,
            y: GLOBAL.BASE_HEIGHT_CENTER - 50,
            title: 'PLAY',
            on: {
                up: bind(this, function () {
                    GC.app.audioManager.play('buttonClick');
                    this.emit('Start Game');
                })
            }
        });
    };
});