/*
 * File: jquery.flexyTips.js
 * Version: 1.0.0 (Jan. 4, 2009)
 * Copyright (C) 2009 Dan Beam
 * Licensed under the MIT License: http://www.opensource.org/licenses/mit-license.php
 * Requires: jQuery v1.2.6 or later
 * Description: A flexible, un-obtrusive way to show a tool-tip almost anywhere
 */

;;;;;(function($) {

    $.fn.flexyTip = function(html, settings) {

        var defaultParams = {
            "xStart"        : "right",
            "yStart"        : "top",
            "direction"     : "none",
            "tipCSS"        : {},
            "containerCSS"  : { "opacity" : "0" },
            "showAnimation" : { "opacity" : "1" },
            "hideAnimation" : { "opacity" : "0" },
            "showDuration"  : "medium",
            "hideDuration"  : "medium",
            "showEasing"    : "swing",
            "hideEasing"    : "swing",
            "onBeforeShow"  : function() {},
            "onBeforeHide"  : function() {},
            "onAfterShow"   : function() {},
            "onAfterHide"   : function() {}
        };

        settings = $.extend(defaultParams, settings);

        return $(this).each(function() {

            $(this).hover(function() {

                var srcEl = $(this), offset = srcEl.offset(),
                    xOffset = offset.left + ("right" == settings["xStart"] ? srcEl.outerWidth() : 0), yOffset = offset.top + ("bottom" == settings["yStart"] ? srcEl.outerHeight() : 0),
                    direction = /left|right|up|down/.test(settings["direction"]) ? settings["direction"] : "none",
                            
                    container = document.createElement("span"),
                    tip = document.createElement("span"),

    
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
    
                    sideBinding = positionBinding[settings["direction"]];

                tipCSS = $.extend(tipCSS, sideBinding, settings["tipCSS"]);
                containerCSS = $.extend(containerCSS, settings["containerCSS"]);

                // add the CSS to the cotainer
                // and set the id to flexyLink
                $(container).css(containerCSS).attr("id", "flexyTip");

                // add the CSS to the pop and
                // populate with HTML
                $(tip).css(tipCSS).html(html);

                container.appendChild(tip);

                // call onShowStart as we insert into DOM
                settings.onBeforeShow($('body')[0].appendChild(container));

                var    tipWidth = $(tip).outerWidth(),
                    tipHeight = $(tip).outerHeight();

                // determine starting dimensions
                switch (settings["direction"]) {
                    case "up":
                    case "down":
                        var startDimensions = { "width" : tipWidth + "px" };
                    break;
    
                    case "left":
                    case "right":
                        var startDimensions = { "height" : tipHeight + "px" };
                    break;
    
                    case "none":
                    default:
                        var startDimensions = {
                            "width"  : tipWidth + "px",
                            "height" : tipHeight + "px"
                        };
                    break;
                }

                // set one of the sides to full
                // width or height (depending on
                // direction)
                $(container).css(startDimensions);

                // create an appropriate
                // animation
                switch (direction) {
                    case "left":
                        var animation = {
                            "width" : tipWidth + "px",
                            "left"  : "-=" + tipWidth + "px"
                        };
                    break;
                    
                    case "right":
                        var animation = { "width" : tipWidth + "px" };
                    break;
                    
                    case "up":
                        var animation = {
                            "height" : tipHeight + "px",
                            "top"    : "-=" + tipHeight + "px"
                        };
                    break;
                        
                    case "down":
                        var animation = { "height" : tipHeight + "px" };
                    break;
                }

                animation = $.extend(animation, settings["showAnimation"]);

                // start animation with
                // onShowEnd as callback
                $(container).animate(
                    animation,
                    settings["duration"],
                    settings["showEasing"],
                    settings.onAfterShow
                );
            },

            // on mouse out
            function() {

                var container = $("#flexyTip"),
                    tip = container.children(),
                    tipWidth = $(tip).outerWidth(),
                    tipHeight = $(tip).outerHeight();

                settings.onBeforeHide(container);

                switch (settings["direction"]) {
                    case "left":
                        var hideAnimation = {
                            "width" : "hide",
                            "left"  : "+=" + tipWidth + "px"
                        };
                    break;
                    
                    case "right":
                        var hideAnimation = { "width" : "hide" };
                    break;
                    
                    case "up":
                        var hideAnimation = {
                            "height" : "hide",
                            "top"    : "+=" + tipHeight + "px"
                        };
                    break;
                    
                    case "down":
                        var hideAnimation = { "height" : "hide" };
                    break;
                    
                    default:
                        var hideAnimation = {};
                    break;
                }

                hideAnimation = $.extend(hideAnimation, settings["hideAnimation"]);

                // start animation with
                // onHideEnd as callback
                container.animate(
                    hideAnimation,
                    settings["duration"],
                    settings["hideEasing"],
                    function() {
                        settings.onAfterHide();
                        container.remove();
                    }
                );
            });
        });
    };
})(jQuery);
