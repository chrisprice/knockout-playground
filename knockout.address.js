// Prototype for an observable<->URL binding plugin.
(function () {
    var currentParams = {}, updateTimer, $ = window.jQuery;
    function serialise(value, type) { 
        if (type === "boolean") {
          return value ? "1" : "0";
        } else {
          return ((value === null) || (value === undefined)) ? value : value.toString();
        }
    }
    function deserialise(value, type) { 
        if (type === "boolean") {
          return value  === "1";
        } else if (type === "number") {
          return Number(value);
        }else {
          return value;
        }
    }
    // Gives an address (URL) to a view model state
    ko.linkObservableToUrl = function (observable, hashPropertyName, defaultValue, type) {
        // When the observable changes, update the URL
        observable.subscribe(function (value) {
            var valueToWrite = value === defaultValue ? null : serialise(value, type);
            if (currentParams[hashPropertyName] !== valueToWrite) {
                currentParams[hashPropertyName] = valueToWrite;
                queueAction(function () {
                    for (var key in currentParams)
                        $.address.parameter(key, currentParams[key]);
                    $.address.update();
                });
            }
        });

        // When the URL changes, update the observable
        $.address.change(function (evt) {
            var value = hashPropertyName in evt.parameters ? evt.parameters[hashPropertyName] : null;
            currentParams[hashPropertyName] = value;
            observable(value !== null ? deserialise(value, type) : defaultValue);
        });
    }
    
    ko.linkObservableGraphToUrl = function linkObservableGraphToUrl(root, prefix) {
      $.each(root, function(key, value) {
        var name = prefix ? prefix + key : key;
        if (ko.isWriteableObservable(value)) {
          var unwrappedValue = value();
          ko.linkObservableToUrl(value, name, unwrappedValue, typeof(unwrappedValue));    
        } else if (jQuery.isPlainObject(value)) {
          linkObservableGraphToUrl(value, name + ".");
        }
      })  
    }

    function queueAction(action) {
        if (updateTimer)
            clearTimeout(updateTimer);
        updateTimer = setTimeout(action, 0);
    }

    $.address.autoUpdate(false);
})();