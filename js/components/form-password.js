!(function (t) {
  var i;
  window.UIkit && (i = t(UIkit)),
    "function" == typeof define &&
      define.amd &&
      define("uikit-form-password", ["uikit"], function () {
        return i || t(UIkit);
      });
})(function (t) {
  "use strict";
  return (
    t.component("formPassword", {
      defaults: { lblShow: "Show", lblHide: "Hide" },
      boot: function () {
        t.$html.on(
          "click.formpassword.uikit",
          "[data-uk-form-password]",
          function (i) {
            var e = t.$(this);
            e.data("formPassword") ||
              (i.preventDefault(),
              t.formPassword(
                e,
                t.Utils.options(e.attr("data-uk-form-password"))
              ),
              e.trigger("click"));
          }
        );
      },
      init: function () {
        var t = this;
        this.on("click", function (i) {
          if ((i.preventDefault(), t.input.length)) {
            var e = t.input.attr("type");
            t.input.attr("type", "text" == e ? "password" : "text"),
              t.element.html(t.options["text" == e ? "lblShow" : "lblHide"]);
          }
        }),
          (this.input = this.element.next("input").length
            ? this.element.next("input")
            : this.element.prev("input")),
          this.element.html(
            this.options[
              this.input.is("[type='password']") ? "lblShow" : "lblHide"
            ]
          ),
          this.element.data("formPassword", this);
      },
    }),
    t.formPassword
  );
});
