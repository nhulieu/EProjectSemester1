(function ($) {
    // Local storage check
    function supportsStorage() {
        try {
            return 'localStorage' in window && window['localStorage'] !== null;
        } catch (e) {
            return false;
        }
    }

    if (supportsStorage() === true) {
        var methods = {
            get : function () {
                var user = JSON.parse(localStorage.getItem('shoppingCartUser'));
                if(user != null){
                    return user;
                }else{
                    $.error('No user found !!!!');
                }
            }
        }
    } else {
        $.error('jQuery.shoppingcart: window.localStorage is NOT available!');
    }

    $.shoppingcartuser = function (method) {
        // Method call logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' not exist in jQuery.shoppingcartuser');
        }
    };

})(jQuery);    