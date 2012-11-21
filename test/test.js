(function(global, undefined) {

    /** Group related tests */
    module('jQuery Wait Plugin');

    asyncTest('Asynchronous wait to do', function() {
        expect(1);

        $.wait(1)
            .done(function() {
                ok(true, "Are processed from the wait");
                start();
            });
    });

    asyncTest('After a specified seconds', function() {
        expect(2);

        var beforeMillisecond = (new Date).getTime();

        $.wait(3)
            .done(function() {
                var afterMillisecond = (new Date).getTime();
                var timelag = (afterMillisecond - beforeMillisecond);
                ok((timelag > 2900), 'time lag is 0.1 seconds or less (x > 2.9sec)');
                ok((timelag < 3100), 'time lag is 0.1 seconds or less (x < 3.1sec)');
                start();
            });
    });

    asyncTest('Progress count', function() {
        expect(3);

        var count   = 0;
        var promise = $.wait(3)
            .progress(function() {
                count++;
            });

        (function loop() {
            if (promise.state() === 'resolved') {
                ok((count >= 29), 'Acceptable error of 0.01 seconds (progress of a single)');
                ok((count <= 30), 'No verbose repetition');
                ok((count === 30), 'progress count');
                start();
            } else {
                setTimeout(loop, 1000);
            };
        }) ();
    });

    asyncTest('State of deferred object', function() {
        expect(2);

        $.wait(0.1)
            .done(function() {
                var state = this.state();
                equal(state, 'resolved', 'Promise is resolved');
                start();
            })
            .progress(function() {
                var state = this.state();
                equal(state, 'pending', 'Promise is pending');
            });
    });

    asyncTest('notify args', function() {
        expect(1);

        var memory  = '0';
        var promise = $.wait(1, function(progress) {
                memory += progress;
            })
            .done(function(symbol) {
                symbol('EOF');
            })
            .progress(function(symbol) {
                symbol('#');
            });

        (function loop() {
            if (promise.state() === 'resolved') {
                equal(memory, '0##########EOF', 'Progress bar');
                start();
            } else {
                setTimeout(loop, 100);
            };
        }) ();
    });

    asyncTest('Degree count', function() {
        expect(1);

        var memory  = 0;
        var promise = $.wait(1)
            .progress(function(args, degree) {
                memory += degree;
            });

        (function loop() {
            if (promise.state() === 'resolved') {
                equal(memory, 5500, 'Degree count');
                start();
            } else {
                setTimeout(loop, 100);
            };
        }) ();
    });
}) (this);
