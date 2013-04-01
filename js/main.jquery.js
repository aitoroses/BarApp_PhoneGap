/*!
 *
 *  Copyright (c) David Bushell | http://dbushell.com/
 *
 */

(function(window, document, undefined)
{

    window.App = (function()
    {

        var _init = false, app = { };

        app.init = function()
        {
            if (_init) {
                return;
            }
            _init = true;

            var nav_open = false;

            app.openNav = function() {
                if (!nav_open) {
                    $('html').addClass('js-nav', {duration:500});
                    nav_open = true;
                    return false;
                }
            };
            app.closeNav = function(){
                if (nav_open) {
                    $('html').removeClass('js-nav');
                    nav_open = false;
                    return false;
                }
            };
            $('#nav-open-btn').on('click', function()
            {
                app.openNav();
            });

            $('#nav-close-btn').on('click', function()
            {
                app.closeNav();
            });
            $('#main').on('click', function(e)
            {
                if (nav_open) {
                    e.preventDefault();
                    app.closeNav();
                }
            });

            $(document.documentElement).addClass('js-ready');
        };

        return app;

    })();

    $.fn.ready(function()
    {
        window.App.init();
    });

})(window, window.document);
