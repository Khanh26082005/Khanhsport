!(function (e) {
  var t;
  window.UIkit && (t = e(UIkit)),
    "function" == typeof define &&
      define.amd &&
      define("uikit-parallax", ["uikit"], function () {
        return t || e(UIkit);
      });
})(function (e) {
  "use strict";
  function t(t, a, r) {
    var i,
      n,
      s,
      o,
      c,
      l,
      p,
      f = new Image();
    return (
      (n = t.element.css({
        "background-size": "cover",
        "background-repeat": "no-repeat",
      })),
      (i = n
        .css("background-image")
        .replace(/^url\(/g, "")
        .replace(/\)$/g, "")
        .replace(/("|')/g, "")),
      (o = function () {
        var e = n.innerWidth(),
          i = n.innerHeight(),
          o = "bg" == a ? r.diff : (r.diff / 100) * i;
        return (
          (i += o),
          (e += Math.ceil(o * c)),
          e - o < s.w && i < s.h
            ? t.element.css({ "background-size": "auto" })
            : (i > e / c
                ? ((l = Math.ceil(i * c)),
                  (p = i),
                  i > window.innerHeight && ((l = 1.2 * l), (p = 1.2 * p)))
                : ((l = e), (p = Math.ceil(e / c))),
              void n
                .css({ "background-size": l + "px " + p + "px" })
                .data("bgsize", { w: l, h: p }))
        );
      }),
      (f.onerror = function () {}),
      (f.onload = function () {
        (s = { w: f.width, h: f.height }),
          (c = f.width / f.height),
          e.$win.on(
            "load resize orientationchange",
            e.Utils.debounce(function () {
              o();
            }, 50)
          ),
          o();
      }),
      (f.src = i),
      !0
    );
  }
  function a(e, t, a) {
    return (e = i(e)), (t = i(t)), (a = a || 0), r(e, t, a);
  }
  function r(e, t, a) {
    var r =
      "rgba(" +
      parseInt(e[0] + a * (t[0] - e[0]), 10) +
      "," +
      parseInt(e[1] + a * (t[1] - e[1]), 10) +
      "," +
      parseInt(e[2] + a * (t[2] - e[2]), 10) +
      "," +
      (e && t ? parseFloat(e[3] + a * (t[3] - e[3])) : 1);
    return (r += ")");
  }
  function i(e) {
    var t, a;
    return (a = (t = /#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/.exec(
      e
    ))
      ? [parseInt(t[1], 16), parseInt(t[2], 16), parseInt(t[3], 16), 1]
      : (t = /#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])/.exec(e))
      ? [
          17 * parseInt(t[1], 16),
          17 * parseInt(t[2], 16),
          17 * parseInt(t[3], 16),
          1,
        ]
      : (t =
          /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(
            e
          ))
      ? [parseInt(t[1]), parseInt(t[2]), parseInt(t[3]), 1]
      : (t =
          /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9\.]*)\s*\)/.exec(
            e
          ))
      ? [
          parseInt(t[1], 10),
          parseInt(t[2], 10),
          parseInt(t[3], 10),
          parseFloat(t[4]),
        ]
      : p[e] || [255, 255, 255, 0]);
  }
  var n = [],
    s = !1,
    o = 0,
    c = window.innerHeight,
    l = function () {
      (o = e.$win.scrollTop()),
        window.requestAnimationFrame(function () {
          for (var e = 0; e < n.length; e++) n[e].process();
        });
    };
  e.component("parallax", {
    defaults: { velocity: 0.5, target: !1, viewport: !1, media: !1 },
    boot: function () {
      (s = (function () {
        var e,
          t = document.createElement("div"),
          a = {
            WebkitTransform: "-webkit-transform",
            MSTransform: "-ms-transform",
            MozTransform: "-moz-transform",
            Transform: "transform",
          };
        document.body.insertBefore(t, null);
        for (var r in a)
          void 0 !== t.style[r] &&
            ((t.style[r] = "translate3d(1px,1px,1px)"),
            (e = window.getComputedStyle(t).getPropertyValue(a[r])));
        return (
          document.body.removeChild(t),
          void 0 !== e && e.length > 0 && "none" !== e
        );
      })()),
        e.$doc.on("scrolling.uk.document", l),
        e.$win.on(
          "load resize orientationchange",
          e.Utils.debounce(function () {
            (c = window.innerHeight), l();
          }, 50)
        ),
        e.ready(function (t) {
          e.$("[data-uk-parallax]", t).each(function () {
            var t = e.$(this);
            t.data("parallax") ||
              e.parallax(t, e.Utils.options(t.attr("data-uk-parallax")));
          });
        });
    },
    init: function () {
      (this.base = this.options.target
        ? e.$(this.options.target)
        : this.element),
        (this.props = {}),
        (this.velocity = this.options.velocity || 1);
      var t = ["target", "velocity", "viewport", "plugins", "media"];
      Object.keys(this.options).forEach(
        function (e) {
          if (-1 === t.indexOf(e)) {
            var a,
              r,
              i,
              n,
              s = String(this.options[e]).split(",");
            e.match(/color/i)
              ? ((a = s[1] ? s[0] : this._getStartValue(e)),
                (r = s[1] ? s[1] : s[0]),
                a || (a = "rgba(255,255,255,0)"))
              : ((a = parseFloat(s[1] ? s[0] : this._getStartValue(e))),
                (r = parseFloat(s[1] ? s[1] : s[0])),
                (n = r > a ? r - a : a - r),
                (i = r > a ? 1 : -1)),
              (this.props[e] = { start: a, end: r, dir: i, diff: n });
          }
        }.bind(this)
      ),
        n.push(this);
    },
    process: function () {
      if (this.options.media)
        switch (typeof this.options.media) {
          case "number":
            if (window.innerWidth < this.options.media) return !1;
            break;
          case "string":
            if (
              window.matchMedia &&
              !window.matchMedia(this.options.media).matches
            )
              return !1;
        }
      var e = this.percentageInViewport();
      this.options.viewport !== !1 &&
        (e = 0 === this.options.viewport ? 1 : e / this.options.viewport),
        this.update(e);
    },
    percentageInViewport: function () {
      var e,
        t,
        a,
        r = this.base.offset().top,
        i = this.base.outerHeight();
      return (
        r > o + c
          ? (a = 0)
          : o > r + i
          ? (a = 1)
          : c > r + i
          ? (a = (c > o ? o : o - c) / (r + i))
          : ((e = o + c - r),
            (t = Math.round(e / ((c + i) / 100))),
            (a = t / 100)),
        a
      );
    },
    update: function (e) {
      var r,
        i,
        n = { transform: "", filter: "" },
        o = e * (1 - (this.velocity - this.velocity * e));
      0 > o && (o = 0),
        o > 1 && (o = 1),
        (void 0 === this._percent || this._percent != o) &&
          (Object.keys(this.props).forEach(
            function (c) {
              switch (
                ((r = this.props[c]),
                0 === e
                  ? (i = r.start)
                  : 1 === e
                  ? (i = r.end)
                  : void 0 !== r.diff && (i = r.start + r.diff * o * r.dir),
                ("bg" != c && "bgp" != c) ||
                  this._bgcover ||
                  (this._bgcover = t(this, c, r)),
                c)
              ) {
                case "x":
                  n.transform += s
                    ? " translate3d(" + i + "px, 0, 0)"
                    : " translateX(" + i + "px)";
                  break;
                case "xp":
                  n.transform += s
                    ? " translate3d(" + i + "%, 0, 0)"
                    : " translateX(" + i + "%)";
                  break;
                case "y":
                  n.transform += s
                    ? " translate3d(0, " + i + "px, 0)"
                    : " translateY(" + i + "px)";
                  break;
                case "yp":
                  n.transform += s
                    ? " translate3d(0, " + i + "%, 0)"
                    : " translateY(" + i + "%)";
                  break;
                case "rotate":
                  n.transform += " rotate(" + i + "deg)";
                  break;
                case "scale":
                  n.transform += " scale(" + i + ")";
                  break;
                case "bg":
                  n["background-position"] = "50% " + i + "px";
                  break;
                case "bgp":
                  n["background-position"] = "50% " + i + "%";
                  break;
                case "color":
                case "background-color":
                case "border-color":
                  n[c] = a(r.start, r.end, o);
                  break;
                case "blur":
                  n.filter += " blur(" + i + "px)";
                  break;
                case "hue":
                  n.filter += " hue-rotate(" + i + "deg)";
                  break;
                case "grayscale":
                  n.filter += " grayscale(" + i + "%)";
                  break;
                case "invert":
                  n.filter += " invert(" + i + "%)";
                  break;
                case "fopacity":
                  n.filter += " opacity(" + i + "%)";
                  break;
                case "saturate":
                  n.filter += " saturate(" + i + "%)";
                  break;
                case "sepia":
                  n.filter += " sepia(" + i + "%)";
                  break;
                default:
                  n[c] = i;
              }
            }.bind(this)
          ),
          n.filter && (n["-webkit-filter"] = n.filter),
          this.element.css(n),
          (this._percent = o));
    },
    _getStartValue: function (e) {
      var t = 0;
      switch (e) {
        case "scale":
          t = 1;
          break;
        default:
          t = this.element.css(e);
      }
      return t || 0;
    },
  });
  var p = {
    black: [0, 0, 0, 1],
    blue: [0, 0, 255, 1],
    brown: [165, 42, 42, 1],
    cyan: [0, 255, 255, 1],
    fuchsia: [255, 0, 255, 1],
    gold: [255, 215, 0, 1],
    green: [0, 128, 0, 1],
    indigo: [75, 0, 130, 1],
    khaki: [240, 230, 140, 1],
    lime: [0, 255, 0, 1],
    magenta: [255, 0, 255, 1],
    maroon: [128, 0, 0, 1],
    navy: [0, 0, 128, 1],
    olive: [128, 128, 0, 1],
    orange: [255, 165, 0, 1],
    pink: [255, 192, 203, 1],
    purple: [128, 0, 128, 1],
    violet: [128, 0, 128, 1],
    red: [255, 0, 0, 1],
    silver: [192, 192, 192, 1],
    white: [255, 255, 255, 1],
    yellow: [255, 255, 0, 1],
    transparent: [255, 255, 255, 0],
  };
  return e.parallax;
});
