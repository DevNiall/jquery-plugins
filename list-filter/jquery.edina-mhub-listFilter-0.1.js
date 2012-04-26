/*!
 * Mediahub List Filter 0.1
 * Copyright (C) 2010 Edina - Niall Munro
 *
 * Requirements:
 *  - jQuery 1.4.2+, http://jquery.com/
 *
 *  Code based on the this tutorial:
 *  	http://net.tutsplus.com/tutorials/javascript-ajax/using-jquery-to-manipulate-and-filter-data/
 */
(function($){

    $.fn.listFilter = function(listSelector, options){

        /**
         * Private variables
         */
        var config, me, $listSelector, $me;
        me = this
        me.version = '0.1';
        $listSelector = $(listSelector);
        $me = $(me);

        // Set defaults
        config = {}
        $.extend(config, options);

        /**
         * Internal debugging function
         */
        this.debug = function(message){
            if (config.debug) {
                debug('listFilter: ' + message);
            }
        }

        /*
         * THE MEAT, YUM!
         */
        me.debug('Edina List Filter ' + me.version + ' started');

        // Filter results based on query
        function filter(query){
			$counterText = $('#collection-collections .filtered-list').find('.counterHidden:first');
			$hiddenCounter = 0;
			$hiddenChecked = 0;
            query = $.trim(query); // trim white space
            query = query.replace(/,\s*(.)/gi, '|$1'); // add OR for regex query
            query = query.replace(/,/gi, '');
            debug(query);
            $listSelector.children('li').each(function(){
                var $this = $(this);
				// hide the item if it doesn't match
                ($this.text().search(new RegExp(query, 'i')) < 0) ? $this.hide() : $this.show();
				// increment the hidden counter if this label doesn't match
				($this.text().search(new RegExp(query, 'i')) < 0) ? $hiddenCounter++ : $hiddenCounter=$hiddenCounter;
				// increment the hiddenChecked counter if this label doesn't match but is still selected
				($this.text().search(new RegExp(query, 'i')) < 0) ? (($this.find('input:checked').length > 0)? $hiddenChecked++: $hiddenChecked=$hiddenChecked) : $hiddenChecked=$hiddenChecked;
            });
			$counterText.text('Hiding '+$hiddenCounter+' items, of which ' + $hiddenChecked + ' are still selected');
        }

		$me.bind('keyup update', function(event){
            // if esc is pressed or nothing is entered
            if (event.keyCode == 27 || $me.val() == '') {
                // if esc is pressed we want to clear the value of search box
                $me.val('');

                // we want each row to be visible because if nothing
                // is entered then all rows are matched.
                $listSelector.children('li').show();
				//Counter text
                $('#collection-collections .filtered-list').find('.counterHidden:first').text('No collections hidden');
            }

            // if there is text, lets filter
            else {
            	filter($me.val());
            }

            $me.trigger('updated');
        });
    };
})(jQuery);
