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

    this.isRowNull = function() {
        for(var bubble of this.bubbles) {
            if(bubble !== null) {
                return false;
            }
        }
        return true;
    };

    this.build = function() {

    };
});