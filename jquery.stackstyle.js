/**
* stackStyle plugin - push and pop styles onto/off of a node
*
* @fileOverview  Pushes styles on and off of a node in a stack-like fashion
* @author        Dan Beam <dan@danbeam.org>
* @method        pushStyle
* @method        popStyle
* @param         {object} conf - configuration objects to override the defaults
* @return        {jQuery} an instance of jQuery with the original nodes
*
* Copyright (c) 2011 Dan Beam
* Licensed under the MIT License: http://www.opensource.org/licenses/mit-license.php
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE.
*/
(function ($) {

    // keep all default options here
    var defaultConf = {'dataKey' : 'stackStyle'};

    // when we want to push styles onto our node's stack
    $.fn.pushStyle = function (css, conf) {

        // inherit defaults
        conf = $.extend(defaultConf, conf || {});

        // iterate over all nodes in the set
        return this.each(function (i, el) {

            var $el     = $(el),
                current = {},
                prev    = $el.data(conf.dataKey);

            // get the current local style of that node (can't use .css() as it's the computed style)
            $.each(css, function (key) {
                current[key] = $.style(el, key) || '';
            });

            // if there's an array as the previous data, just push to it
            if ($.isArray(prev)) {
                prev.push(current);
            }
            // otherwise create an Array on the data
            else {
                $el.data(conf.dataKey, [current]);
            }

            // apply the style
            $el.css(css);

        });

    };

    // pop and apply most recent set of styles
    $.fn.popStyle = function (conf) {

        // inherit defaults
        conf = $.extend(defaultConf, conf || {});

        // iterate over all nodes in the set
        return this.each(function (i, el) {

            var $el = $(el),
                old = $el.data(conf.dataKey);

            // apply styles if they exist
            $el.css($.isArray(old) ? old.pop() || '' : '');

        });

    };

}(jQuery));
