import ui.View as View;
import ui.ImageView as ImageScaleView;
import ui.resource.Image as Image;
import ui.TextView as TextView;

import src.uiComponents.BasicButton as BasicButton;

var menuBgImg = new Image({url: 'resources/images/ui/ui_bg.png'});
var musicOnIcon = new Image({url: 'resources/images/ui/icons/musicOn.png'}),
    musicOffIcon = new Image({url: 'resources/images/ui/icons/musicOff.png'}),
    audioOnIcon = new Image({url: 'resources/images/ui/icons/audioOn.png'}),
    audioOffIcon = new Image({url: 'resources/images/ui/icons/audioOff.png'});

exports = Class(View, function (supr) {
	this.init = function (opts) {
		opts = merge(opts, {
            tag: 'MenuView',
            width: GLOBAL.BASE_WIDTH,
            height: GLOBAL.BASE_HEIGHT
		});

		supr(this, 'init', [opts]);

		this.build();
    };

    this.build = function() {
        this._blackOverlay = new View({
            superview: this,
            x: 0,
            y: 0,
            width: GLOBAL.BASE_WIDTH,
            height: GLOBAL.BASE_HEIGHT,
            backgroundColor: 'black',
            opacity: 0.9,
            zIndex: 0
        });

        this._menuBgView = new ImageScaleView({
            superview: this,
            image: menuBgImg,
            x: this.style.width / 2 - 200,
            y: this.style.height / 2 - 250,
            width: 400,
            height: 500,
            scaleMethod: '9slice',
			sourceSlices: {
				horizontal: {left: 5, center: 100, right: 5},
				vertical: {top: 5, center: 100, bottom: 5}
            },
            zIndex: 1
        });

        this._menuHeader = new TextView({
            superview: this,
            text: 'PAUSED',
            color: 'white',
            width: 300,
            height: 50,
            x: this.style.width / 2 - 150,
            y: this.style.height / 2 - 200,
            fontFamily: 'KenVector Future',
            autoFontSize: true,
            zIndex: 2
        });

        this.resumeButton = new BasicButton({
            superview: this,
            x: GLOBAL.BASE_WIDTH_CENTER - 150,
            y: GLOBAL.BASE_HEIGHT_CENTER - 125,
            title: 'RESUME',
            on: {
                up: bind(this, function () {
                    this.emit('Resume');
                })
            },
            zIndex: 3
        });

        this.quitButton = new BasicButton({
            superview: this,
            x: GLOBAL.BASE_WIDTH_CENTER - 150,
            y: GLOBAL.BASE_HEIGHT_CENTER - 10,
            title: 'QUIT',
            on: {
                up: bind(this, function () {
                    this.emit('End Game');
                })
            },
            zIndex: 3
        });

        this.muteMusicButton = new BasicButton({
            superview: this,
            x: GLOBAL.BASE_WIDTH_CENTER - 150,
            y: GLOBAL.BASE_HEIGHT_CENTER + 110,
            width: 125,
            icon: {
                image: musicOnIcon,
                x: 25,
                y: 12,
                width: 75,
                height: 75
            },
            on: {
                up: bind(this, function () {
                    if(GC.app.audioManager.getMusicMuted()) {
                        GC.app.audioManager.setMusicMuted(false);
                        this.muteMusicButton.getSubviews()[1].updateOpts({
                            image: musicOnIcon
                        });
                    } else {
                        GC.app.audioManager.setMusicMuted(true);
                        this.muteMusicButton.getSubviews()[1].updateOpts({
                            image: musicOffIcon
                        });
                    }   
                })
            },
            zIndex: 3
        });

        this.muteAllButton = new BasicButton({
            superview: this,
            x: GLOBAL.BASE_WIDTH_CENTER + 25,
            y: GLOBAL.BASE_HEIGHT_CENTER + 110,
            width: 125,
            icon: {
                image: audioOnIcon,
                x: 25,
                y: 12,
                width: 75,
                height: 75
            },
            on: {
                up: bind(this, function () {
                    if(GC.app.audioManager.getMuted()) {
                        GC.app.audioManager.setMuted(false);
                        this.muteAllButton.getSubviews()[1].updateOpts({
                            image: audioOnIcon
                        });
                    } else {
                        GC.app.audioManager.setMuted(true);
                        this.muteAllButton.getSubviews()[1].updateOpts({
                            image: audioOffIcon
                        });
                    } 
                })
            },
            zIndex: 3
        });
    };
});