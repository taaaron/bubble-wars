import device;
import ui.StackView as StackView;
import ui.ImageView as ImageView;
import ui.resource.Image as Image;

import src.screens.TitleScreen as TitleScreen;
import src.screens.GameScreen as GameScreen;
import src.Globals as Globals;

Globals();

var bgImage = new Image({url: 'resources/images/space_bg_ios2.png'});

exports = Class(GC.Application, function () {
    this.initUI = function () {
        GC.app.view.style.scale = device.screen.width / GLOBAL.BASE_WIDTH;
        GLOBAL.SCALE = GC.app.view.style.scale;

        var titlescreen = new TitleScreen(),
            gamescreen = new GameScreen();

        var bgView = new ImageView({
            superview: this,
            x: 0,
            y: 0,
            width: GLOBAL.BASE_WIDTH,
            height: GLOBAL.BASE_HEIGHT,
            image: bgImage,
            clip: true
        });

        var rootView = new StackView({
            superview: bgView,
            x: 0,
            y: 0,
            width: GLOBAL.BASE_WIDTH,
            height: GLOBAL.BASE_HEIGHT,
            clip: true
        });

        rootView.push(titlescreen);

        titlescreen.on('StartGame', function() {
            //TODO: Have ui fade out smoothly into loading screen
            //TODO: Loading screen, preload game assets, then bring in game screen
            console.log('got emit');
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
