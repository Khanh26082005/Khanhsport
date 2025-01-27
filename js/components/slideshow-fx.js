!(function (i) {
  var t;
  window.UIkit && (t = i(UIkit)),
    "function" == typeof define &&
      define.amd &&
      define("uikit-slideshow-fx", ["uikit"], function () {
        return t || i(UIkit);
      });
})(function (i) {
  "use strict";
  var t = i.slideshow.animations;
  i.$.extend(i.slideshow.animations, {
    slice: function (e, s, n, o) {
      if (!e.data("cover")) return t.fade.apply(this, arguments);
      for (
        var r,
          a = i.$.Deferred(),
          c = Math.ceil(this.element.width() / this.options.slices),
          h = s.data("cover").css("background-image"),
          d = i.$("<li></li>").css({
            top: 0,
            left: 0,
            width: this.container.width(),
            height: this.container.height(),
            opacity: 1,
            zIndex: 15,
          }),
          p = d.width(),
          l = d.height(),
          u = "slice-up" == o ? l : "0",
          f = 0;
        f < this.options.slices;
        f++
      ) {
        "slice-up-down" == o && (u = ((f % 2) + 2) % 2 == 0 ? "0" : l);
        var m,
          x = f == this.options.slices - 1 ? c : c,
          v = "rect(0px, " + x * (f + 1) + "px, " + l + "px, " + c * f + "px)";
        (m = "rect(0px, " + x * (f + 1) + "px, 0px, " + c * f + "px)"),
          ("slice-up" == o ||
            ("slice-up-down" == o && ((f % 2) + 2) % 2 == 0)) &&
            (m =
              "rect(" +
              l +
              "px, " +
              x * (f + 1) +
              "px, " +
              l +
              "px, " +
              c * f +
              "px)"),
          (r = i
            .$('<div class="uk-cover-background"></div>')
            .css({
              position: "absolute",
              top: 0,
              left: 0,
              width: p,
              height: l,
              "background-image": h,
              clip: m,
              opacity: 0,
              transition:
                "all " +
                this.options.duration +
                "ms ease-in-out " +
                60 * f +
                "ms",
              "-webkit-transition":
                "all " +
                this.options.duration +
                "ms ease-in-out " +
                60 * f +
                "ms",
            })
            .data("clip", v)),
          d.append(r);
      }
      return (
        this.container.append(d),
        d
          .children()
          .last()
          .on(i.support.transition.end, function () {
            d.remove(), a.resolve();
          }),
        d.width(),
        d.children().each(function () {
          var t = i.$(this);
          t.css({ clip: t.data("clip"), opacity: 1 });
        }),
        a.promise()
      );
    },
    "slice-up": function (i, e, s) {
      return t.slice.apply(this, [i, e, s, "slice-up"]);
    },
    "slice-down": function (i, e, s) {
      return t.slice.apply(this, [i, e, s, "slice-down"]);
    },
    "slice-up-down": function (i, e, s) {
      return t.slice.apply(this, [i, e, s, "slice-up-down"]);
    },
    fold: function (e, s, n) {
      if (!s.data("cover")) return t.fade.apply(this, arguments);
      for (
        var o,
          r = i.$.Deferred(),
          a = Math.ceil(this.element.width() / this.options.slices),
          c = s.data("cover").css("background-image"),
          h = i.$("<li></li>").css({
            width: s.width(),
            height: s.height(),
            opacity: 1,
            zIndex: 15,
          }),
          d = s.width(),
          p = s.height(),
          l = 0;
        l < this.options.slices;
        l++
      )
        (o = i.$('<div class="uk-cover-background"></div>').css({
          position: "absolute",
          top: 0,
          left: 0,
          width: d,
          height: p,
          "background-image": c,
          "transform-origin": a * l + "px 0 0",
          clip:
            "rect(0px, " + a * (l + 1) + "px, " + p + "px, " + a * l + "px)",
          opacity: 0,
          transform: "scaleX(0.000001)",
          transition:
            "all " +
            this.options.duration +
            "ms ease-in-out " +
            (100 + 60 * l) +
            "ms",
          "-webkit-transition":
            "all " +
            this.options.duration +
            "ms ease-in-out " +
            (100 + 60 * l) +
            "ms",
        })),
          h.prepend(o);
      return (
        this.container.append(h),
        h.width(),
        h
          .children()
          .first()
          .on(i.support.transition.end, function () {
            h.remove(), r.resolve();
          })
          .end()
          .css({ transform: "scaleX(1)", opacity: 1 }),
        r.promise()
      );
    },
    puzzle: function (s, n, o) {
      if (!n.data("cover")) return t.fade.apply(this, arguments);
      for (
        var r,
          a,
          c,
          h = i.$.Deferred(),
          d = this,
          p = Math.round(this.options.slices / 2),
          l = Math.round(n.width() / p),
          u = Math.round(n.height() / l),
          f = Math.round(n.height() / u) + 1,
          m = n.data("cover").css("background-image"),
          x = i.$("<li></li>").css({
            width: this.container.width(),
            height: this.container.height(),
            opacity: 1,
            zIndex: 15,
          }),
          v = this.container.width(),
          g = this.container.height(),
          w = 0;
        u > w;
        w++
      )
        for (var b = 0; p > b; b++)
          (c = b == p - 1 ? l + 2 : l),
            (a = [
              f * w + "px",
              c * (b + 1) + "px",
              f * (w + 1) + "px",
              l * b + "px",
            ]),
            (r = i.$('<div class="uk-cover-background"></div>').css({
              position: "absolute",
              top: 0,
              left: 0,
              opacity: 0,
              width: v,
              height: g,
              "background-image": m,
              clip: "rect(" + a.join(",") + ")",
              "-webkit-transform": "translateZ(0)",
              transform: "translateZ(0)",
            })),
            x.append(r);
      this.container.append(x);
      var k = e(x.children());
      return (
        k
          .each(function (t) {
            i.$(this).css({
              transition:
                "all " +
                d.options.duration +
                "ms ease-in-out " +
                (50 + 25 * t) +
                "ms",
              "-webkit-transition":
                "all " +
                d.options.duration +
                "ms ease-in-out " +
                (50 + 25 * t) +
                "ms",
            });
          })
          .last()
          .on(i.support.transition.end, function () {
            x.remove(), h.resolve();
          }),
        x.width(),
        k.css({ opacity: 1 }),
        h.promise()
      );
    },
    boxes: function (e, s, n, o) {
      if (!s.data("cover")) return t.fade.apply(this, arguments);
      for (
        var r,
          a,
          c,
          h,
          d = i.$.Deferred(),
          p = Math.round(this.options.slices / 2),
          l = Math.round(s.width() / p),
          u = Math.round(s.height() / l),
          f = Math.round(s.height() / u) + 1,
          m = s.data("cover").css("background-image"),
          x = i.$("<li></li>").css({
            width: s.width(),
            height: s.height(),
            opacity: 1,
            zIndex: 15,
          }),
          v = s.width(),
          g = s.height(),
          w = 0;
        u > w;
        w++
      )
        for (h = 0; p > h; h++)
          (c = h == p - 1 ? l + 2 : l),
            (a = [
              f * w + "px",
              c * (h + 1) + "px",
              f * (w + 1) + "px",
              l * h + "px",
            ]),
            (r = i.$('<div class="uk-cover-background"></div>').css({
              position: "absolute",
              top: 0,
              left: 0,
              opacity: 1,
              width: v,
              height: g,
              "background-image": m,
              "transform-origin": a[3] + " " + a[0] + " 0",
              clip: "rect(" + a.join(",") + ")",
              "-webkit-transform": "scale(0.0000000000000001)",
              transform: "scale(0.0000000000000001)",
            })),
            x.append(r);
      this.container.append(x);
      var b,
        k = 0,
        y = 0,
        $ = 0,
        I = [[]],
        M = x.children();
      for (
        "boxes-reverse" == o && (M = [].reverse.apply(M)),
          M.each(function () {
            (I[k][y] = i.$(this)), y++, y == p && (k++, (y = 0), (I[k] = []));
          }),
          h = 0,
          b = 0;
        p * u > h;
        h++
      ) {
        b = h;
        for (var z = 0; u > z; z++)
          b >= 0 &&
            p > b &&
            I[z][b].css({
              transition:
                "all " + this.options.duration + "ms linear " + (50 + $) + "ms",
              "-webkit-transition":
                "all " + this.options.duration + "ms linear " + (50 + $) + "ms",
            }),
            b--;
        $ += 100;
      }
      return (
        M.last().on(i.support.transition.end, function () {
          x.remove(), d.resolve();
        }),
        x.width(),
        M.css({ "-webkit-transform": "scale(1)", transform: "scale(1)" }),
        d.promise()
      );
    },
    "boxes-reverse": function (i, e, s) {
      return t.boxes.apply(this, [i, e, s, "boxes-reverse"]);
    },
    "random-fx": function () {
      var i = [
        "slice-up",
        "fold",
        "puzzle",
        "slice-down",
        "boxes",
        "slice-up-down",
        "boxes-reverse",
      ];
      return (
        (this.fxIndex = (void 0 === this.fxIndex ? -1 : this.fxIndex) + 1),
        i[this.fxIndex] || (this.fxIndex = 0),
        t[i[this.fxIndex]].apply(this, arguments)
      );
    },
  });
  var e = function (i) {
    for (
      var t, e, s = i.length;
      s;
      t = parseInt(Math.random() * s), e = i[--s], i[s] = i[t], i[t] = e
    );
    return i;
  };
  return i.slideshow.animations;
});
