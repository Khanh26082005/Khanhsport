!(function (i) {
  var t;
  window.UIkit && (t = i(UIkit)),
    "function" == typeof define &&
      define.amd &&
      define("uikit-slideshow", ["uikit"], function () {
        return t || i(UIkit);
      });
})(function (i) {
  "use strict";
  var t,
    s = 0;
  i.component("slideshow", {
    defaults: {
      animation: "fade",
      duration: 500,
      height: "auto",
      start: 0,
      autoplay: !1,
      autoplayInterval: 7e3,
      videoautoplay: !0,
      videomute: !0,
      slices: 15,
      pauseOnHover: !0,
      kenburns: !1,
      kenburnsanimations: [
        "uk-animation-middle-left",
        "uk-animation-top-right",
        "uk-animation-bottom-left",
        "uk-animation-top-center",
        "",
        "uk-animation-bottom-right",
      ],
    },
    current: !1,
    interval: null,
    hovering: !1,
    boot: function () {
      i.ready(function (t) {
        i.$("[data-uk-slideshow]", t).each(function () {
          var t = i.$(this);
          t.data("slideshow") ||
            i.slideshow(t, i.Utils.options(t.attr("data-uk-slideshow")));
        });
      });
    },
    init: function () {
      var t,
        e,
        a = this;
      (this.container = this.element.hasClass("uk-slideshow")
        ? this.element
        : i.$(this.find(".uk-slideshow"))),
        (this.slides = this.container.children()),
        (this.slidesCount = this.slides.length),
        (this.current = this.options.start),
        (this.animating = !1),
        (this.triggers = this.find("[data-uk-slideshow-item]")),
        (this.fixFullscreen =
          navigator.userAgent.match(/(iPad|iPhone|iPod)/g) &&
          this.container.hasClass("uk-slideshow-fullscreen")),
        this.options.kenburns &&
          ((e = this.options.kenburns === !0 ? "15s" : this.options.kenburns),
          String(e).match(/(ms|s)$/) || (e += "ms"),
          "string" == typeof this.options.kenburnsanimations &&
            (this.options.kenburnsanimations =
              this.options.kenburnsanimations.split(","))),
        this.slides.each(function (n) {
          var o = i.$(this),
            r = o.children("img,video,iframe").eq(0);
          if ((o.data("media", r), o.data("sizer", r), r.length)) {
            var d;
            switch (r[0].nodeName) {
              case "IMG":
                var u = i
                  .$(
                    '<div class="uk-cover-background uk-position-cover"></div>'
                  )
                  .css({ "background-image": "url(" + r.attr("src") + ")" });
                r.attr("width") &&
                  r.attr("height") &&
                  ((d = i.$("<canvas></canvas>").attr({
                    width: r.attr("width"),
                    height: r.attr("height"),
                  })),
                  r.replaceWith(d),
                  (r = d),
                  (d = void 0)),
                  r.css({ width: "100%", height: "auto", opacity: 0 }),
                  o.prepend(u).data("cover", u);
                break;
              case "IFRAME":
                var h = r[0].src,
                  c = "sw-" + ++s;
                r
                  .attr("src", "")
                  .on("load", function () {
                    if (
                      ((n !== a.current ||
                        (n == a.current && !a.options.videoautoplay)) &&
                        a.pausemedia(r),
                      a.options.videomute)
                    ) {
                      a.mutemedia(r);
                      var i = setInterval(
                        (function (t) {
                          return function () {
                            a.mutemedia(r), ++t >= 4 && clearInterval(i);
                          };
                        })(0),
                        250
                      );
                    }
                  })
                  .data("slideshow", a)
                  .attr("data-player-id", c)
                  .attr(
                    "src",
                    [
                      h,
                      h.indexOf("?") > -1 ? "&" : "?",
                      "enablejsapi=1&api=1&player_id=" + c,
                    ].join("")
                  )
                  .addClass("uk-position-absolute"),
                  i.support.touch || r.css("pointer-events", "none"),
                  (d = !0),
                  i.cover && (i.cover(r), r.attr("data-uk-cover", "{}"));
                break;
              case "VIDEO":
                r.addClass("uk-cover-object uk-position-absolute"),
                  (d = !0),
                  a.options.videomute && a.mutemedia(r);
            }
            if (d) {
              t = i
                .$("<canvas></canvas>")
                .attr({ width: r[0].width, height: r[0].height });
              var l = i
                .$('<img style="width:100%;height:auto;">')
                .attr("src", t[0].toDataURL());
              o.prepend(l), o.data("sizer", l);
            }
          } else o.data("sizer", o);
          a.hasKenBurns(o) &&
            o.data("cover").css({
              "-webkit-animation-duration": e,
              "animation-duration": e,
            });
        }),
        this.on("click.uk.slideshow", "[data-uk-slideshow-item]", function (t) {
          t.preventDefault();
          var s = i.$(this).attr("data-uk-slideshow-item");
          if (a.current != s) {
            switch (s) {
              case "next":
              case "previous":
                a["next" == s ? "next" : "previous"]();
                break;
              default:
                a.show(parseInt(s, 10));
            }
            a.stop();
          }
        }),
        this.slides
          .attr("aria-hidden", "true")
          .eq(this.current)
          .addClass("uk-active")
          .attr("aria-hidden", "false"),
        this.triggers
          .filter('[data-uk-slideshow-item="' + this.current + '"]')
          .addClass("uk-active"),
        i.$win.on(
          "resize load",
          i.Utils.debounce(function () {
            a.resize(),
              a.fixFullscreen &&
                (a.container.css("height", window.innerHeight),
                a.slides.css("height", window.innerHeight));
          }, 100)
        ),
        setTimeout(function () {
          a.resize();
        }, 80),
        this.options.autoplay && this.start(),
        this.options.videoautoplay &&
          this.slides.eq(this.current).data("media") &&
          this.playmedia(this.slides.eq(this.current).data("media")),
        this.options.kenburns &&
          this.applyKenBurns(this.slides.eq(this.current)),
        this.container.on({
          mouseenter: function () {
            a.options.pauseOnHover && (a.hovering = !0);
          },
          mouseleave: function () {
            a.hovering = !1;
          },
        }),
        this.on("swipeRight swipeLeft", function (i) {
          a["swipeLeft" == i.type ? "next" : "previous"]();
        }),
        this.on("display.uk.check", function () {
          a.element.is(":visible") &&
            (a.resize(),
            a.fixFullscreen &&
              (a.container.css("height", window.innerHeight),
              a.slides.css("height", window.innerHeight)));
        });
    },
    resize: function () {
      if (!this.container.hasClass("uk-slideshow-fullscreen")) {
        var t = this.options.height;
        "auto" === this.options.height &&
          ((t = 0),
          this.slides.css("height", "").each(function () {
            t = Math.max(t, i.$(this).height());
          })),
          this.container.css("height", t),
          this.slides.css("height", t);
      }
    },
    show: function (s, e) {
      if (!this.animating && this.current != s) {
        this.animating = !0;
        var a = this,
          n = this.slides.eq(this.current),
          o = this.slides.eq(s),
          r = e ? e : this.current < s ? 1 : -1,
          d = n.data("media"),
          u = t[this.options.animation] ? this.options.animation : "fade",
          h = o.data("media"),
          c = function () {
            a.animating &&
              (d && d.is("video,iframe") && a.pausemedia(d),
              h && h.is("video,iframe") && a.playmedia(h),
              o.addClass("uk-active").attr("aria-hidden", "false"),
              n.removeClass("uk-active").attr("aria-hidden", "true"),
              (a.animating = !1),
              (a.current = s),
              i.Utils.checkDisplay(
                o,
                '[class*="uk-animation-"]:not(.uk-cover-background.uk-position-cover)'
              ),
              a.trigger("show.uk.slideshow", [o, n, a]));
          };
        a.applyKenBurns(o),
          i.support.animation || (u = "none"),
          (n = i.$(n)),
          (o = i.$(o)),
          a.trigger("beforeshow.uk.slideshow", [o, n, a]),
          t[u].apply(this, [n, o, r]).then(c),
          a.triggers.removeClass("uk-active"),
          a.triggers
            .filter('[data-uk-slideshow-item="' + s + '"]')
            .addClass("uk-active");
      }
    },
    applyKenBurns: function (i) {
      if (this.hasKenBurns(i)) {
        var t = this.options.kenburnsanimations,
          s = this.kbindex || 0;
        i
          .data("cover")
          .attr("class", "uk-cover-background uk-position-cover")
          .width(),
          i
            .data("cover")
            .addClass(
              ["uk-animation-scale", "uk-animation-reverse", t[s].trim()].join(
                " "
              )
            ),
          (this.kbindex = t[s + 1] ? s + 1 : 0);
      }
    },
    hasKenBurns: function (i) {
      return this.options.kenburns && i.data("cover");
    },
    next: function () {
      this.show(this.slides[this.current + 1] ? this.current + 1 : 0, 1);
    },
    previous: function () {
      this.show(
        this.slides[this.current - 1]
          ? this.current - 1
          : this.slides.length - 1,
        -1
      );
    },
    start: function () {
      this.stop();
      var i = this;
      this.interval = setInterval(function () {
        i.hovering || i.next();
      }, this.options.autoplayInterval);
    },
    stop: function () {
      this.interval && clearInterval(this.interval);
    },
    playmedia: function (i) {
      if (i && i[0])
        switch (i[0].nodeName) {
          case "VIDEO":
            this.options.videomute || (i[0].muted = !1), i[0].play();
            break;
          case "IFRAME":
            this.options.videomute ||
              i[0].contentWindow.postMessage(
                '{ "event": "command", "func": "unmute", "method":"setVolume", "value":1}',
                "*"
              ),
              i[0].contentWindow.postMessage(
                '{ "event": "command", "func": "playVideo", "method":"play"}',
                "*"
              );
        }
    },
    pausemedia: function (i) {
      switch (i[0].nodeName) {
        case "VIDEO":
          i[0].pause();
          break;
        case "IFRAME":
          i[0].contentWindow.postMessage(
            '{ "event": "command", "func": "pauseVideo", "method":"pause"}',
            "*"
          );
      }
    },
    mutemedia: function (i) {
      switch (i[0].nodeName) {
        case "VIDEO":
          i[0].muted = !0;
          break;
        case "IFRAME":
          i[0].contentWindow.postMessage(
            '{ "event": "command", "func": "mute", "method":"setVolume", "value":0}',
            "*"
          );
      }
    },
  }),
    (t = {
      none: function () {
        var t = i.$.Deferred();
        return t.resolve(), t.promise();
      },
      scroll: function (t, s, e) {
        var a = i.$.Deferred();
        return (
          t.css("animation-duration", this.options.duration + "ms"),
          s.css("animation-duration", this.options.duration + "ms"),
          s.css("opacity", 1).one(
            i.support.animation.end,
            function () {
              t.removeClass(
                -1 == e
                  ? "uk-slideshow-scroll-backward-out"
                  : "uk-slideshow-scroll-forward-out"
              ),
                s
                  .css("opacity", "")
                  .removeClass(
                    -1 == e
                      ? "uk-slideshow-scroll-backward-in"
                      : "uk-slideshow-scroll-forward-in"
                  ),
                a.resolve();
            }.bind(this)
          ),
          t.addClass(
            -1 == e
              ? "uk-slideshow-scroll-backward-out"
              : "uk-slideshow-scroll-forward-out"
          ),
          s.addClass(
            -1 == e
              ? "uk-slideshow-scroll-backward-in"
              : "uk-slideshow-scroll-forward-in"
          ),
          s.width(),
          a.promise()
        );
      },
      swipe: function (t, s, e) {
        var a = i.$.Deferred();
        return (
          t.css("animation-duration", this.options.duration + "ms"),
          s.css("animation-duration", this.options.duration + "ms"),
          s.css("opacity", 1).one(
            i.support.animation.end,
            function () {
              t.removeClass(
                -1 === e
                  ? "uk-slideshow-swipe-backward-out"
                  : "uk-slideshow-swipe-forward-out"
              ),
                s
                  .css("opacity", "")
                  .removeClass(
                    -1 === e
                      ? "uk-slideshow-swipe-backward-in"
                      : "uk-slideshow-swipe-forward-in"
                  ),
                a.resolve();
            }.bind(this)
          ),
          t.addClass(
            -1 == e
              ? "uk-slideshow-swipe-backward-out"
              : "uk-slideshow-swipe-forward-out"
          ),
          s.addClass(
            -1 == e
              ? "uk-slideshow-swipe-backward-in"
              : "uk-slideshow-swipe-forward-in"
          ),
          s.width(),
          a.promise()
        );
      },
      scale: function (t, s, e) {
        var a = i.$.Deferred();
        return (
          t.css("animation-duration", this.options.duration + "ms"),
          s.css("animation-duration", this.options.duration + "ms"),
          s.css("opacity", 1),
          t.one(
            i.support.animation.end,
            function () {
              t.removeClass("uk-slideshow-scale-out"),
                s.css("opacity", ""),
                a.resolve();
            }.bind(this)
          ),
          t.addClass("uk-slideshow-scale-out"),
          t.width(),
          a.promise()
        );
      },
      fade: function (t, s, e) {
        var a = i.$.Deferred();
        return (
          t.css("animation-duration", this.options.duration + "ms"),
          s.css("animation-duration", this.options.duration + "ms"),
          s.css("opacity", 1),
          s.data("cover") ||
            s.data("placeholder") ||
            s
              .css("opacity", 1)
              .one(i.support.animation.end, function () {
                s.removeClass("uk-slideshow-fade-in");
              })
              .addClass("uk-slideshow-fade-in"),
          t.one(
            i.support.animation.end,
            function () {
              t.removeClass("uk-slideshow-fade-out"),
                s.css("opacity", ""),
                a.resolve();
            }.bind(this)
          ),
          t.addClass("uk-slideshow-fade-out"),
          t.width(),
          a.promise()
        );
      },
    }),
    (i.slideshow.animations = t),
    window.addEventListener(
      "message",
      function (t) {
        var s,
          e = t.data;
        if ("string" == typeof e)
          try {
            e = JSON.parse(e);
          } catch (a) {
            e = {};
          }
        t.origin &&
          t.origin.indexOf("vimeo") > -1 &&
          "ready" == e.event &&
          e.player_id &&
          ((s = i.$('[data-player-id="' + e.player_id + '"]')),
          s.length && s.data("slideshow").mutemedia(s));
      },
      !1
    );
});
