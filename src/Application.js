import device;
import ui.StackView as StackView;
import ui.ImageView as ImageView;
import ui.resource.Image as Image;

import src.screens.TitleScreen as TitleScreen;
import src.screens.GameScreen as GameScreen;
import src.Globals as Globals;
import src.AudioManager as AudioManager;

var bgImage = new Image({url: 'resources/images/space_bg_ios2.png'});

exports = Class(GC.Application, function () {
    this.initUI = function () {
        Globals();
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

        this.audioManager = AudioManager.getAudioManager();

        rootView.push(titlescreen);
        this.audioManager.play('bgMusic');

        titlescreen.on('Start Game', function() {
            rootView.push(gamescreen);
        });

        gamescreen.on('End Game', function() {
            rootView.pop();
        });
    };

    this.launchUI = function () {

    };
});
