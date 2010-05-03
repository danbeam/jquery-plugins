/* File        : jquery.flexyTips.js
 * Version     : 1.0.0 (Jan. 4, 2009)
 * Requires    : jQuery v1.2.6 or later
 * Description : A flexible, un-obtrusive way to show a tool-tip almost anywhere
 * Copyright (C) 2009 Dan Beam
 * Licensed under the MIT License: http://www.opensource.org/licenses/mit-license.php
 */

; (function($) {

    // allow debug messages when boolean is true and firebug is present
    var debug = window.console && window.console.log || function(){};

    // if there's something else named flexyTip on jQuery's prototype, sue me
    $.fn.flexyTip = function(html, settings) {

        debug("flexyTip started with the following settings:");

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
        },
        settings);

        // iterate over all 
        return $(this).each(function() {

            // these are global to both over and out hover functions
            var tip, container;

            // use jQuery's hover function for now, maybe switch to hoverIntent?
            $(this).hover(function() {
                
                debug("Starting onMouseOver part of flexyTip");
                
                // these are global to both over and out hover functions
                container = document.createElement("span");
                tip       = document.createElement("span");

                // start really long var statement

                var srcEl     = $(this),
                    offset    = srcEl.offset(),
                    xOffset   = offset.left + ("right"  == settings["xStart"] ? srcEl.outerWidth()  : 0),
                    yOffset   = offset.top  + ("bottom" == settings["yStart"] ? srcEl.outerHeight() : 0),

                    tipWidth  = $(tip).outerWidth(),
                    tipHeight = $(tip).outerHeight(),

                    containerCSS = {
                        "display"  : "block",
                        "position" : "absolute",
                        "overflow" : "hidden",
                        "left"     : xOffset + "px",
                        "top"      : yOffset + "px"
                    },
    
                    tipCSS = {
                        "display"  : "block",
                        "position" : "absolute"
                    },
    
                    positionBinding = {
                        "up"    : { "bottom" : "0px" },
                        "down"  : { "top"    : "0px" },
                        "left"  : { "right"  : "0px" },
                        "right" : { "left"   : "0px" },
                        "none"  : {}
                    },
    
                    direction   = /left|right|up|down/.test(settings["direction"]) ? settings["direction"] : "none",
                    sideBinding = positionBinding[direction],

                    // this is extended later
                    animation = {},

                    // this is overwritten later
                    startDimensions;

                // extend default CSS
                tipCSS       = $.extend(tipCSS, sideBinding, settings["tipCSS"]);
                containerCSS = $.extend(containerCSS, settings["containerCSS"]);

                // add the CSS to the cotainer and add the ID
                $(container).css(containerCSS);

                // add the CSS to the pop and populate with HTML
                $(tip).css(tipCSS).html(html);

                // there's a container and an inner element, here we're inserting the
                // inner into the container (it doesn't live in the page DOM yet though)
                container.appendChild(tip);

                // determine starting dimensions
                switch (settings["direction"]) {
                    case "up"    :
                    case "down"  :
                        startDimensions = { "width"  : tipWidth + "px" };
                    break;
    
                    case "left"  :
                    case "right" :
                        startDimensions = { "height" : tipHeight + "px" };
                    break;
    
                    case "none"  :
                    default      :
                        startDimensions = {
                            "width"  : tipWidth + "px",
                            "height" : tipHeight + "px"
                        };
                    break;
                }

                // create an appropriate animation
                switch (direction) {
                    case "left":
                        animation = $.extend(animation, {
                            "width" : tipWidth + "px",
                            "left"  : "-=" + tipWidth + "px"
                        });
                    break;
                    
                    case "right":
                        animation = $.extend(animation, { "width"  : tipWidth + "px" });
                    break;
                    
                    case "up":
                        animation = $.extend(animation, {
                            "height" : tipHeight + "px",
                            "top"    : "-=" + tipHeight + "px"
                        });
                    break;
                        
                    case "down":
                        animation = $.extend(animation, { "height" : tipHeight + "px" });
                    break;
                }

                // allow custom animations, this may a bad choice
                animation = $.extend(animation, settings["showAnimation"]);

                // set one of the sides to full width or height (depending on direction)
                $(container).css(startDimensions);

                debug("Calling onBeforeShow callback");

                // call onShowStart as we insert into DOM
                settings.onBeforeShow(container, container);

                debug("Inserting into DOM"); 

                // insert into DOM
                $('body').append(container);

                debug("Starting show animation");

                // start animation with
                // onShowEnd as callback
                $(container).animate(
                    animation,
                    settings["duration"],
                    settings["showEasing"],
                    function() {
                        debug("Calling onAfterShow callback");
                        settings.onAfterShow.call(this, this);
                    }
                );
            },

            // on mouse out
            function() {

                debug("Starting onMouseOut");

                var tipWidth       = $(tip).outerWidth(),
                    tipHeight      = $(tip).outerHeight(),
                    hideAnimation  = {};

                debug("Calling onBeforeHide callback");

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

                debug("Starting hide animation:");

                // start animation with onHideEnd as callback
                $(container).animate(
                    hideAnimation,
                    settings["duration"],
                    settings["hideEasing"],
                    function() {
                        debug("Calling onAfterHide callback");
                        settings.onAfterHide.call(this, this);
                        $(container).remove();
                    }
                );
            });
        });
    };
})(jQuery);
