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

        this.audioManager = AudioManager.getAudioManager();
        this.titleScreen = new TitleScreen(),
        this.gameScreen = new GameScreen();

        this.audioManager.play('bgMusic');

        var bgView = new ImageView({
            superview: this,
            x: 0,
            y: 0,
            width: GLOBAL.BASE_WIDTH,
            height: GLOBAL.BASE_HEIGHT,
            image: bgImage,
            clip: true
        });

        this.rootView = new StackView({
            superview: bgView,
            x: 0,
            y: 0,
            width: GLOBAL.BASE_WIDTH,
            height: GLOBAL.BASE_HEIGHT,
            clip: true
        });

        this.rootView.push(this.titleScreen);

        this.titleScreen.on('Start Game', bind(this, function() {
            this.rootView.push(this.gameScreen);
        }));

        this.setGameScreenEvents();
    };

    this.resetGameScreen = function() {
        this.rootView.remove(this.gameScreen);
        this.gameScreen = new GameScreen();
        this.setGameScreenEvents();
    };

    this.setGameScreenEvents = function() {
        this.gameScreen.on('End Game', bind(this, function() {
            this.rootView.pop();
            this.resetGameScreen(this.gameScreen);
        }));
    };

    this.launchUI = function () {

    };
});
