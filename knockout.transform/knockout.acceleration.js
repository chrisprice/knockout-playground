(function($) {
    var acceleration = ko.observable({
        x: 0,
        y: 0
    });
    // accelerometer handlers
    $(window).bind('devicemotion',
    function(e) {
        e = e.originalEvent.accelerationIncludingGravity;
        switch (window.orientation) {
        case 0:
            acceleration({
                x: -e.x,
                y: e.y
            });
            break;
        case 90:
            acceleration({
                x: e.y,
                y: e.x
            });
            break;
        case 180:
            acceleration({
                x: e.x,
                y: -e.y
            });
            break;
        case - 90:
            acceleration({
                x: -e.y,
                y: -e.x
            });
            break;
        }
    });
    // read-only proxy
    window.accelerationObservable = ko.dependentObservable({
        read: function() {
            return acceleration();
        }
    });
} (jQuery))