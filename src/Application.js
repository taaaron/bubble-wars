import device;
import ui.StackView as StackView;

import src.screens.TitleScreen as TitleScreen;
import src.screens.GameScreen as GameScreen;

exports = Class(GC.Application, function () {

    this.initUI = function () {

        var titlescreen = new TitleScreen(),
            gamescreen = new GameScreen();

        var rootView = new StackView({
            superview: this,
            x: 0,
            y: 0,
            width: 320,
            height: 480,
            clip: true,
            scale: device.width / 320
        });

        rootView.push(titlescreen);

        titlescreen.on('StartGame', function() {

        });

        gamescreen.on('EndGame', function() {

        });
    };

    this.launchUI = function () {

    };
});
