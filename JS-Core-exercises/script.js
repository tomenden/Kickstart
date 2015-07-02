/**
 * Created by tome on 7/1/15.
 */

// The .bind method
Function.prototype.bind = function () {
    var fn = this,
        args = Array.prototype.slice.call(arguments),
        object = args.shift();

    return function () {
        return fn.apply(object,
            args.concat(Array.prototype.slice.call(arguments)));
    };
};
