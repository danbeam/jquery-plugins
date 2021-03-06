/**
 * File        : jquery.flexyTips.js
 * Version     : 0.9.0
 * Requires    : jQuery v1.2.6 or later
 * Description : A flexible, un-obtrusive way to show a tool-tip almost anywhere
 *
 * Copyright (C) 2009 Dan Beam
 * Licensed under the MIT License: http://www.opensource.org/licenses/mit-license.php
 **/

; (function($) {

    // allow debug messages when boolean is true and firebug is present
    //var debug = false && window.console && window.console.log || function(){};

    // if there's something else named flexyTip on jQuery's prototype, sue me
    $.fn.flexyTip = function(tipHTML, settings) {

        //debug("flexyTip started with the following settings:");

        // merge the settings provided with these defaults
        settings = $.extend({
            "xStart"        : "right",
            "yStart"        : "top",
            "direction"     : "none",
            "showDuration"  : "medium",
            "hideDuration"  : "medium",
            "showEasing"    : "swing",
            "hideEasing"    : "swing",
            "tipCSS"        : {},
            "containerCSS"  : { "opacity" : "0" },
            "showAnimation" : { "opacity" : "1" },
            "hideAnimation" : { "opacity" : "0" },
            "onBeforeShow"  : function() {},
            "onBeforeHide"  : function() {},
            "onAfterShow"   : function() {},
            "onAfterHide"   : function() {}
        }, settings);

        // iterate over all 
        return $(this).each(function() {

            // these are global to both over and out hover functions
            var tip, container;

            // use jQuery's hover function for now, maybe switch to hoverIntent?
            $(this).hover(function() {
                
                //debug("Starting onMouseOver part of flexyTip");
                
                // global to both over and out hover functions
                container = document.createElement("span");
                tip       = document.createElement("span");

                // variables local to mouse over
                var srcEl     = $(this),
                    offset    = srcEl.offset(),
                    xOffset   = offset.left + ("right"  === settings["xStart"] ? srcEl.outerWidth()  : 0),
                    yOffset   = offset.top  + ("bottom" === settings["yStart"] ? srcEl.outerHeight() : 0),

                    containerCSS = {
                        "display"  : "block",
                        "position" : "absolute",
                        "overflow" : "hidden",
                        "left"     : xOffset + "px",
                        "top"      : yOffset + "px",
                    },
    
                    tipCSS = {
                        "display"  : "block",
                        "position" : "absolute"
                    },
    
                    sideBinding = {
                        "up"    : { "bottom" : "0px" },
                        "down"  : { "top"    : "0px" },
                        "left"  : { "right"  : "0px" },
                        "right" : { "left"   : "0px" },
                        "none"  : {}
                    },
    
                    // this is extended later
                    animation = {},

                    // this is overwritten later
                    tipDimensions,
                    startDimensions;

                // there's a container and an inner element, here we're inserting the
                // inner into the container (it doesn't live in the page DOM yet though)
                container.appendChild(tip);

                // only allow certain directions
                settings["direction"] = (settings["direction"].match(/left|right|up|down/) || ["none"]).pop(),

                // merge the styles on the inner element
                tipCSS = $.extend(tipCSS, sideBinding[settings["direction"]], settings["tipCSS"]);
    
                // apply the styles and set the innerHTML
                $(tip).css(tipCSS).html(tipHTML);

                // merge the conatiner's CSS together
                containerCSS = $.extend(containerCSS, settings["containerCSS"], tipDimensions);

                // apply the styles
                $(container).css(containerCSS);

                //debug("Inserting into DOM"); 

                // insert into DOM
                $('body').append(container);

                // the computed initial dimensions of the tool tip
                tipDimensions = {
                    "width"  : $(tip).outerWidth(),
                    "height" : $(tip).outerHeight()
                };

                // determine starting dimensions
                switch (settings["direction"]) {
                    case "up"    :
                    case "down"  :
                        startDimensions = { "width"  : tipDimensions.width + "px" };
                    break;
    
                    case "left"  :
                    case "right" :
                        startDimensions = { "height" : tipDimensions.height + "px" };
                    break;
    
                    case "none"  :
                    default      :
                        startDimensions = {
                            "width"  : tipDimensions.width  + "px",
                            "height" : tipDimensions.height + "px"
                        };
                    break;
                }

                // create an appropriate animation
                switch (settings["direction"]) {
                    case "left":
                        animation = $.extend(animation, {
                            "width" : tipDimensions.width + "px",
                            "left"  : "-=" + tipDimensions.width + "px"
                        });
                    break;
                    
                    case "right":
                        animation = $.extend(animation, { "width"  : tipDimensions.width + "px" });
                    break;
                    
                    case "up":
                        animation = $.extend(animation, {
                            "height" : tipDimensions.height + "px",
                            "top"    : "-=" + tipDimensions.height + "px"
                        });
                    break;
                        
                    case "down":
                        animation = $.extend(animation, { "height" : tipDimensions.height + "px" });
                    break;
                }

                // allow custom animations, this may a bad choice
                animation = $.extend(animation, settings["showAnimation"]);

                // set one of the sides to full width or height (depending on direction)
                $(container).css(startDimensions);

                //debug("Calling onBeforeShow callback");

                // call onShowStart as we insert into DOM
                settings.onBeforeShow(container, container);

                //debug("Starting show animation");

                // start animation with onShowEnd as callback
                $(container).animate(
                    animation,
                    settings["duration"],
                    settings["showEasing"],
                    function() {
                        //debug("Calling onAfterShow callback");
                        settings.onAfterShow.call(this, this);
                    }
                );
            },

            // on mouse out
            function() {

                //debug("Starting onMouseOut");

                var tipWidth       = $(tip).outerWidth(),
                    tipHeight      = $(tip).outerHeight(),
                    hideAnimation  = {};

                //debug("Calling onBeforeHide callback");

                // call onBeforeHide event
                settings.onBeforeHide.call(container, container);

                // if the user gave a direction, do something with it
                switch (settings["direction"]) {
                    case "left"  :
                        $.extend(hideAnimation, {
                            "width" : "hide",
                            "left"  : "+=" + tipWidth + "px"
                        });
                    break;
                    
                    case "right" :
                        $.extend(hideAnimation, { "width" : "hide" });
                    break;
                    
                    case "up"    :
                        $.extend(hideAnimation, {
                            "height" : "hide",
                            "top"    : "+=" + tipHeight + "px"
                        });
                    break;
                    
                    case "down"  :
                        $.extend(hideAnimation, { "height" : "hide" });
                    break;

                    // no default
                }

                // allow for custom animation
                hideAnimation = $.extend(hideAnimation, settings["hideAnimation"]);

                //debug("Starting hide animation:");

                // start animation with onHideEnd as callback
                $(container).animate(
                    hideAnimation,
                    settings["duration"],
                    settings["hideEasing"],
                    function() {
                        //debug("Calling onAfterHide callback");
                        settings.onAfterHide.call(this, this);
                        $(container).remove();
                    }
                );
            });
        });
    };
})(jQuery);
