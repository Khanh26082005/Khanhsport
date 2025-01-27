!(function (t) {
  var i;
  window.UIkit && (i = t(UIkit)),
    "function" == typeof define &&
      define.amd &&
      define("uikit-sticky", ["uikit"], function () {
        return i || t(UIkit);
      });
})(function (t) {
  "use strict";
  function i(i) {
    var o = arguments.length ? arguments : n;
    if (o.length && !(e.scrollTop() < 0))
      for (
        var a,
          r,
          h,
          p,
          c = e.scrollTop(),
          l = s.height(),
          d = e.height(),
          u = l - d,
          m = c > u ? u - c : 0,
          f = 0;
        f < o.length;
        f++
      )
        if (((p = o[f]), p.element.is(":visible") && !p.animate)) {
          if (p.check()) {
            if (
              (p.top < 0
                ? (a = 0)
                : ((h = p.element.outerHeight()),
                  (a = l - h - p.top - p.options.bottom - c - m),
                  (a = 0 > a ? a + p.top : p.top)),
              p.boundary && p.boundary.length)
            ) {
              var g = p.boundary.offset().top;
              (r = p.boundtoparent
                ? l -
                  (g + p.boundary.outerHeight()) +
                  parseInt(p.boundary.css("padding-bottom"))
                : l - g),
                (a =
                  c + h > l - r - (p.top < 0 ? 0 : p.top)
                    ? l - r - (c + h)
                    : a);
            }
            if (p.currentTop != a) {
              if (
                (p.element.css({
                  position: "fixed",
                  top: a,
                  width: p.getWidthFrom.length
                    ? p.getWidthFrom.width()
                    : p.element.width(),
                }),
                !p.init &&
                  (p.element.addClass(p.options.clsinit),
                  location.hash && c > 0 && p.options.target))
              ) {
                var w = t.$(location.hash);
                w.length &&
                  setTimeout(
                    (function (t, i) {
                      return function () {
                        i.element.width();
                        var e = t.offset(),
                          s = e.top + t.outerHeight(),
                          n = i.element.offset(),
                          o = i.element.outerHeight(),
                          a = n.top + o;
                        n.top < s &&
                          e.top < a &&
                          ((c = e.top - o - i.options.target),
                          window.scrollTo(0, c));
                      };
                    })(w, p),
                    0
                  );
              }
              p.element
                .addClass(p.options.clsactive)
                .removeClass(p.options.clsinactive),
                p.element.trigger("active.uk.sticky"),
                p.element.css("margin", ""),
                p.options.animation &&
                  p.init &&
                  !t.Utils.isInView(p.wrapper) &&
                  p.element.addClass(p.options.animation),
                (p.currentTop = a);
            }
          } else null !== p.currentTop && p.reset();
          p.init = !0;
        }
  }
  var e = t.$win,
    s = t.$doc,
    n = [],
    o = 1;
  return (
    t.component("sticky", {
      defaults: {
        top: 0,
        bottom: 0,
        animation: "",
        clsinit: "uk-sticky-init",
        clsactive: "uk-active",
        clsinactive: "",
        getWidthFrom: "",
        showup: !1,
        boundary: !1,
        media: !1,
        target: !1,
        disabled: !1,
      },
      boot: function () {
        t.$doc.on("scrolling.uk.document", function (t, e) {
          e && e.dir && ((o = e.dir.y), i());
        }),
          t.$win.on(
            "resize orientationchange",
            t.Utils.debounce(function () {
              if (n.length) {
                for (var t = 0; t < n.length; t++) n[t].reset(!0);
                i();
              }
            }, 100)
          ),
          t.ready(function (e) {
            setTimeout(function () {
              t.$("[data-uk-sticky]", e).each(function () {
                var i = t.$(this);
                i.data("sticky") ||
                  t.sticky(i, t.Utils.options(i.attr("data-uk-sticky")));
              }),
                i();
            }, 0);
          });
      },
      init: function () {
        var i,
          a = this.options.boundary;
        (this.wrapper = this.element
          .wrap('<div class="uk-sticky-placeholder"></div>')
          .parent()),
          this.computeWrapper(),
          this.element.css("margin", 0),
          a &&
            (a === !0 || "!" === a[0]
              ? ((a =
                  a === !0
                    ? this.wrapper.parent()
                    : this.wrapper.closest(a.substr(1))),
                (i = !0))
              : "string" == typeof a && (a = t.$(a))),
          (this.sticky = {
            self: this,
            options: this.options,
            element: this.element,
            currentTop: null,
            wrapper: this.wrapper,
            init: !1,
            getWidthFrom: t.$(this.options.getWidthFrom || this.wrapper),
            boundary: a,
            boundtoparent: i,
            top: 0,
            calcTop: function () {
              var i = this.options.top;
              if (this.options.top && "string" == typeof this.options.top)
                if (this.options.top.match(/^(-|)(\d+)vh$/))
                  i =
                    (window.innerHeight * parseInt(this.options.top, 10)) / 100;
                else {
                  var e = t.$(this.options.top).first();
                  e.length &&
                    e.is(":visible") &&
                    (i =
                      -1 *
                      (e.offset().top +
                        e.outerHeight() -
                        this.wrapper.offset().top));
                }
              this.top = i;
            },
            reset: function (i) {
              this.calcTop();
              var e = function () {
                this.element.css({
                  position: "",
                  top: "",
                  width: "",
                  left: "",
                  margin: "0",
                }),
                  this.element.removeClass(
                    [
                      this.options.animation,
                      "uk-animation-reverse",
                      this.options.clsactive,
                    ].join(" ")
                  ),
                  this.element.addClass(this.options.clsinactive),
                  this.element.trigger("inactive.uk.sticky"),
                  (this.currentTop = null),
                  (this.animate = !1);
              }.bind(this);
              !i &&
              this.options.animation &&
              t.support.animation &&
              !t.Utils.isInView(this.wrapper)
                ? ((this.animate = !0),
                  this.element
                    .removeClass(this.options.animation)
                    .one(t.support.animation.end, function () {
                      e();
                    })
                    .width(),
                  this.element.addClass(
                    this.options.animation + " uk-animation-reverse"
                  ))
                : e();
            },
            check: function () {
              if (this.options.disabled) return !1;
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
              var i = e.scrollTop(),
                n = s.height(),
                a = n - window.innerHeight,
                r = i > a ? a - i : 0,
                h = this.wrapper.offset().top,
                p = h - this.top - r,
                c = i >= p;
              return (
                c &&
                  this.options.showup &&
                  (1 == o && (c = !1),
                  -1 == o &&
                    !this.element.hasClass(this.options.clsactive) &&
                    t.Utils.isInView(this.wrapper) &&
                    (c = !1)),
                c
              );
            },
          }),
          this.sticky.calcTop(),
          n.push(this.sticky);
      },
      update: function () {
        i(this.sticky);
      },
      enable: function () {
        (this.options.disabled = !1), this.update();
      },
      disable: function (t) {
        (this.options.disabled = !0), this.sticky.reset(t);
      },
      computeWrapper: function () {
        this.wrapper.css({
          height:
            -1 == ["absolute", "fixed"].indexOf(this.element.css("position"))
              ? this.element.outerHeight()
              : "",
          float:
            "none" != this.element.css("float")
              ? this.element.css("float")
              : "",
          margin: this.element.css("margin"),
        }),
          "fixed" == this.element.css("position") &&
            this.element.css({
              width: this.sticky.getWidthFrom.length
                ? this.sticky.getWidthFrom.width()
                : this.element.width(),
            });
      },
    }),
    t.sticky
  );
});
