
(function($) {
if ( !$.uaMatch ) {
	$.uaMatch = function( ua ) {
		ua = ua.toLowerCase();
		var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
			/(webkit)[ \/]([\w.]+)/.exec( ua ) ||
			/(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
			/(msie) ([\w.]+)/.exec( ua ) ||
			ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
			[];
		return {
			browser: match[ 1 ] || "",
			version: match[ 2 ] || "0"
		};
	};
}

if ( !$.browser ) {
	matched = $.uaMatch( navigator.userAgent );
	browser = {};

	if ( matched.browser ) {
		browser[ matched.browser ] = true;
		browser.version = matched.version;
	}

	// Chrome is Webkit, but Webkit is also Safari.
	if ( browser.chrome ) {
		browser.webkit = true;
	} else if ( browser.webkit ) {
		browser.safari = true;
	}

	$.browser = browser;
}

/**
 * Chainable method for converting elements into rich media.
 *
 * @name media
 * @param Object options Options object
 * @param Function callback fn invoked for each matched element before conversion
 * @param Function callback fn invoked for each matched element after conversion
 * @cat Plugins/media
 */
$.fn.media = function(options, f1, f2) {
    return this.each(function() {
        
        if (typeof options == 'function') {
            f2 = f1;
            f1 = options;
            options = {};
        }
        var o = getSettings(this, options);
        // pre-conversion callback, passes original element and fully populated options
        if (typeof f1 == 'function') f1(this, o);
        
        var r = getTypesRegExp();
        var m = r.exec(o.src.toLowerCase()) || [''];
        o.type ? m[0] = o.type : m.shift();
        for (var i=0; i < m.length; i++) {
            fn = m[i].toLowerCase();
            
            if (isDigit(fn[0])) fn = 'fn' + fn; // fns can't begin with numbers
            if (!$.fn.media[fn]) 
                continue;  // unrecognized media type
            // normalize autoplay settings
            var player = $.fn.media[fn+'_player'];
            if (!o.params) o.params = {};
            if (player) {
                var num = player.autoplayAttr == 'autostart';
                o.params[player.autoplayAttr || 'autoplay'] = num ? (o.autoplay ? 1 : 0) : o.autoplay ? true : false;
            }
            var $div = $.fn.media[fn](this, o);

            $div.css('backgroundColor', o.bgColor).width(o.width);
            
            // post-conversion callback, passes original element, new div element and fully populated options
            if (typeof f2 == 'function') f2(this, $div[0], o, player.name);
            break;
        }
    });
};

/**
 * Chainable method for preparing elements to display rich media with
 * a page overlay.
 *
 * @name mediabox
 * @param Object options Options object
 * @param Object css values for the media div
 * @cat Plugins/media
 */
$.fn.mediabox = function(options, css) {
    return this.click(function() {
        if (typeof $.blockUI == 'undefined' || typeof $.blockUI.version == 'undefined' || $.blockUI.version < 1.26) {
            if (typeof $.fn.mediabox.warning != 'undefined') return this; // one warning is enough
            $.fn.mediabox.warning = 1;
            alert('The mediabox method requires blockUI v1.26 or later.');
            return false;
        }
        var o, p, div=0, $e = $(this).clone();
        $e.appendTo('body').hide().css({margin: 0});
        options = $.extend({}, options, { autoplay: 1 }); // force autoplay in box mode
        $e.media(options, function(){}, function(origEl, newEl, opts, player) {
            div = newEl;
            o = opts;
            p = player;
        });
        if (!div) return false;
        // don't pull element from the dom on Safari
        var $div = $.browser.safari ? $(div).hide() : $(div).remove();

        if (o.loadingImage)
            $div.css({
                backgroundImage:    'url('+o.loadingImage+')',
                backgroundPosition: 'center center',
                backgroundRepeat:   'no-repeat'
            });
        if (o.boxTitle)
            $div.prepend('<div style="margin:0;padding:0">' + o.boxTitle + '</div>');
        
        if (css) $div.css(css);

        $div.displayBox( { width: o.width, height: o.height }, function(el) {
            // quirkiness; sometimes media doesn't stop when removed from the DOM (especially in IE)
            $('object,embed', el).each(function() {
                try { this.Stop();   } catch(e) {}  // quicktime
                try { this.DoStop(); } catch(e) {}  // real
                try { this.controls.stop(); } catch(e) {} // windows media player
                $(this).remove();
            });
        }, p == 'flash'); // <-- mac/ff workaround
        return false;
    });
};

  
/**
 * Non-chainable method for adding or changing file format / player mapping
 * @name mapFormat
 * @param String format File format extension (ie: mov, wav, mp3)
 * @param String player Player name to use for the format (one of: flash, quicktime, realplayer, winmedia, silverlight or iframe
 */
$.fn.media.mapFormat = function(format, player) {
    if (!format || !player || !$.fn.media.defaults.players[player]) return; // invalid
    format = format.toLowerCase();
    if (isDigit(format[0])) format = 'fn' + format;
    $.fn.media[format] = $.fn.media[player];
    $.fn.media[format+'_player'] = $.fn.media.defaults.players[player];
};

// global defautls; override as needed
$.fn.media.defaults = {
    width:         400,
    height:        400,
    preferMeta:    1,         // true if markup metadata takes precedence over options object
    autoplay:      0,         // normalized cross-player setting
    bgColor:       '#ffffff', // background color
    params:        {},        // added to object element as param elements; added to embed element as attrs
    attrs:         {},        // added to object and embed elements as attrs
    flashvars:     {},        // added to flash content as flashvars param/attr
    flashVersion:  '7',       // required flash version
    
    // MediaBox options
    boxTitle:      null,      // MediaBox titlebar
    loadingImage:  null,      // MediaBox loading indicator
    
    // default flash video and mp3 player (@see: http://jeroenwijering.com/?item=Flash_Media_Player)
    flvPlayer:     'mediaplayer.swf',
    mp3Player:     'mediaplayer.swf',
    
    // @see http://msdn2.microsoft.com/en-us/library/bb412401.aspx
    silverlight: {
        inplaceInstallPrompt: 'true', // display in-place install prompt?
        isWindowless:         'true', // windowless mode (false for wrapping markup)
        framerate:            '24',   // maximum framerate
        version:              '0.9',  // Silverlight version
        onError:              null,   // onError callback
        onLoad:               null,   // onLoad callback
        initParams:           null,   // object init params
        userContext:          null    // callback arg passed to the load callback
    }
};

// Media Players; think twice before overriding
$.fn.media.defaults.players = {
    flash: {
        name:         'flash',
        types:        'flv,mp3,swf',
        oAttrs:   {
            classid:  'clsid:d27cdb6e-ae6d-11cf-96b8-444553540000',
            type:     'application/x-oleobject',
            codebase: 'http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=' + $.fn.media.defaults.flashVersion
        },
        eAttrs: {
            type:         'application/x-shockwave-flash',
            pluginspage:  'http://www.adobe.com/go/getflashplayer'
        }        
    },
    quicktime: {
        name:         'quicktime',
        types:        'aif,aiff,aac,au,bmp,gsm,mov,mid,midi,mpg,mpeg,mp4,m4a,psd,qt,qtif,qif,qti,snd,tif,tiff,wav,3g2,3gp',
        oAttrs:   {
            classid:  'clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B',
            codebase: 'http://www.apple.com/qtactivex/qtplugin.cab'
        },
        eAttrs: {
            pluginspage:  'http://www.apple.com/quicktime/download/'
        }
    },
    realplayer: {
        name:         'real',
        types:        'ra,ram,rm,rpm,rv,smi,smil',
        autoplayAttr: 'autostart',
        oAttrs:   {
            classid:  'clsid:CFCDAA03-8BE4-11cf-B84B-0020AFBBCCFA'
        },
        eAttrs: {
            type:         'audio/x-pn-realaudio-plugin',
            pluginspage:  'http://www.real.com/player/'
        }
    },
    winmedia: {
        name:         'winmedia',
        types:        'asf,avi,wma,wmv',
        autoplayAttr: 'autostart',
        oUrl:         'url',
        oAttrs:   {
            classid:  'clsid:6BF52A52-394A-11d3-B153-00C04F79FAA6',
            type:     'application/x-oleobject'
        },
        eAttrs: {
            type:         $.browser.mozilla && isFirefoxWMPPluginInstalled() ? 'application/x-ms-wmp' : 'application/x-mplayer2',
            pluginspage:  'http://www.microsoft.com/Windows/MediaPlayer/'
        }        
    },
    // special cases
    iframe: {
        name:  'iframe',
        types: 'html,pdf'
    },
    silverlight: {
        name:  'silverlight',
        types: 'xaml'
    }
};

//
//  everything below here is private
//


// detection script for FF WMP plugin (http://www.therossman.org/experiments/wmp_play.html)
// (hat tip to Mark Ross for this script)
function isFirefoxWMPPluginInstalled() {
    var plugs = navigator.plugins;
    for (i = 0; i < plugs.length; i++) {
        var plugin = plugs[i];
        if (plugin['filename'] == 'np-mswmp.dll')
            return true;
    }
    return false;
}

var counter = 1;

for (var player in $.fn.media.defaults.players) {
    var types = $.fn.media.defaults.players[player].types;
    $.each(types.split(','), function(i,o) {
        if (isDigit(o[0])) o = 'fn' + o;
        $.fn.media[o] = $.fn.media[player] = getGenerator(player);
        $.fn.media[o+'_player'] = $.fn.media.defaults.players[player];
    });
};

function getTypesRegExp() {
    var types = '';
    for (var player in $.fn.media.defaults.players) {
        if (types.length) types += ',';
        types += $.fn.media.defaults.players[player].types;
    };    
    return new RegExp('\\.(' + types.replace(/,/ig,'|') + ')\\b');
};

function getGenerator(player) {
    return function(el, options) {
        return generate(el, options, player);
    };
};

function isDigit(c) {
    return '0123456789'.indexOf(c) > -1;
};

// flatten all possible options: global defaults, meta, option obj
function getSettings(el, options) {
    options = options || {};
    var $el = $(el);
    var cls = el.className || '';
    // support metadata plugin (v1.0 and v2.0)
    var meta = $.metadata ? $el.metadata() : $.meta ? $el.data() : {};
    var w = meta.width  || parseInt(((cls.match(/w:(\d+)/)||[])[1]||0));
    var h = meta.height || parseInt(((cls.match(/h:(\d+)/)||[])[1]||0));
    if (w) meta.width  = w;
    if (h) meta.height = h;
    if (cls) meta.cls = cls;

    var a = $.fn.media.defaults;
    var b = $.meta && $.fn.media.defaults.preferMeta ? options : meta;
    var c = b == options ? meta : options;

    var p = { params: { bgColor: options.bgColor || $.fn.media.defaults.bgColor } };
    var opts = $.extend({}, a, b, c);
    $.each(['attrs','params','flashvars','silverlight'], function(i,o) {
        opts[o] = $.extend({}, p[o] || {}, a[o] || {}, b[o] || {}, c[o] || {});
    });

    if (typeof opts.caption == 'undefined') opts.caption = $el.text();

    // make sure we have a source!
    opts.src = opts.src || $el.attr('href') || $el.attr('src') || 'unknown';    
    return opts;
};

//
//  Flash Player
//

// generate flash using SWFObject if possible
$.fn.media.swf = function(el, opts) {
    if (typeof SWFObject == 'undefined') {
        // roll our own
        if (opts.flashvars) {
            var a = [];
            for (var f in opts.flashvars)
                a.push(f + '=' + opts.flashvars[f]);
            if (!opts.params) opts.params = {};
            opts.params.flashvars = a.join('&');
        }
        return generate(el, opts, 'flash');
    }

    var id = el.id ? (' id="'+el.id+'"') : '';
    var cls = opts.cls ? (' class="' + opts.cls + '"') : '';
    var $div = $('<div' + id + cls + '>');
    $(el).after($div).remove();

    var so = new SWFObject(opts.src, 'movie_player_' + counter++, opts.width, opts.height, opts.flashVersion, opts.bgColor);
    for (var p in opts.params)
        if (p != 'bgColor') so.addParam(p, opts.params[p]);
    for (var f in opts.flashvars)
        so.addVariable(f, opts.flashvars[f]);
    so.write($div[0]);

    if (opts.caption) $('<div>').appendTo($div).html(opts.caption);
    return $div;
};

// map flv and mp3 files to the swf player by default
$.fn.media.flv = $.fn.media.mp3 = function(el, opts) {
    var src = opts.src;
    var player = /\.mp3\b/i.test(src) ? $.fn.media.defaults.mp3Player : $.fn.media.defaults.flvPlayer;    
    
    player = liveurl+'components/com_jshopping/js/jquery/'+player; //change path player
    
    opts.src = player;
    opts.src = opts.src + '?file=' + src;
    opts.flashvars = $.extend({}, { file: src }, opts.flashvars );
    return $.fn.media.swf(el, opts);
};

//
//  Silverlight
//
$.fn.media.xaml = function(el, opts) {
    if (!window.Sys || !window.Sys.Silverlight) {
        if ($.fn.media.xaml.warning) return;
        $.fn.media.xaml.warning = 1;
        alert('You must include the Silverlight.js script.');
        return;
    }

    var props = {
        width: opts.width,
        height: opts.height,
        background: opts.bgColor,
        inplaceInstallPrompt: opts.silverlight.inplaceInstallPrompt,
        isWindowless: opts.silverlight.isWindowless,
        framerate: opts.silverlight.framerate,
        version: opts.silverlight.version
    };
    var events = {
        onError: opts.silverlight.onError,
        onLoad: opts.silverlight.onLoad
    };

    var id1 = el.id ? (' id="'+el.id+'"') : '';
    var id2 = opts.id || 'AG' + counter++;
    // convert element to div
    var cls = opts.cls ? (' class="' + opts.cls + '"') : '';
    var $div = $('<div' + id1 + cls + '>');
    $(el).after($div).remove();
    
    Sys.Silverlight.createObjectEx({
        source: opts.src,
        initParams: opts.silverlight.initParams,
        userContext: opts.silverlight.userContext,
        id: id2,
        parentElement: $div[0],
        properties: props,
        events: events
    });

    if (opts.caption) $('<div>').appendTo($div).html(opts.caption);
    return $div;
};

//
// generate object/embed markup
//
function generate(el, opts, player) {
    var $el = $(el);
    var o = $.fn.media.defaults.players[player];
    
    if (player == 'iframe') {
        var o = $('<iframe' + ' width="' + opts.width + '" height="' + opts.height + '" >');
        o.attr('src', opts.src);
        o.css('backgroundColor', o.bgColor);
    }
    else if ($.browser.msie) {
        var a = ['<object width="' + opts.width + '" height="' + opts.height + '" '];
        for (var key in opts.attrs)
            a.push(key + '="'+opts.attrs[key]+'" ');
        for (var key in o.oAttrs || {})
            a.push(key + '="'+o.oAttrs[key]+'" ');
        a.push('></ob'+'ject'+'>');
        var p = ['<param name="' + (o.oUrl || 'src') +'" value="' + opts.src + '">'];
        for (var key in opts.params)
            p.push('<param name="'+ key +'" value="' + opts.params[key] + '">');
        var o = document.createElement(a.join(''));
        for (var i=0; i < p.length; i++)
            o.appendChild(document.createElement(p[i]));
    }
    else {
        var a = ['<embed width="' + opts.width + '" height="' + opts.height + '" style="display:block"'];
        if (opts.src) a.push(' src="' + opts.src + '" ');
        for (var key in opts.attrs)
            a.push(key + '="'+opts.attrs[key]+'" ');
        for (var key in o.eAttrs || {})
            a.push(key + '="'+o.eAttrs[key]+'" ');
        for (var key in opts.params)
            a.push(key + '="'+opts.params[key]+'" ');
        a.push('></em'+'bed'+'>');
    }
    // convert element to div
    var id = el.id ? (' id="'+el.id+'"') : '';
    var cls = opts.cls ? (' class="' + opts.cls + '"') : '';
    var $div = $('<div' + id + cls + '>');
    $el.after($div).remove();
    ($.browser.msie || player == 'iframe') ? $div.append(o) : $div.html(a.join(''));
    if (opts.caption) $('<div>').appendTo($div).html(opts.caption);
    return $div;
};


})(jQuery);
