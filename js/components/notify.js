!(function (t) {
  var e;
  window.UIkit && (e = t(UIkit)),
    "function" == typeof define &&
      define.amd &&
      define("uikit-notify", ["uikit"], function () {
        return e || t(UIkit);
      });
})(function (t) {
  "use strict";
  var e = {},
    i = {},
    s = function (e) {
      return (
        "string" == t.$.type(e) && (e = { message: e }),
        arguments[1] &&
          (e = t.$.extend(
            e,
            "string" == t.$.type(arguments[1])
              ? { status: arguments[1] }
              : arguments[1]
          )),
        new n(e).show()
      );
    },
    o = function (t, e) {
      var s;
      if (t) for (s in i) t === i[s].group && i[s].close(e);
      else for (s in i) i[s].close(e);
    },
    n = function (s) {
      (this.options = t.$.extend({}, n.defaults, s)),
        (this.uuid = t.Utils.uid("notifymsg")),
        (this.element = t
          .$(
            [
              '<div class="uk-notify-message">',
              '<a class="uk-close"></a>',
              "<div></div>",
              "</div>",
            ].join("")
          )
          .data("notifyMessage", this)),
        this.content(this.options.message),
        this.options.status &&
          (this.element.addClass("uk-notify-message-" + this.options.status),
          (this.currentstatus = this.options.status)),
        (this.group = this.options.group),
        (i[this.uuid] = this),
        e[this.options.pos] ||
          (e[this.options.pos] = t
            .$(
              '<div class="uk-notify uk-notify-' + this.options.pos + '"></div>'
            )
            .appendTo("body")
            .on("click", ".uk-notify-message", function () {
              var e = t.$(this).data("notifyMessage");
              e.element.trigger("manualclose.uk.notify", [e]), e.close();
            }));
    };
  return (
    t.$.extend(n.prototype, {
      uuid: !1,
      element: !1,
      timout: !1,
      currentstatus: "",
      group: !1,
      show: function () {
        if (!this.element.is(":visible")) {
          var t = this;
          e[this.options.pos].show().prepend(this.element);
          var i = parseInt(this.element.css("margin-bottom"), 10);
          return (
            this.element
              .css({
                opacity: 0,
                "margin-top": -1 * this.element.outerHeight(),
                "margin-bottom": 0,
              })
              .animate(
                { opacity: 1, "margin-top": 0, "margin-bottom": i },
                function () {
                  if (t.options.timeout) {
                    var e = function () {
                      t.close();
                    };
                    (t.timeout = setTimeout(e, t.options.timeout)),
                      t.element.hover(
                        function () {
                          clearTimeout(t.timeout);
                        },
                        function () {
                          t.timeout = setTimeout(e, t.options.timeout);
                        }
                      );
                  }
                }
              ),
            this
          );
        }
      },
      close: function (t) {
        var s = this,
          o = function () {
            s.element.remove(),
              e[s.options.pos].children().length || e[s.options.pos].hide(),
              s.options.onClose.apply(s, []),
              s.element.trigger("close.uk.notify", [s]),
              delete i[s.uuid];
          };
        this.timeout && clearTimeout(this.timeout),
          t
            ? o()
            : this.element.animate(
                {
                  opacity: 0,
                  "margin-top": -1 * this.element.outerHeight(),
                  "margin-bottom": 0,
                },
                function () {
                  o();
                }
              );
      },
      content: function (t) {
        var e = this.element.find(">div");
        return t ? (e.html(t), this) : e.html();
      },
      status: function (t) {
        return t
          ? (this.element
              .removeClass("uk-notify-message-" + this.currentstatus)
              .addClass("uk-notify-message-" + t),
            (this.currentstatus = t),
            this)
          : this.currentstatus;
      },
    }),
    (n.defaults = {
      message: "",
      status: "",
      timeout: 5e3,
      group: null,
      pos: "top-center",
      onClose: function () {},
    }),
    (t.notify = s),
    (t.notify.message = n),
    (t.notify.closeAll = o),
    s
  );
});
