import ui.View as View;

exports = Class(View, function (supr) {
	this.init = function (opts) {
		opts = merge(opts, {
			x: 0,
			y: 0,
			width: 320,
			height: 480,
		});

		supr(this, 'init', [opts]);

		this.build();
    };

    this.build = function() {

    };
});