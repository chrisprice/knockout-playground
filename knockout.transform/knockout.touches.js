(function($) {

    ko.bindingHandlers['touches'] = {
        'init': function(element, valueAccessor) {
            bindHandlers(element, valueAccessor());
        }
    };

    function dragStart(id, touchEvent, touchesArray, touchesById) {
        var touch = ko.observable(touchEvent);
        touchesById[id] = touch;
        touchesArray.push(touch);
    }

    function dragMove(id, touchEvent, touchesArray, touchesById) {
        var touch;
        if (touch = touchesById[id]) {
            touch(touchEvent);
        }
    }

    function dragEnd(id, touchEvent, touchesArray, touchesById) {
        var touch;
        if (touch = touchesById[id]) {
            touchesArray.remove(touch);
            touchesById[id] = null;
        }
    }
    
    function bindHandlers(element, touchesArray) {
        var touchesById = {};
        
        if (element === document.body) {
            element = document;
        }
        
        // (multi) touch handlers
        $(element).bind('touchstart',
        function(e) {
            e = e.originalEvent;
            var touch,
            j = 0;
            while (touch = e.changedTouches[j++]) {
                dragStart(touch.identifier, touch, touchesArray, touchesById);
            }
            e.preventDefault();
        }).bind('touchmove',
        function(e) {
            e = e.originalEvent;
            var touch,
            j = 0;
            while (touch = e.changedTouches[j++]) {
                dragMove(touch.identifier, touch, touchesArray, touchesById);
            }
        }).bind('touchend',
        function(e) {
            e = e.originalEvent;
            var touch,
            j = 0;
            while (touch = e.changedTouches[j++]) {
                dragEnd(touch.identifier, touch, touchesArray, touchesById);
            }
        });

        // mouse handlers
        $(element).mousedown(function(e) {
            dragStart("MOUSE", e, touchesArray, touchesById);
            e.preventDefault();
        }).mousemove(function(e) {
            dragMove("MOUSE", e, touchesArray, touchesById);
        }).mouseup(function(e) {
            dragEnd("MOUSE", e, touchesArray, touchesById);
        });
    }
} (jQuery))