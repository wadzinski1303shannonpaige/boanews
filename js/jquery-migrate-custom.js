/*
* 02/27/2018 - DSST Account Servicing
* Cherry Picking jQuery deprecated methods from jQuery-migrate 1.4.1, which were removed in jQuery-migrate-3.0.1
* Deprecated methods list: ["live", "die", "browser", "trigger"]
*/
(function (jQuery, window, logging) {
    var oldLive = jQuery.fn.live,
        oldDie = jQuery.fn.die,
        oldInit = jQuery.fn.init,
        ajaxEvents = "ajaxStart|ajaxStop|ajaxSend|ajaxComplete|ajaxError|ajaxSuccess",
	    rajaxEvent = new RegExp("\\b(?:" + ajaxEvents + ")\\b"),
        eventTrigger = jQuery.event.trigger,
        rspaceAngle = /^\s*</,
        rquickExpr = /^([^<]*)(<[\w\W]+>)([^>]*)$/;
        

    function logWarn(msg) {
        var console = window.console;
        if(console && console.warn && logging){
            console.warn("JQMIGRATE: " + msg);
        }
    }
	var warnedAbout = {};
	function migrateWarn( msg) {
	var console = window.console;
	if ( !warnedAbout[ msg ] ) {
		warnedAbout[ msg ] = true;
		jQuery.migrateWarnings.push( msg );
		if ( console && console.warn && !jQuery.migrateMute ) {
			console.warn( "JQMIGRATE: " + msg );
			if ( jQuery.migrateTrace && console.trace ) {
				console.trace();
			}
		}
	}
}
	function migrateWarnProp( obj, prop, value, msg ) {
	if ( Object.defineProperty ) {
		// On ES5 browsers (non-oldIE), warn if the code tries to get prop;
		// allow property to be overwritten in case some other plugin wants it
		try {
			Object.defineProperty( obj, prop, {
				configurable: true,
				enumerable: true,
				get: function() {
					migrateWarn( msg );
					return value;
				},
				set: function( newValue ) {
					migrateWarn( msg );
					value = newValue;
				}
			});
			return;
		} catch( err ) {
			// IE8 is a dope about Object.defineProperty, can't warn there
		}
	}

	// Non-ES5 (or broken) browser; just set the property
	jQuery._definePropertyBroken = true;
	obj[ prop ] = value;
}


//
var attrFn = jQuery( "<input/>", { size: 1 } ).attr("size") && jQuery.attrFn,
	oldAttr = jQuery.attr,
	valueAttrGet = jQuery.attrHooks.value && jQuery.attrHooks.value.get ||
		function() { return null; },
	valueAttrSet = jQuery.attrHooks.value && jQuery.attrHooks.value.set ||
		function() { return undefined; },
	rnoType = /^(?:input|button)$/i,
	rnoAttrNodeType = /^[238]$/,
	rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
	ruseDefault = /^(?:checked|selected)$/i;

// jQuery.attrFn Added below changes for attr('value')


migrateWarnProp( jQuery, "attrFn", attrFn || {}, "jQuery.attrFn is deprecated" );

jQuery.attr = function( elem, name, value, pass ) {
	var lowerName = name.toLowerCase(),
		nType = elem && elem.nodeType;

	if ( pass ) {
		// Since pass is used internally, we only warn for new jQuery
		// versions where there isn't a pass arg in the formal params
		if ( oldAttr.length < 4 ) {
			migrateWarn("jQuery.fn.attr( props, pass ) is deprecated");
		}
		if ( elem && !rnoAttrNodeType.test( nType ) &&
			(attrFn ? name in attrFn : jQuery.isFunction(jQuery.fn[name])) ) {
			return jQuery( elem )[ name ]( value );
		}
	}

	// Warn if user tries to set `type`, since it breaks on IE 6/7/8; by checking
	// for disconnected elements we don't warn on $( "<button>", { type: "button" } ).
	if ( name === "type" && value !== undefined && rnoType.test( elem.nodeName ) && elem.parentNode ) {
		migrateWarn("Can't change the 'type' of an input or button in IE 6/7/8");
	}

	// Restore boolHook for boolean property/attribute synchronization
	if ( !jQuery.attrHooks[ lowerName ] && rboolean.test( lowerName ) ) {
		jQuery.attrHooks[ lowerName ] = {
			get: function( elem, name ) {
				// Align boolean attributes with corresponding properties
				// Fall back to attribute presence where some booleans are not supported
				var attrNode,
					property = jQuery.prop( elem, name );
				return property === true || typeof property !== "boolean" &&
					( attrNode = elem.getAttributeNode(name) ) && attrNode.nodeValue !== false ?

					name.toLowerCase() :
					undefined;
			},
			set: function( elem, value, name ) {
				var propName;
				if ( value === false ) {
					// Remove boolean attributes when set to false
					jQuery.removeAttr( elem, name );
				} else {
					// value is true since we know at this point it's type boolean and not false
					// Set boolean attributes to the same name and set the DOM property
					propName = jQuery.propFix[ name ] || name;
					if ( propName in elem ) {
						// Only set the IDL specifically if it already exists on the element
						elem[ propName ] = true;
					}

					elem.setAttribute( name, name.toLowerCase() );
				}
				return name;
			}
		};

		// Warn only for attributes that can remain distinct from their properties post-1.9
		if ( ruseDefault.test( lowerName ) ) {
			migrateWarn( "jQuery.fn.attr('" + lowerName + "') might use property instead of attribute" );
		}
	}

	return oldAttr.call( jQuery, elem, name, value );
};

// attrHooks: value
jQuery.attrHooks.value = {
	get: function( elem, name ) {
		var nodeName = ( elem.nodeName || "" ).toLowerCase();
		if ( nodeName === "button" ) {
			return valueAttrGet.apply( this, arguments );
		}
		if ( nodeName !== "input" && nodeName !== "option" ) {
			migrateWarn("jQuery.fn.attr('value') no longer gets properties");
		}
		return name in elem ?
			elem.value :
			null;
	},
	set: function( elem, value ) {
		var nodeName = ( elem.nodeName || "" ).toLowerCase();
		if ( nodeName === "button" ) {
			return valueAttrSet.apply( this, arguments );
		}
		if ( nodeName !== "input" && nodeName !== "option" ) {
			migrateWarn("jQuery.fn.attr('value', val) no longer sets properties");
		}
		// Does not return so that setAttribute is also used
		elem.value = value;
	}
};

    // $(html) "looks like html" rule change
    jQuery.fn.init = function (selector, context, rootjQuery) {
        var match, ret;

        if (selector && typeof selector === "string") {
            if (!jQuery.isPlainObject(context) &&
                    (match = rquickExpr.exec(jQuery.trim(selector))) && match[0]) {

                // This is an HTML string according to the "old" rules; is it still?
                if (!rspaceAngle.test(selector)) {
                    logWarn("$(html) HTML strings must start with '<' character");
                }
                if (match[3]) {
                    logWarn("$(html) HTML text after last tag is ignored");
                }

                // Consistently reject any HTML-like string starting with a hash (gh-9521)
                // Note that this may break jQuery 1.6.x code that otherwise would work.
                if (match[0].charAt(0) === "#") {
                    logWarn("HTML string cannot start with a '#' character");
                    jQuery.error("JQMIGRATE: Invalid selector string (XSS)");
                }

                // Now process using loose rules; let pre-1.8 play too
                // Is this a jQuery context? parseHTML expects a DOM element (#178)
                if (context && context.context && context.context.nodeType) {
                    context = context.context;
                }

                if (jQuery.parseHTML) {
                    return oldInit.call(this,
                            jQuery.parseHTML(match[2], context && context.ownerDocument ||
                                context || document, true), context, rootjQuery);
                }
            }
        }

        ret = oldInit.apply(this, arguments);

        // Fill in selector and context properties so .live() works
        if (selector && selector.selector !== undefined) {
            // A jQuery object, copy its properties
            ret.selector = selector.selector;
            ret.context = selector.context;

        } else {
            ret.selector = typeof selector === "string" ? selector : "";
            if (selector) {
                ret.context = selector.nodeType ? selector : context || document;
            }
        }
        return ret;
    };
    jQuery.fn.init.prototype = jQuery.fn;

    jQuery.fn.live = function (types, data, fn) {
        logWarn("jQuery.fn.live() is deprecated");
        if (oldLive) {
            return oldLive.apply(this, arguments);
        }
        jQuery(this.context).on(types, this.selector, data, fn);
        return this;
    };

    jQuery.fn.die = function (types, fn) {
        logWarn("jQuery.fn.die() is deprecated");
        if (oldDie) {
            return oldDie.apply(this, arguments);
        }
        jQuery(this.context).off(types, this.selector || "**", fn);
        return this;
    };

    // Turn global events into document-triggered events
    jQuery.event.trigger = function (event, data, elem, onlyHandlers) {
        if (!elem && !rajaxEvent.test(event)) {
            logWarn("Global events are undocumented and deprecated");
        }
        return eventTrigger.call(this, event, data, elem || document, onlyHandlers);
    };

    jQuery.uaMatch = function (ua) {
        ua = ua.toLowerCase();

        var match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
            /(webkit)[ \/]([\w.]+)/.exec(ua) ||
            /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
            /(msie) ([\w.]+)/.exec(ua) ||
            ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
            [];

        return {
            browser: match[1] || "",
            version: match[2] || "0"
        };
    };

    // Don't clobber any existing jQuery.browser in case it's different
    if (!jQuery.browser) {
        matched = jQuery.uaMatch(navigator.userAgent);
        browser = {};

        if (matched.browser) {
            browser[matched.browser] = true;
            browser.version = matched.version;
        }

        // Chrome is Webkit, but Webkit is also Safari.
        if (browser.chrome) {
            browser.webkit = true;
        } else if (browser.webkit) {
            browser.safari = true;
        }

        jQuery.browser = browser;
    }

})(jQuery, window, false);