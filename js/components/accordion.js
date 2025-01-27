!(function (t) {
  var i;
  window.UIkit && (i = t(UIkit)),
    "function" == typeof define &&
      define.amd &&
      define("uikit-accordion", ["uikit"], function () {
        return i || t(UIkit);
      });
})(function (t) {
  "use strict";
  function i(i) {
    var o = t.$(i),
      e = "auto";
    if (o.is(":visible")) e = o.outerHeight();
    else {
      var a = {
        position: o.css("position"),
        visibility: o.css("visibility"),
        display: o.css("display"),
      };
      (e = o
        .css({ position: "absolute", visibility: "hidden", display: "block" })
        .outerHeight()),
        o.css(a);
    }
    return e;
  }
  return (
    t.component("accordion", {
      defaults: {
        showfirst: !0,
        collapse: !0,
        animate: !0,
        easing: "swing",
        duration: 300,
        toggle: ".uk-accordion-title",
        containers: ".uk-accordion-content",
        clsactive: "uk-active",
      },
      boot: function () {
        t.ready(function (i) {
          setTimeout(function () {
            t.$("[data-uk-accordion]", i).each(function () {
              var i = t.$(this);
              i.data("accordion") ||
                t.accordion(i, t.Utils.options(i.attr("data-uk-accordion")));
            });
          }, 0);
        });
      },
      init: function () {
        var i = this;
        this.element.on(
          "click.uk.accordion",
          this.options.toggle,
          function (o) {
            o.preventDefault(),
              i.toggleItem(
                t.$(this).data("wrapper"),
                i.options.animate,
                i.options.collapse
              );
          }
        ),
          this.update(),
          this.options.showfirst &&
            this.toggleItem(this.toggle.eq(0).data("wrapper"), !1, !1);
      },
      toggleItem: function (o, e, a) {
        var n = this;
        o.data("toggle").toggleClass(this.options.clsactive),
          o.data("content").toggleClass(this.options.clsactive);
        var s = o.data("toggle").hasClass(this.options.clsactive);
        a &&
          (this.toggle
            .not(o.data("toggle"))
            .removeClass(this.options.clsactive),
          this.content
            .not(o.data("content"))
            .removeClass(this.options.clsactive)
            .parent()
            .stop()
            .css("overflow", "hidden")
            .animate(
              { height: 0 },
              {
                easing: this.options.easing,
                duration: e ? this.options.duration : 0,
              }
            )
            .attr("aria-expanded", "false")),
          o.stop().css("overflow", "hidden"),
          e
            ? o.animate(
                { height: s ? i(o.data("content")) : 0 },
                {
                  easing: this.options.easing,
                  duration: this.options.duration,
                  complete: function () {
                    s &&
                      (o.css({ overflow: "", height: "auto" }),
                      t.Utils.checkDisplay(o.data("content"))),
                      n.trigger("display.uk.check");
                  },
                }
              )
            : (o.height(s ? "auto" : 0),
              s &&
                (o.css({ overflow: "" }),
                t.Utils.checkDisplay(o.data("content"))),
              this.trigger("display.uk.check")),
          o.attr("aria-expanded", s),
          this.element.trigger("toggle.uk.accordion", [
            s,
            o.data("toggle"),
            o.data("content"),
          ]);
      },
      update: function () {
        var i,
          o,
          e,
          a = this;
        (this.toggle = this.find(this.options.toggle)),
          (this.content = this.find(this.options.containers)),
          this.content.each(function (n) {
            (i = t.$(this)),
              i.parent().data("wrapper")
                ? (o = i.parent())
                : ((o = t
                    .$(this)
                    .wrap(
                      '<div data-wrapper="true" style="overflow:hidden;height:0;position:relative;"></div>'
                    )
                    .parent()),
                  o.attr("aria-expanded", "false")),
              (e = a.toggle.eq(n)),
              o.data("toggle", e),
              o.data("content", i),
              e.data("wrapper", o),
              i.data("wrapper", o);
          }),
          this.element.trigger("update.uk.accordion", [this]);
      },
    }),
    t.accordion
  );
});
