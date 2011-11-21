(function($) {    
    var _use3d,
        _scaleZ,
        _lengthUnits,
        _precision = 4;
    
    function getMatrixCssText(m11, m12, m21, m22, tx, ty) {
        if (_use3d) {
            return "matrix3d(" + 
                m11.toFixed(_precision) +
                "," +
                m12.toFixed(_precision) +
                ",0,0," + 
                m21.toFixed(_precision) + 
                "," + 
                m22.toFixed(_precision) +
                ",0,0,0,0," +
                _scaleZ +
                ",0," +
                tx.toFixed(_precision) +
                _lengthUnits + 
                "," +
                ty.toFixed(_precision) +
                _lengthUnits + 
                ",0,1)";
        } else {
            return "matrix(" + 
                m11.toFixed(_precision) +
                "," +
                m12.toFixed(_precision) +
                "," + 
                m21.toFixed(_precision) + 
                "," + 
                m22.toFixed(_precision) +
                "," +
                tx.toFixed(_precision) +
                _lengthUnits + 
                "," +
                ty.toFixed(_precision) +
                _lengthUnits + 
                ")";
        }
    }
    
    ko.bindingHandlers['transform'] = {
        'use3d': $.browser.webkit,
        'useZeroScaleZ': false,
        'useLengthUnits': $.browser.mozilla,
        
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel) {
            _use3d = ko.bindingHandlers['transform']['use3d'];
            _scaleZ = ko.bindingHandlers['transform']['useZeroScaleZ'] ? "0" : "1",
            _lengthUnits = ko.bindingHandlers['transform']['useLengthUnits'] ? "px" : "";
        },
        
        'update': function(element, valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor() || {});
            var m11 = ko.utils.unwrapObservable(value['m11']) || 1;
            var m12 = ko.utils.unwrapObservable(value['m12']) || 0;
            var m21 = ko.utils.unwrapObservable(value['m21']) || 0;
            var m22 = ko.utils.unwrapObservable(value['m22']) || 1;
            var tx = ko.utils.unwrapObservable(value['tx']) || 0;
            var ty = ko.utils.unwrapObservable(value['ty']) || 0;

            element.style.webkitTransform = 
                element.style.msTransform = 
                element.style.oTransform = 
                element.style.MozTransform = 
                getMatrixCssText(m11,m12,m21,m22,tx,ty);
        }
    };
} (jQuery))