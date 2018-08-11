import ui.View as View;

exports = Class(View, function(supr) {
    this.init = function(opts) {
        opts = merge(opts, {
            tag: 'BubbleRow'
        });

        supr(this, 'init', [opts]);

        this.bubbles = [];

        this.build();
    };

    this.build = function() {

    };
});