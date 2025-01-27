!(function (t) {
  var e;
  window.UIkit && (e = t(UIkit)),
    "function" == typeof define &&
    define.amd &&
    define("uikit-timepicker", ["uikit"], function () {
      return e || t(UIkit);
    });
})(function (t) {
  "use strict";
  function e(t, e) {
    (t = t || 0), (e = e || 24);
    var i,
      o,
      a = { "12h": [], "24h": [] };
    for (i = t, o = ""; e > i; i++)
      (o = "" + i),
        10 > i && (o = "0" + o),
        a["24h"].push({ value: o + ":00" }),
        a["24h"].push({ value: o + ":30" }),
        0 === i &&
        ((o = 12),
          a["12h"].push({ value: o + ":00 AM" }),
          a["12h"].push({ value: o + ":30 AM" })),
        i > 0 &&
        13 > i &&
        12 !== i &&
        (a["12h"].push({ value: o + ":00 AM" }),
          a["12h"].push({ value: o + ":30 AM" })),
        i >= 12 &&
        ((o -= 12),
          0 === o && (o = 12),
          10 > o && (o = "0" + String(o)),
          a["12h"].push({ value: o + ":00 PM" }),
          a["12h"].push({ value: o + ":30 PM" }));
    return a;
  }
  t.component("timepicker", {
    defaults: { format: "24h", delay: 0, start: 0, end: 24 },
    boot: function () {
      t.$html.on(
        "focus.timepicker.uikit",
        "[data-uk-timepicker]",
        function (e) {
          var i = t.$(this);
          if (!i.data("timepicker")) {
            var o = t.timepicker(
              i,
              t.Utils.options(i.attr("data-uk-timepicker"))
            );
            setTimeout(function () {
              o.autocomplete.input.focus();
            }, 40);
          }
        }
      );
    },
    init: function () {
      var i,
        o = this,
        a = e(this.options.start, this.options.end);
      (this.options.minLength = 0),
        (this.options.template =
          '<ul class="uk-nav uk-nav-autocomplete uk-autocomplete-results">{{~items}}<li data-value="{{$item.value}}"><a>{{$item.value}}</a></li>{{/items}}</ul>'),
        (this.options.source = function (t) {
          t(a[o.options.format] || a["12h"]);
        }),
        this.element.is("input")
          ? (this.element.wrap('<div class="uk-autocomplete"></div>'),
            (i = this.element.parent()))
          : (i = this.element.addClass("uk-autocomplete")),
        (this.autocomplete = t.autocomplete(i, this.options)),
        this.autocomplete.dropdown.addClass(
          "uk-dropdown-small uk-dropdown-scrollable"
        ),
        this.autocomplete.on("show.uk.autocomplete", function () {
          var t = o.autocomplete.dropdown.find(
            '[data-value="' + o.autocomplete.input.val() + '"]'
          );
          setTimeout(function () {
            o.autocomplete.pick(t, !0);
          }, 10);
        }),
        this.autocomplete.input
          .on("focus", function () {
            (o.autocomplete.value = Math.random()),
              o.autocomplete.triggercomplete();
          })
          .on(
            "blur",
            t.Utils.debounce(function () {
              o.checkTime();
            }, 100)
          ),
        this.element.data("timepicker", this);
    },
    checkTime: function () {
      var t,
        e,
        i,
        o,
        a = "AM",
        u = this.autocomplete.input.val();
      "12h" == this.options.format
        ? ((t = u.split(" ")), (e = t[0].split(":")), (a = t[1]))
        : (e = u.split(":")),
        (i = parseInt(e[0], 10)),
        (o = parseInt(e[1], 10)),
        isNaN(i) && (i = 0),
        isNaN(o) && (o = 0),
        "12h" == this.options.format
          ? (i > 12 ? (i = 12) : 0 > i && (i = 12),
            "am" === a || "a" === a
              ? (a = "AM")
              : ("pm" === a || "p" === a) && (a = "PM"),
            "AM" !== a && "PM" !== a && (a = "AM"))
          : i >= 24
            ? (i = 23)
            : 0 > i && (i = 0),
        0 > o ? (o = 0) : o >= 60 && (o = 0),
        this.autocomplete.input.val(this.formatTime(i, o, a)).trigger("change");
    },
    formatTime: function (t, e, i) {
      return (
        (t = 10 > t ? "0" + t : t),
        (e = 10 > e ? "0" + e : e),
        t + ":" + e + ("12h" == this.options.format ? " " + i : "")
      );
    },
  });
});
