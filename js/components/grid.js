!(function (t) {
  var i;
  window.UIkit && (i = t(UIkit)),
    "function" == typeof define &&
      define.amd &&
      define("uikit-grid", ["uikit"], function () {
        return i || t(UIkit);
      });
})(function (t) {
  "use strict";
  function i(t) {
    return e(t);
  }
  t.component("grid", {
    defaults: {
      colwidth: "auto",
      animation: !0,
      duration: 300,
      gutter: 0,
      controls: !1,
      filter: !1,
    },
    boot: function () {
      t.ready(function (i) {
        t.$("[data-uk-grid]", i).each(function () {
          var i = t.$(this);
          i.data("grid") || t.grid(i, t.Utils.options(i.attr("data-uk-grid")));
        });
      });
    },
    init: function () {
      var i = this,
        e = String(this.options.gutter).trim().split(" ");
      (this.gutterv = parseInt(e[0], 10)),
        (this.gutterh = parseInt(e[1] || e[0], 10)),
        this.element.css({ position: "relative" }),
        (this.controls = null),
        this.options.controls &&
          ((this.controls = t.$(this.options.controls)),
          this.controls.on("click", "[data-uk-filter]", function (e) {
            e.preventDefault(), i.filter(t.$(this).attr("data-uk-filter"));
          }),
          this.controls.on("click", "[data-uk-sort]", function (e) {
            e.preventDefault();
            var n = t.$(this).attr("data-uk-sort").split(":");
            i.sort(n[0], n[1]);
          })),
        t.$win.on(
          "load resize orientationchange",
          t.Utils.debounce(
            function () {
              i.currentfilter ? i.filter(i.currentfilter) : this.updateLayout();
            }.bind(this),
            100
          )
        ),
        this.on("display.uk.check", function () {
          i.element.is(":visible") && i.updateLayout();
        }),
        t.domObserve(this.element, function (t) {
          i.updateLayout();
        }),
        this.options.filter !== !1
          ? this.filter(this.options.filter)
          : this.updateLayout();
    },
    _prepareElements: function () {
      var t,
        i = this.element.children(":not([data-grid-prepared])");
      i.length &&
        ((t = {
          position: "absolute",
          "box-sizing": "border-box",
          width: "auto" == this.options.colwidth ? "" : this.options.colwidth,
        }),
        this.options.gutter &&
          ((t["padding-left"] = this.gutterh),
          (t["padding-bottom"] = this.gutterv),
          this.element.css("margin-left", -1 * this.gutterh)),
        i.attr("data-grid-prepared", "true").css(t));
    },
    updateLayout: function (e) {
      this._prepareElements(), (e = e || this.element.children(":visible"));
      var n,
        r,
        o,
        a,
        s,
        d,
        h,
        u,
        l = e,
        f = this.element.width() + 2 * this.gutterh + 2,
        c = 0,
        p = 0,
        g = [];
      this.trigger("beforeupdate.uk.grid", [l]),
        l.each(function (e) {
          for (
            u = i(this),
              n = t.$(this),
              r = u.outerWidth,
              o = u.outerHeight,
              c = 0,
              p = 0,
              s = 0,
              h = g.length;
            h > s;
            s++
          )
            (a = g[s]),
              c <= a.aX && (c = a.aX),
              c + r > f && (c = 0),
              p <= a.aY && (p = a.aY);
          g.push({
            ele: n,
            top: p,
            left: c,
            width: r,
            height: o,
            aY: p + o,
            aX: c + r,
          });
        });
      var m,
        v = 0;
      for (s = 0, h = g.length; h > s; s++) {
        for (a = g[s], p = 0, d = 0; s > d; d++)
          (m = g[d]), a.left < m.aX && m.left + 1 < a.aX && (p = m.aY);
        (a.top = p), (a.aY = p + a.height), (v = Math.max(v, a.aY));
      }
      (v -= this.gutterv),
        this.options.animation
          ? (this.element.stop().animate({ height: v }, 100),
            g.forEach(
              function (t) {
                t.ele
                  .stop()
                  .animate(
                    { top: t.top, left: t.left, opacity: 1 },
                    this.options.duration
                  );
              }.bind(this)
            ))
          : (this.element.css("height", v),
            g.forEach(
              function (t) {
                t.ele.css({ top: t.top, left: t.left, opacity: 1 });
              }.bind(this)
            )),
        setTimeout(function () {
          t.$doc.trigger("scrolling.uk.document");
        }, 2 * this.options.duration * (this.options.animation ? 1 : 0)),
        this.trigger("afterupdate.uk.grid", [l]);
    },
    filter: function (i) {
      (this.currentfilter = i),
        (i = i || []),
        "number" == typeof i && (i = i.toString()),
        "string" == typeof i &&
          (i = i.split(/,/).map(function (t) {
            return t.trim();
          }));
      var e = this,
        n = this.element.children(),
        r = { visible: [], hidden: [] };
      n.each(function (e) {
        var n = t.$(this),
          o = n.attr("data-uk-filter"),
          a = i.length ? !1 : !0;
        o &&
          ((o = o.split(/,/).map(function (t) {
            return t.trim();
          })),
          i.forEach(function (t) {
            o.indexOf(t) > -1 && (a = !0);
          })),
          r[a ? "visible" : "hidden"].push(n);
      }),
        (r.hidden = t.$(r.hidden).map(function () {
          return this[0];
        })),
        (r.visible = t.$(r.visible).map(function () {
          return this[0];
        })),
        r.hidden
          .attr("aria-hidden", "true")
          .filter(":visible")
          .fadeOut(this.options.duration),
        r.visible
          .attr("aria-hidden", "false")
          .filter(":hidden")
          .css("opacity", 0)
          .show(),
        e.updateLayout(r.visible),
        this.controls &&
          this.controls.length &&
          this.controls
            .find("[data-uk-filter]")
            .removeClass("uk-active")
            .filter('[data-uk-filter="' + i + '"]')
            .addClass("uk-active");
    },
    sort: function (i, e) {
      (e = e || 1),
        "string" == typeof e && (e = "desc" == e.toLowerCase() ? -1 : 1);
      var n = this.element.children();
      n
        .sort(function (n, r) {
          return (
            (n = t.$(n)),
            (r = t.$(r)),
            (r.data(i) || "") < (n.data(i) || "") ? e : -1 * e
          );
        })
        .appendTo(this.element),
        this.updateLayout(n.filter(":visible")),
        this.controls &&
          this.controls.length &&
          this.controls
            .find("[data-uk-sort]")
            .removeClass("uk-active")
            .filter(
              '[data-uk-sort="' + i + ":" + (-1 == e ? "desc" : "asc") + '"]'
            )
            .addClass("uk-active");
    },
  });
  var e = (function () {
    function t(t) {
      if (t) {
        if ("string" == typeof u[t]) return t;
        t = t.charAt(0).toUpperCase() + t.slice(1);
        for (var i, e = 0, n = h.length; n > e; e++)
          if (((i = h[e] + t), "string" == typeof u[i])) return i;
      }
    }
    function i(t) {
      var i = parseFloat(t),
        e = -1 === t.indexOf("%") && !isNaN(i);
      return e && i;
    }
    function e() {}
    function n() {
      for (
        var t = {
            width: 0,
            height: 0,
            innerWidth: 0,
            innerHeight: 0,
            outerWidth: 0,
            outerHeight: 0,
          },
          i = 0,
          e = f.length;
        e > i;
        i++
      ) {
        var n = f[i];
        t[n] = 0;
      }
      return t;
    }
    function r() {
      if (!c) {
        c = !0;
        var e = window.getComputedStyle;
        if (
          ((a = (function () {
            var t = e
              ? function (t) {
                  return e(t, null);
                }
              : function (t) {
                  return t.currentStyle;
                };
            return function (i) {
              var e = t(i);
              return (
                e ||
                  l(
                    "Style returned " +
                      e +
                      ". Are you running this code in a hidden iframe on Firefox? See http://bit.ly/getsizebug1"
                  ),
                e
              );
            };
          })()),
          (s = t("boxSizing")))
        ) {
          var n = document.createElement("div");
          (n.style.width = "200px"),
            (n.style.padding = "1px 2px 3px 4px"),
            (n.style.borderStyle = "solid"),
            (n.style.borderWidth = "1px 2px 3px 4px"),
            (n.style[s] = "border-box");
          var r = document.body || document.documentElement;
          r.appendChild(n);
          var o = a(n);
          (d = 200 === i(o.width)), r.removeChild(n);
        }
      }
    }
    function o(t) {
      if (
        (r(),
        "string" == typeof t && (t = document.querySelector(t)),
        t && "object" == typeof t && t.nodeType)
      ) {
        var e = a(t);
        if ("none" === e.display) return n();
        var o = {};
        (o.width = t.offsetWidth), (o.height = t.offsetHeight);
        for (
          var h = (o.isBorderBox = !(!s || !e[s] || "border-box" !== e[s])),
            u = 0,
            l = f.length;
          l > u;
          u++
        ) {
          var c = f[u],
            p = e[c],
            g = parseFloat(p);
          o[c] = isNaN(g) ? 0 : g;
        }
        var m = o.paddingLeft + o.paddingRight,
          v = o.paddingTop + o.paddingBottom,
          b = o.marginLeft + o.marginRight,
          y = o.marginTop + o.marginBottom,
          k = o.borderLeftWidth + o.borderRightWidth,
          w = o.borderTopWidth + o.borderBottomWidth,
          x = h && d,
          W = i(e.width);
        W !== !1 && (o.width = W + (x ? 0 : m + k));
        var L = i(e.height);
        return (
          L !== !1 && (o.height = L + (x ? 0 : v + w)),
          (o.innerWidth = o.width - (m + k)),
          (o.innerHeight = o.height - (v + w)),
          (o.outerWidth = o.width + b),
          (o.outerHeight = o.height + y),
          o
        );
      }
    }
    var a,
      s,
      d,
      h = "Webkit Moz ms Ms O".split(" "),
      u = document.documentElement.style,
      l =
        "undefined" == typeof console
          ? e
          : function (t) {
              console.error(t);
            },
      f = [
        "paddingLeft",
        "paddingRight",
        "paddingTop",
        "paddingBottom",
        "marginLeft",
        "marginRight",
        "marginTop",
        "marginBottom",
        "borderLeftWidth",
        "borderRightWidth",
        "borderTopWidth",
        "borderBottomWidth",
      ],
      c = !1;
    return o;
  })();
});
