!(function (t) {
  var e;
  window.UIkit && (e = t(UIkit)),
    "function" == typeof define &&
      define.amd &&
      define("uikit-form-select", ["uikit"], function () {
        return e || t(UIkit);
      });
})(function (t) {
  "use strict";
  return (
    t.component("formSelect", {
      defaults: { target: ">span:first", activeClass: "uk-active" },
      boot: function () {
        t.ready(function (e) {
          t.$("[data-uk-form-select]", e).each(function () {
            var e = t.$(this);
            e.data("formSelect") ||
              t.formSelect(e, t.Utils.options(e.attr("data-uk-form-select")));
          });
        });
      },
      init: function () {
        var t = this;
        (this.target = this.find(this.options.target)),
          (this.select = this.find("select")),
          this.select.on(
            "change",
            (function () {
              var e = t.select[0],
                i = function () {
                  try {
                    "input" === t.options.target
                      ? t.target.val(e.options[e.selectedIndex].text)
                      : t.target.text(e.options[e.selectedIndex].text);
                  } catch (n) {}
                  return (
                    t.element[t.select.val() ? "addClass" : "removeClass"](
                      t.options.activeClass
                    ),
                    i
                  );
                };
              return i();
            })()
          ),
          this.element.data("formSelect", this);
      },
    }),
    t.formSelect
  );
});
