/**
 * jQuery Wait Plugin
 *
 * Exampl code:
 * <code>
 * $.wait(2).done(function() {
 *     // Execute after 2 seconds
 * });
 *
 * $.wait(5)
 *     .progress(function(args, degree) {
 *         // waiting... (progress is {degree}msec/5sec)
 *     })
 *     .done(function() {
 *         // Completing
 *     });
 *
 * var args = {...};
 * $.wait(10, args).done(function(args) {
 *     // Execute with the args
 * });
 * </code>
 *
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/GPL-2.0
 */
(function(global, $, undefined) {
    'use strict';

    var THOUSAND_MILLISECONDS = 1000;
    var TENTH_OF_SECOND       = 100;

    /**
     * calls a function or evaluates an expression after a specified seconds.
     *
     * more expressive setTimeout
     * State of the Deferred object is "pending" to "resolved"
     *
     * @param {Number} seconds number of seconds to wait before executing the code.
     * @param options arguments of code to be executed.
     */
    $.wait = function(seconds, options) {
        var deferred = $.Deferred();

        setTimeout(function() {
            deferred.resolve(options);
        }, seconds * THOUSAND_MILLISECONDS);

        var count = 0;
        (function working() {
            if (deferred.state() === 'pending') {
                var progress = ++count * TENTH_OF_SECOND;
                deferred.notify(options, progress);
                setTimeout(working, TENTH_OF_SECOND);
            };
        }) ();

        var promise = deferred.promise();

        return promise;
    };
}) (this, jQuery);
