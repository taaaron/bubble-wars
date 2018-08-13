import animate;
import ui.View as View;

import src.uiComponents.MenuView as MenuView;
import src.uiComponents.VictoryView as VictoryView;
import src.uiComponents.PromptView as PromptView;

exports = Class(View, function (supr) {
	this.init = function (opts) {
		opts = merge(opts, {
            tag: 'UIController',
            infinite: true
		});

		supr(this, 'init', [opts]);

		this.build();
    };

    this.hidePrompt = function() {
        this._promptAnimator.then({opacity: 0}, 300)
        .then(bind(this, function() {
            this.style.visible = false;
            this.promptView.style.visible = false;
        }));
    };

    this.showMenu = function() {
        this.style.visible = true;
        this.menuView.style.visible = true;

        this._menuAnimator.then({opacity: 1}, 300);
    };

    this.hideMenu = function() {
        this._menuAnimator.then({opacity: 0}, 300)
            .then(bind(this, function() {
                this.style.visible = false;
                this.menuView.style.visible = false;
            }));
    };

    this.showVictory = function() {
        this.style.visible = true;
        this.victoryView.style.visible = true;
        this.victoryView.setHeaderText('VICTORY');

        this._victoryAnimator.then({opacity: 1}, 300);
    };

    this.showDefeat = function() {
        this.style.visible = true;
        this.victoryView.style.visible = true;
        this.victoryView.setHeaderText('DEFEAT');

        this._victoryAnimator.then({opacity: 1}, 300);
    };

    this.build = function() {
        this.promptView = new PromptView({
            superview: this,
            x: 0,
            y: 0,
            opacity: 1,
            visible: true
        });
        
        this.menuView = new MenuView({
            superview: this,
            x: 0,
            y: 0,
            opacity: 0,
            visible: false
        });

        this.victoryView = new VictoryView({
            superview: this,
            x: 0,
            y: 0,
            opacity: 0,
            visible: false
        });

        this._promptAnimator = animate(this.promptView);
        this._menuAnimator = animate(this.menuView);
        this._victoryAnimator = animate(this.victoryView);

        this.promptView.on('Close Prompt', bind(this, function() {
            GC.app.audioManager.play('buttonClick');
            this.getSuperview().gameController.emit('Update Enemy');
            this.hidePrompt();
        }));

        this.menuView.on('Resume', bind(this, function() {
            GC.app.audioManager.play('buttonClick');
            this.hideMenu();
        }));

        this.menuView.on('End Game', bind(this, function() {
            GC.app.audioManager.play('buttonClick');
            this.getSuperview().emit('End Game');
        }));

        this.victoryView.on('End Game', bind(this, function() {
            GC.app.audioManager.play('buttonClick');
            this.getSuperview().emit('End Game');
        }));
    };
});