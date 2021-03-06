/*    clickToggler  jQuery Plugin.
**    Version:   1.2
**    Author:  Joe Wagner
**
**    New in this version:
**          -Now you can designate what is passed to your functions as 'this' by using the 
**           context setting.  Each handler is called with two arguments, settings and the element that was clicked respectively.
**
**          -The classBinder setting is no longer a bolean.  It is now either false, or a string
**           that can be used as -$(classBinder)- to create a jQuery object list.
*/

(function( $ ){

 $.fn.clickToggler = function() {

  //  Turns the arguments object into an array
    var argArray = Array.prototype.slice.call(arguments);

  // Create the variable settings and extend it if provided when clickToggler was called  
    if (!jQuery.isFunction(argArray[0])) {
      if (argArray[0].el) {
        // leave old API intact
        argArray[0].context = argArray[0].el;
      }
      var settings = $.extend({
        'classBinder' : false,
        'primer': false,
        'context': this
      }, argArray[0]);
      argArray.splice(0,1);
    } else {
      var settings = {'classBinder' : false, 'primer' : false, 'context': this};
    };
    
    // Apply the classBinder setting if it was used.  This allows elements with multiple classes, but the classBinder class must be listed first.
    if (settings.classBinder) {
      var expres = settings.classBinder;
    }
      
    return this.each(function () {
      // gives reference to the clicked element in callback functions.
      var $this = $(this); 
      var click_num = [];
      // iterate through each function in the argument array naming them click_num[index]
      for (var i = 0; i < argArray.length; i++) {
        // argArray[j] will be the next function bound to click
        j = i + 1;
        // for the last function in the argument array
        if (j > argArray.length - 1) {
          if (settings.primer && $.isNumeric(settings.primer)) { 
             $this.data('primed', true);
             // ignore argArray[value < primer] after first time through
             j = settings.primer;
          } else {
            // no primer
            j = 0;
          }
          
        }
        // create click_num functions that bind click event to each other  
        click_num[i] = function (i, j) {
          return function () {
            // Begin classBinder conditionals
            // if the parent calling element is in its starting state then
            // return other classBinder elements to their starting state
            if (settings.classBinder && !$this.data('togFiring')) {
              // call function once with every element that has the class assigned to classBinder
              $(expres).each(function () {
            
                while ($(this).data('togFiring')) {  // loop until the local calling element is returned to its starting state
                  // if the local calling element is not the parent calling element
                  if ($(this) != $this) {
                    // trigger the click event until its back to its starting state.
                    $(this).trigger('click');
                  }
                }
              });

            }

            // set the value of togFiring to feed the classBinder conditionals 
            if (settings.primer) {
              if (i == 0 || j == settings.primer) {
                  $this.data('togFiring', true);
              }; 
              if (j == 0 || i == settings.primer) {
                  $this.data('togFiring', false);
              };
            } else {
              if (i == 0) {
                $this.data('togFiring', true);
              } 
            
              if (j == 0) {
                $this.data('togFiring', false);
              }
            }
            // call the intended function with settings.context as 'this'
            argArray[i].call( $(settings.context), settings, this);
            $this.off("click", click_num[i]);     // un-assign the the function
            $this.on("click", click_num[j]);      // assign the the next function
          };
        }(i, j);
          
      };
      
      $this.on("click", click_num[0]);  //  finally assign the first click_num to click 
                
    });
      
   
 };
        
  
})( jQuery );