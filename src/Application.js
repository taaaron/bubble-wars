import device;
import ui.StackView as StackView;
import ui.ImageView as ImageView;
import ui.resource.Image as Image;

import src.screens.TitleScreen as TitleScreen;
import src.screens.GameScreen as GameScreen;

var bgImage = new Image({url: 'resources/images/space_bg.png'});

exports = Class(GC.Application, function () {
    this.initUI = function () {
        var titlescreen = new TitleScreen(),
            gamescreen = new GameScreen();

        var bgView = new ImageView({
            superview: this,
            x: 0,
            y: 0,
            width: 320,
            height: 480,
            image: bgImage,
            autoSize: true
        });

        var rootView = new StackView({
            superview: bgView,
            x: 0,
            y: 0,
            width: 320,
            height: 480,
            clip: true,
            scale: device.width / 320
        });

        rootView.push(titlescreen);

        titlescreen.on('StartGame', function() {
            //TODO: Have ui fade out smoothly into loading screen
            //TODO: Loading screen, preload game assets, then bring in game screen
            rootView.push(gamescreen);
        });

        gamescreen.on('EndGame', function() {
            //TODO: Fade out smoothly into loading screen
            //TODO: Loading screen, preload menu assets, then title screen
            rootView.pop();
        });
    };

    this.launchUI = function () {

    };
});
