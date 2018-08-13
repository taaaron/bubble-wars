import ui.widget.ButtonView as ButtonView;

exports = Class(ButtonView, function (supr) {
    this.init = function(opts) {
        opts = merge(opts, {
            width: 300,
            height: 100,
            images: {
                up: 'resources/images/ui/buttons/basic_button.png',
                down: 'resources/images/ui/buttons/basic_button_down.png',
                disabled: 'resources/images/ui/buttons/basic_button.png'
            },
            scaleMethod: '9slice',
			sourceSlices: {
				horizontal: {left: 10, center: 80, right: 10},
				vertical: {top: 10, center: 50, bottom: 10}
            },
            destSlices: {
                horizontal: {left: 20, right: 20},
                vertical: {top: 20, bottom: 20}
            },
            title: 'BUTTON',
            text: {
                color: 'white',
                fontFamily: 'KenVector Future Thin',
                size: 50
            }
        });

        supr(this, 'init', [opts]);
    };
});