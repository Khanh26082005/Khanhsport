!(function (t) {
  var n;
  window.UIkit && (n = t(UIkit)),
    "function" == typeof define &&
      define.amd &&
      define("uikit-grid-parallax", ["uikit"], function () {
        return n || t(UIkit);
      });
})(function (t) {
  function n(t) {
    for (
      var n = t.children(),
        i = n.filter(":visible:first"),
        e = i[0].offsetTop + i.outerHeight(),
        o = 0;
      o < n.length && !(n[o].offsetTop >= e);
      o++
    );
    return o || 1;
  }
  function i(t) {
    var n,
      i,
      e,
      o = t.offset().top,
      r = t.outerHeight(),
      s = UIkit.$win.scrollTop(),
      a = window.innerHeight;
    return (
      o > s + a
        ? (e = 0)
        : s > o + r
        ? (e = 1)
        : (a > o + r
            ? (e = (a > s ? s : s - a) / (o + r))
            : ((n = s + a - o),
              (i = Math.round(n / ((a + r) / 100))),
              (e = i / 100)),
          a > o && (e = (e * s) / (o + r - a))),
      e > 1 ? 1 : e
    );
  }
  var e = [],
    o = function () {
      requestAnimationFrame(function () {
        for (var t = 0; t < e.length; t++) e[t].process();
      });
    };
  t.component("gridparallax", {
    defaults: { target: !1, smooth: 150, translate: 150 },
    boot: function () {
      t.$doc.on("scrolling.uk.document", o),
        t.$win.on(
          "load resize orientationchange",
          t.Utils.debounce(function () {
            o();
          }, 50)
        ),
        t.ready(function (n) {
          t.$("[data-uk-grid-parallax]", n).each(function () {
            var n = t.$(this);
            n.data("gridparallax") ||
              t.gridparallax(
                n,
                t.Utils.options(n.attr("data-uk-grid-parallax"))
              );
          });
        });
    },
    init: function () {
      var i = this;
      this.initItems().process(),
        e.push(this),
        t.$win.on(
          "load resize orientationchange",
          (function () {
            var e = function () {
              var t = n(i.element);
              i.element.css("margin-bottom", ""),
                t > 1 &&
                  i.element.css(
                    "margin-bottom",
                    i.options.translate +
                      parseInt(i.element.css("margin-bottom"))
                  );
            };
            return (
              t.$(function () {
                e();
              }),
              t.Utils.debounce(e, 50)
            );
          })()
        );
    },
    initItems: function () {
      var n = this.options.smooth;
      return (
        (this.items = (
          this.options.target
            ? this.element.find(this.options.target)
            : this.element.children()
        ).each(function () {
          t.$(this).css({
            transition: "transform " + n + "ms linear",
            transform: "",
          });
        })),
        this
      );
    },
    process: function () {
      var e = i(this.element),
        o = n(this.element),
        r = this.items,
        s = [o - 1];
      if (1 == o || !e) return void r.css("transform", "");
      for (; s.length < o && s[s.length - 1] - 2; ) s.push(s[s.length - 1] - 2);
      var a = this.options.translate,
        l = e * a;
      r.each(function (n, i, e) {
        (e = -1 != s.indexOf((n + 1) % o) ? l : l / 8),
          t.$(this).css("transform", "translate3d(0," + e + "px, 0)");
      });
    },
  });
});
