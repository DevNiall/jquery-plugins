/*
 * Mediahub Accordion 0.1
 * Copyright (C) 2010 Edina - Niall Munro
 *
 * Mediahub Horizontal Accordion is a jQuery plugin that displays
 * slide out tabs.
 *
 * Requirements:
 *  - jQuery 1.4.2+, http://jquery.com/
 *  - CSS3 PIE 1.0beta2, http://css3pie.com/ (optional)
 */
/**
 *
 * @param {Object} options supports the following options:
 *     'debug':         (boolean) Enable debugging, required "console" object
 *                      being exposed to JavaScript
 *     'headers':       CSS selector string for header elements
 *     'intro':         CSS selector string for the introduction text element
 *     'opening_speed': Speed at which to animate the opening of a tab
 *     'closing_speed': Speed at which to animate the opening of a tab
 *     'tabs':          CSS selector string for tab elements
 *
 */
(function($){

    /**
     * The declaration of Mediahub horizontalAccordion jQuery plugin
     */
    $.fn.horizontalAccordion = function(options){

        /**
         * Private variables
         */
        var config, me;
        me = this;
        me.version = '0.1';
        jMe = $(me);

        // Set defaults
        config = {
            debug: false,
            headers: 'h3',
            intro: 'h2',
            opening_speed: 300,
            closing_speed: 600,
            tabs: 'div'
        }
        $.extend(config, options);

        headers = jMe.children(config.headers).get();
        tabs = jMe.children(config.tabs).get();

        jHeaders = $(headers);

        /**
         * Internal debugging function
         */
        this.debug = function(message){
            if (config.debug) {
                $.debug('horizontalAccordion: ' + message);
            }
        }

        me.debug('Edina Horizontal Accordion ' + me.version + ' started');

        // set necessary styles
        $(headers).css({
            position: 'absolute',
            top: -1
        });

        /*
         * Calcuate & store each tab & header's open position
         */
        $(headers).each(function(i){
            if (i) { // for all but the first tab and contents
                for (j = i; j < jHeaders.size(); j++) {
                    $(headers[j]).data('open', $(headers[j]).data('open') + $(this).width() - 1)
                    $(headers[j]).next().data('open', $(headers[j]).data('open') + $(headers[j]).outerWidth());
                }
            }
            else { // first tab and contents
                jHeaders.first().data('open', -1)
                jHeaders.first().next().data('open', jHeaders.first().outerWidth() - 1);
            }
        });


        /*
         * Calcuate & store each tab & header's closed position.
         */
        renderTabs = function(){

            // Need to walk backwards for this
            for (i = headers.length - 1; i >= 0; i--) {
                jThis = $(headers[i]);
                if (i == headers.length - 1) { //last tab
                    jThis.data('closed', jMe.width() - jThis.width())
                    jThis.css('left', jThis.data('closed'));

                    jThis.next().data('closed', jMe.width());
                    jThis.next().css('left', jThis.next().data('closed'));
                }
                else { //all other tabs
                    jThis.data('closed', $(headers[i + 1]).position().left - jThis.width())
                    jThis.css('left', jThis.data('closed'));

                    jThis.next().data('closed', $(headers[i + 1]).position().left);
                    jThis.next().css('left', jThis.next().data('closed'));
                }
            }
        }

        /* Recalcuate tab and header closed positions on window resize */
        $(window).resize(function(){
            me.debug('Window resize, recalculating tab & header closed positions.');
            renderTabs();
        });

        /**
         * Animate header & tab
         *
         * @param {object} tab element to open
         */
        openTab = function(focus){

            jFocus = $(focus);
            jFocus.addClass('focus');

            me.debug('Opening tab...');

            jFocus.next().prevAll(config.headers + ', ' + config.tabs).andSelf().stop().each(function(){
                $(this).animate({
                    left: $(this).data('open')
                }, config.opening_speed);
            });

            jFocus.next().nextAll(config.headers + ', ' + config.tabs).stop().each(function(){
                $(this).animate({
                    left: $(this).data('closed')
                }, config.closing_speed);
            });
        }

        /* Animation trigger */
        jHeaders.mouseenter(function(){
            openTab(this);
        });

        /* Accordion loss of focus */
        jMe.mouseleave(function(){
            jMe.children(config.headers + ', ' + config.tabs).stop().each(function(){
                $(this).animate({
                    left: $(this).data('closed')
                }, config.closing_speed);
            })
        });

        /* Kick shit off */
        renderTabs();

    };

    // Extend jQuery so that you can debug
    $.debug = function(message){
        if (window.console)
            console.log(message);
    };

})(jQuery);
