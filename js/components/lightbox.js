!(function (i) {
  var t;
  window.UIkit && (t = i(UIkit)),
    "function" == typeof define &&
      define.amd &&
      define("uikit-lightbox", ["uikit"], function () {
        return t || i(UIkit);
      });
})(function (i) {
  "use strict";
  function t(t) {
    return e
      ? ((e.lightbox = t), e)
      : ((e = i
          .$(
            [
              '<div class="uk-modal">',
              '<div class="uk-modal-dialog uk-modal-dialog-lightbox uk-slidenav-position" style="margin-left:auto;margin-right:auto;width:200px;height:200px;top:' +
                Math.abs(window.innerHeight / 2 - 200) +
                'px;">',
              '<a href="#" class="uk-modal-close uk-close uk-close-alt"></a>',
              '<div class="uk-lightbox-content"></div>',
              '<div class="uk-modal-spinner uk-hidden"></div>',
              "</div>",
              "</div>",
            ].join("")
          )
          .appendTo("body")),
        (e.dialog = e.find(".uk-modal-dialog:first")),
        (e.content = e.find(".uk-lightbox-content:first")),
        (e.loader = e.find(".uk-modal-spinner:first")),
        (e.closer = e.find(".uk-close.uk-close-alt")),
        (e.modal = i.modal(e, { modal: !1 })),
        e
          .on("swipeRight swipeLeft", function (i) {
            e.lightbox["swipeLeft" == i.type ? "next" : "previous"]();
          })
          .on(
            "click",
            "[data-lightbox-previous], [data-lightbox-next]",
            function (t) {
              t.preventDefault(),
                e.lightbox[
                  i.$(this).is("[data-lightbox-next]") ? "next" : "previous"
                ]();
            }
          ),
        e.on("hide.uk.modal", function (i) {
          e.content.html("");
        }),
        i.$win.on(
          "load resize orientationchange",
          i.Utils.debounce(
            function (t) {
              e.is(":visible") &&
                !i.Utils.isFullscreen() &&
                e.lightbox.fitSize();
            }.bind(this),
            100
          )
        ),
        (e.lightbox = t),
        e);
  }
  var e,
    o = {};
  return (
    i.component("lightbox", {
      defaults: { group: !1, duration: 400, keyboard: !0 },
      index: 0,
      items: !1,
      boot: function () {
        i.$html.on("click", "[data-uk-lightbox]", function (t) {
          t.preventDefault();
          var e = i.$(this);
          e.data("lightbox") ||
            i.lightbox(e, i.Utils.options(e.attr("data-uk-lightbox"))),
            e.data("lightbox").show(e);
        }),
          i.$doc.on("keyup", function (i) {
            if (e && e.is(":visible") && e.lightbox.options.keyboard)
              switch ((i.preventDefault(), i.keyCode)) {
                case 37:
                  e.lightbox.previous();
                  break;
                case 39:
                  e.lightbox.next();
              }
          });
      },
      init: function () {
        var t = [];
        if (
          ((this.index = 0),
          (this.siblings = []),
          this.element && this.element.length)
        ) {
          var e = this.options.group
            ? i.$(
                [
                  '[data-uk-lightbox*="' + this.options.group + '"]',
                  "[data-uk-lightbox*='" + this.options.group + "']",
                ].join(",")
              )
            : this.element;
          e.each(function () {
            var e = i.$(this);
            t.push({
              source: e.attr("href"),
              title: e.attr("data-title") || e.attr("title"),
              type: e.attr("data-lightbox-type") || "auto",
              link: e,
            });
          }),
            (this.index = e.index(this.element)),
            (this.siblings = t);
        } else
          this.options.group &&
            this.options.group.length &&
            (this.siblings = this.options.group);
        this.trigger("lightbox-init", [this]);
      },
      show: function (e) {
        (this.modal = t(this)),
          this.modal.dialog.stop(),
          this.modal.content.stop();
        var o,
          n,
          s = this,
          h = i.$.Deferred();
        (e = e || 0),
          "object" == typeof e &&
            this.siblings.forEach(function (i, t) {
              e[0] === i.link[0] && (e = t);
            }),
          0 > e ? (e = this.siblings.length - e) : this.siblings[e] || (e = 0),
          (n = this.siblings[e]),
          (o = {
            lightbox: s,
            source: n.source,
            type: n.type,
            index: e,
            promise: h,
            title: n.title,
            item: n,
            meta: { content: "", width: null, height: null },
          }),
          (this.index = e),
          this.modal.content.empty(),
          this.modal.is(":visible") ||
            (this.modal.content.css({ width: "", height: "" }).empty(),
            this.modal.modal.show()),
          this.modal.loader.removeClass("uk-hidden"),
          h
            .promise()
            .done(function () {
              (s.data = o), s.fitSize(o);
            })
            .fail(function () {
              (o.meta.content =
                '<div class="uk-position-cover uk-flex uk-flex-middle uk-flex-center"><strong>Loading resource failed!</strong></div>'),
                (o.meta.width = 400),
                (o.meta.height = 300),
                (s.data = o),
                s.fitSize(o);
            }),
          s.trigger("showitem.uk.lightbox", [o]);
      },
      fitSize: function () {
        var t = this,
          e = this.data,
          o = this.modal.dialog.outerWidth() - this.modal.dialog.width(),
          n = parseInt(this.modal.dialog.css("margin-top"), 10),
          s = parseInt(this.modal.dialog.css("margin-bottom"), 10),
          h = n + s,
          a = e.meta.content,
          d = t.options.duration;
        this.siblings.length > 1 &&
          (a = [
            a,
            '<a href="#" class="uk-slidenav uk-slidenav-contrast uk-slidenav-previous uk-hidden-touch" data-lightbox-previous></a>',
            '<a href="#" class="uk-slidenav uk-slidenav-contrast uk-slidenav-next uk-hidden-touch" data-lightbox-next></a>',
          ].join(""));
        var l,
          r,
          u = i
            .$("<div>&nbsp;</div>")
            .css({
              opacity: 0,
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              "max-width": t.modal.dialog.css("max-width"),
              padding: t.modal.dialog.css("padding"),
              margin: t.modal.dialog.css("margin"),
            }),
          c = e.meta.width,
          g = e.meta.height;
        u.appendTo("body").width(),
          (l = u.width()),
          (r = window.innerHeight - h),
          u.remove(),
          this.modal.dialog.find(".uk-modal-caption").remove(),
          e.title &&
            (this.modal.dialog.append(
              '<div class="uk-modal-caption">' + e.title + "</div>"
            ),
            (r -= this.modal.dialog.find(".uk-modal-caption").outerHeight())),
          l < e.meta.width && ((g = Math.floor(g * (l / c))), (c = l)),
          g > r &&
            ((g = Math.floor(r)),
            (c = Math.ceil(e.meta.width * (r / e.meta.height)))),
          this.modal.content.css("opacity", 0).width(c).html(a),
          "iframe" == e.type &&
            this.modal.content.find("iframe:first").height(g);
        var m = g + o,
          p = Math.floor(window.innerHeight / 2 - m / 2) - h;
        0 > p && (p = 0),
          this.modal.closer.addClass("uk-hidden"),
          t.modal.data("mwidth") == c &&
            t.modal.data("mheight") == g &&
            (d = 0),
          this.modal.dialog.animate(
            { width: c + o, height: g + o, top: p },
            d,
            "swing",
            function () {
              t.modal.loader.addClass("uk-hidden"),
                t.modal.content
                  .css({ width: "" })
                  .animate({ opacity: 1 }, function () {
                    t.modal.closer.removeClass("uk-hidden");
                  }),
                t.modal.data({ mwidth: c, mheight: g });
            }
          );
      },
      next: function () {
        this.show(this.siblings[this.index + 1] ? this.index + 1 : 0);
      },
      previous: function () {
        this.show(
          this.siblings[this.index - 1]
            ? this.index - 1
            : this.siblings.length - 1
        );
      },
    }),
    i.plugin("lightbox", "image", {
      init: function (i) {
        i.on("showitem.uk.lightbox", function (i, t) {
          if (
            "image" == t.type ||
            (t.source && t.source.match(/\.(jpg|jpeg|png|gif|svg)$/i))
          ) {
            var e = function (i, e, o) {
              (t.meta = {
                content:
                  '<img class="uk-responsive-width" width="' +
                  e +
                  '" height="' +
                  o +
                  '" src ="' +
                  i +
                  '">',
                width: e,
                height: o,
              }),
                (t.type = "image"),
                t.promise.resolve();
            };
            if (o[t.source]) e(t.source, o[t.source].width, o[t.source].height);
            else {
              var n = new Image();
              (n.onerror = function () {
                t.promise.reject("Loading image failed");
              }),
                (n.onload = function () {
                  (o[t.source] = { width: n.width, height: n.height }),
                    e(t.source, o[t.source].width, o[t.source].height);
                }),
                (n.src = t.source);
            }
          }
        });
      },
    }),
    i.plugin("lightbox", "youtube", {
      init: function (i) {
        var t = /(\/\/.*?youtube\.[a-z]+)\/watch\?v=([^&]+)&?(.*)/,
          e = /youtu\.be\/(.*)/;
        i.on("showitem.uk.lightbox", function (i, n) {
          var s,
            h,
            a = function (i, t, e) {
              (n.meta = {
                content:
                  '<iframe src="//www.youtube.com/embed/' +
                  i +
                  '" width="' +
                  t +
                  '" height="' +
                  e +
                  '" style="max-width:100%;"></iframe>',
                width: t,
                height: e,
              }),
                (n.type = "iframe"),
                n.promise.resolve();
            };
          if (
            ((h = n.source.match(t)) && (s = h[2]),
            (h = n.source.match(e)) && (s = h[1]),
            s)
          ) {
            if (o[s]) a(s, o[s].width, o[s].height);
            else {
              var d = new Image(),
                l = !1;
              (d.onerror = function () {
                (o[s] = { width: 640, height: 320 }),
                  a(s, o[s].width, o[s].height);
              }),
                (d.onload = function () {
                  120 == d.width && 90 == d.height
                    ? l
                      ? ((o[s] = { width: 640, height: 320 }),
                        a(s, o[s].width, o[s].height))
                      : ((l = !0),
                        (d.src = "//img.youtube.com/vi/" + s + "/0.jpg"))
                    : ((o[s] = { width: d.width, height: d.height }),
                      a(s, d.width, d.height));
                }),
                (d.src = "//img.youtube.com/vi/" + s + "/maxresdefault.jpg");
            }
            i.stopImmediatePropagation();
          }
        });
      },
    }),
    i.plugin("lightbox", "vimeo", {
      init: function (t) {
        var e,
          n = /(\/\/.*?)vimeo\.[a-z]+\/([0-9]+).*?/;
        t.on("showitem.uk.lightbox", function (t, s) {
          var h,
            a = function (i, t, e) {
              (s.meta = {
                content:
                  '<iframe src="//player.vimeo.com/video/' +
                  i +
                  '" width="' +
                  t +
                  '" height="' +
                  e +
                  '" style="width:100%;box-sizing:border-box;"></iframe>',
                width: t,
                height: e,
              }),
                (s.type = "iframe"),
                s.promise.resolve();
            };
          (e = s.source.match(n)) &&
            ((h = e[2]),
            o[h]
              ? a(h, o[h].width, o[h].height)
              : i.$.ajax({
                  type: "GET",
                  url:
                    "http://vimeo.com/api/oembed.json?url=" +
                    encodeURI(s.source),
                  jsonp: "callback",
                  dataType: "jsonp",
                  success: function (i) {
                    (o[h] = { width: i.width, height: i.height }),
                      a(h, o[h].width, o[h].height);
                  },
                }),
            t.stopImmediatePropagation());
        });
      },
    }),
    i.plugin("lightbox", "video", {
      init: function (t) {
        t.on("showitem.uk.lightbox", function (t, e) {
          var n = function (i, t, o) {
            (e.meta = {
              content:
                '<video class="uk-responsive-width" src="' +
                i +
                '" width="' +
                t +
                '" height="' +
                o +
                '" controls></video>',
              width: t,
              height: o,
            }),
              (e.type = "video"),
              e.promise.resolve();
          };
          if ("video" == e.type || e.source.match(/\.(mp4|webm|ogv)$/i))
            if (o[e.source]) n(e.source, o[e.source].width, o[e.source].height);
            else
              var s = i
                  .$(
                    '<video style="position:fixed;visibility:hidden;top:-10000px;"></video>'
                  )
                  .attr("src", e.source)
                  .appendTo("body"),
                h = setInterval(function () {
                  s[0].videoWidth &&
                    (clearInterval(h),
                    (o[e.source] = {
                      width: s[0].videoWidth,
                      height: s[0].videoHeight,
                    }),
                    n(e.source, o[e.source].width, o[e.source].height),
                    s.remove());
                }, 20);
        });
      },
    }),
    UIkit.plugin("lightbox", "iframe", {
      init: function (i) {
        i.on("showitem.uk.lightbox", function (t, e) {
          var o = function (i, t, o) {
            (e.meta = {
              content:
                '<iframe class="uk-responsive-width" src="' +
                i +
                '" width="' +
                t +
                '" height="' +
                o +
                '"></iframe>',
              width: t,
              height: o,
            }),
              (e.type = "iframe"),
              e.promise.resolve();
          };
          ("iframe" === e.type || e.source.match(/\.(html|php)$/)) &&
            o(e.source, i.options.width || 800, i.options.height || 600);
        });
      },
    }),
    (i.lightbox.create = function (t, e) {
      if (t) {
        var o,
          n = [];
        return (
          t.forEach(function (t) {
            n.push(
              i.$.extend(
                { source: "", title: "", type: "auto", link: !1 },
                "string" == typeof t ? { source: t } : t
              )
            );
          }),
          (o = i.lightbox(i.$.extend({}, e, { group: n })))
        );
      }
    }),
    i.lightbox
  );
});
