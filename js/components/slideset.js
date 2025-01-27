!(function (t) {
  var i;
  window.UIkit && (i = t(UIkit)),
    "function" == typeof define &&
      define.amd &&
      define("uikit-slideset", ["uikit"], function () {
        return i || t(UIkit);
      });
})(function (t) {
  "use strict";
  function i(i, e, s, n) {
    var a,
      o,
      r,
      l,
      h = t.$.Deferred(),
      u =
        this.options.delay === !1
          ? Math.floor(this.options.duration / 2)
          : this.options.delay,
      d = this;
    if (
      ((n = n || 1),
      this.element.css("min-height", this.element.height()),
      s[0] === e[0])
    )
      return h.resolve(), h.promise();
    if (
      ("object" == typeof i
        ? ((a = i[0]), (o = i[1] || i[0]))
        : ((a = i), (o = a)),
      (r = function () {
        if (
          (e &&
            e.length &&
            e
              .hide()
              .removeClass(o + " uk-animation-reverse")
              .css({ opacity: "", "animation-delay": "", animation: "" }),
          !s.length)
        )
          return void h.resolve();
        for (l = 0; l < s.length; l++)
          s.eq(1 == n ? l : s.length - l - 1).css(
            "animation-delay",
            l * u + "ms"
          );
        var i = function () {
          s
            .removeClass("" + a)
            .css({
              opacity: "",
              display: "",
              "animation-delay": "",
              animation: "",
            }),
            h.resolve(),
            d.element.css("min-height", ""),
            (i = !1);
        };
        s
          .addClass(a)
          [1 == n ? "last" : "first"]()
          .one(t.support.animation.end, function () {
            i && i();
          })
          .end()
          .css("display", ""),
          setTimeout(function () {
            i && i();
          }, s.length * u * 2);
      }),
      s.length && s.css("animation-duration", this.options.duration + "ms"),
      e && e.length)
    )
      for (
        e
          .css("animation-duration", this.options.duration + "ms")
          [1 == n ? "last" : "first"]()
          .one(t.support.animation.end, function () {
            r();
          }),
          l = 0;
        l < e.length;
        l++
      )
        !(function (i, e) {
          setTimeout(
            function () {
              e.css("display", "none")
                .css("display", "")
                .css("opacity", 0)
                .on(t.support.animation.end, function () {
                  e.removeClass(o);
                })
                .addClass(o + " uk-animation-reverse");
            }.bind(this),
            l * u
          );
        })(l, e.eq(1 == n ? l : e.length - l - 1));
    else r();
    return h.promise();
  }
  function e(t, i) {
    var e,
      s = 0,
      n = -1,
      a = t.length || 0,
      o = [];
    if (1 > i) return null;
    for (; a > s; ) (e = s % i), e ? (o[n][e] = t[s]) : (o[++n] = [t[s]]), s++;
    for (s = 0, a = o.length; a > s; ) (o[s] = jQuery(o[s])), s++;
    return o;
  }
  var s;
  t.component("slideset", {
    defaults: {
      default: 1,
      animation: "fade",
      duration: 200,
      filter: "",
      delay: !1,
      controls: !1,
      autoplay: !1,
      autoplayInterval: 7e3,
      pauseOnHover: !0,
    },
    sets: [],
    boot: function () {
      t.ready(function (i) {
        t.$("[data-uk-slideset]", i).each(function () {
          var i = t.$(this);
          i.data("slideset") ||
            t.slideset(i, t.Utils.options(i.attr("data-uk-slideset")));
        });
      });
    },
    init: function () {
      var i = this;
      (this.activeSet = !1),
        (this.list = this.element.find(".uk-slideset")),
        (this.nav = this.element.find(".uk-slideset-nav")),
        (this.controls = this.options.controls
          ? t.$(this.options.controls)
          : this.element),
        t.$win.on(
          "resize load",
          t.Utils.debounce(function () {
            i.updateSets();
          }, 100)
        ),
        i.list.addClass("uk-grid-width-1-" + i.options["default"]),
        ["xlarge", "large", "medium", "small"].forEach(function (t) {
          i.options[t] &&
            i.list.addClass("uk-grid-width-" + t + "-1-" + i.options[t]);
        }),
        this.on("click.uk.slideset", "[data-uk-slideset-item]", function (e) {
          if ((e.preventDefault(), !i.animating)) {
            var s = t.$(this).attr("data-uk-slideset-item");
            if (i.activeSet !== s)
              switch (s) {
                case "next":
                case "previous":
                  i["next" == s ? "next" : "previous"]();
                  break;
                default:
                  i.show(parseInt(s, 10));
              }
          }
        }),
        this.controls.on("click.uk.slideset", "[data-uk-filter]", function (e) {
          var s = t.$(this);
          s.parent().hasClass("uk-slideset") ||
            (e.preventDefault(),
            i.animating ||
              i.currentFilter == s.attr("data-uk-filter") ||
              (i.updateFilter(s.attr("data-uk-filter")),
              i._hide().then(function () {
                i.updateSets(!0, !0);
              })));
        }),
        this.on("swipeRight swipeLeft", function (t) {
          i["swipeLeft" == t.type ? "next" : "previous"]();
        }),
        this.updateFilter(this.options.filter),
        this.updateSets(),
        this.element.on({
          mouseenter: function () {
            i.options.pauseOnHover && (i.hovering = !0);
          },
          mouseleave: function () {
            i.hovering = !1;
          },
        }),
        this.options.autoplay && this.start();
    },
    updateSets: function (t, i) {
      var s,
        n = this.visible;
      if (
        ((this.visible = this.getVisibleOnCurrenBreakpoint()),
        n != this.visible || i)
      ) {
        for (
          this.children = this.list.children().hide(),
            this.items = this.getItems(),
            this.sets = e(this.items, this.visible),
            s = 0;
          s < this.sets.length;
          s++
        )
          this.sets[s].css({ display: "none" });
        if (this.nav.length && this.nav.empty()) {
          for (s = 0; s < this.sets.length; s++)
            this.nav.append(
              '<li data-uk-slideset-item="' + s + '"><a></a></li>'
            );
          this.nav[
            1 == this.nav.children().length ? "addClass" : "removeClass"
          ]("uk-invisible");
        }
        (this.activeSet = !1), this.show(0, !t);
      }
    },
    updateFilter: function (i) {
      var e,
        s = this;
      (this.currentFilter = i),
        this.controls.find("[data-uk-filter]").each(function () {
          (e = t.$(this)),
            e.parent().hasClass("uk-slideset") ||
              (e.attr("data-uk-filter") == s.currentFilter
                ? e.addClass("uk-active")
                : e.removeClass("uk-active"));
        });
    },
    getVisibleOnCurrenBreakpoint: function () {
      var i = null,
        e = t
          .$(
            '<div style="position:absolute;height:1px;top:-1000px;width:100px"><div></div></div>'
          )
          .appendTo("body"),
        s = e.children().eq(0),
        n = this.options;
      return (
        ["xlarge", "large", "medium", "small"].forEach(function (t) {
          n[t] &&
            !i &&
            (e.attr("class", "uk-grid-width-" + t + "-1-2").width(),
            50 == s.width() && (i = t));
        }),
        e.remove(),
        this.options[i] || this.options["default"]
      );
    },
    getItems: function () {
      var i,
        e = [];
      return (
        this.currentFilter
          ? ((i = this.currentFilter || []),
            "string" == typeof i &&
              (i = i.split(/,/).map(function (t) {
                return t.trim();
              })),
            this.children.each(function (s) {
              var n = t.$(this),
                a = n.attr("data-uk-filter"),
                o = i.length ? !1 : !0;
              a &&
                ((a = a.split(/,/).map(function (t) {
                  return t.trim();
                })),
                i.forEach(function (t) {
                  a.indexOf(t) > -1 && (o = !0);
                })),
                o && e.push(n[0]);
            }),
            (e = t.$(e)))
          : (e = this.list.children()),
        e
      );
    },
    show: function (i, e, n) {
      var a = this;
      if (this.activeSet !== i && !this.animating) {
        n = n || (i < this.activeSet ? -1 : 1);
        var o = this.sets[this.activeSet] || [],
          r = this.sets[i],
          l = this._getAnimation();
        (e || !t.support.animation) && (l = s.none),
          (this.animating = !0),
          this.nav.length &&
            this.nav
              .children()
              .removeClass("uk-active")
              .eq(i)
              .addClass("uk-active"),
          l.apply(a, [o, r, n]).then(function () {
            t.Utils.checkDisplay(r, !0),
              a.children.hide().removeClass("uk-active"),
              r.addClass("uk-active").css({ display: "", opacity: "" }),
              (a.animating = !1),
              (a.activeSet = i),
              t.Utils.checkDisplay(r, !0),
              a.trigger("show.uk.slideset", [r]);
          });
      }
    },
    _getAnimation: function () {
      var i = s[this.options.animation] || s.none;
      return t.support.animation || (i = s.none), i;
    },
    _hide: function () {
      var t = this,
        i = this.sets[this.activeSet] || [],
        e = this._getAnimation();
      return (
        (this.animating = !0),
        e.apply(t, [i, [], 1]).then(function () {
          t.animating = !1;
        })
      );
    },
    next: function () {
      this.show(this.sets[this.activeSet + 1] ? this.activeSet + 1 : 0, !1, 1);
    },
    previous: function () {
      this.show(
        this.sets[this.activeSet - 1]
          ? this.activeSet - 1
          : this.sets.length - 1,
        !1,
        -1
      );
    },
    start: function () {
      this.stop();
      var t = this;
      this.interval = setInterval(function () {
        t.hovering || t.animating || t.next();
      }, this.options.autoplayInterval);
    },
    stop: function () {
      this.interval && clearInterval(this.interval);
    },
  }),
    (s = {
      none: function () {
        var i = t.$.Deferred();
        return i.resolve(), i.promise();
      },
      fade: function (t, e) {
        return i.apply(this, ["uk-animation-fade", t, e]);
      },
      "slide-bottom": function (t, e) {
        return i.apply(this, ["uk-animation-slide-bottom", t, e]);
      },
      "slide-top": function (t, e) {
        return i.apply(this, ["uk-animation-slide-top", t, e]);
      },
      "slide-vertical": function (t, e, s) {
        var n = ["uk-animation-slide-top", "uk-animation-slide-bottom"];
        return -1 == s && n.reverse(), i.apply(this, [n, t, e]);
      },
      "slide-horizontal": function (t, e, s) {
        var n = ["uk-animation-slide-right", "uk-animation-slide-left"];
        return -1 == s && n.reverse(), i.apply(this, [n, t, e, s]);
      },
      scale: function (t, e) {
        return i.apply(this, ["uk-animation-scale-up", t, e]);
      },
    }),
    (t.slideset.animations = s);
});
