!(function (t) {
  var e;
  window.UIkit && (e = t(UIkit)),
    "function" == typeof define &&
      define.amd &&
      define("uikit-autocomplete", ["uikit"], function () {
        return e || t(UIkit);
      });
})(function (t) {
  "use strict";
  var e;
  return (
    t.component("autocomplete", {
      defaults: {
        minLength: 3,
        param: "search",
        method: "post",
        delay: 300,
        loadingClass: "uk-loading",
        flipDropdown: !1,
        skipClass: "uk-skip",
        hoverClass: "uk-active",
        source: null,
        renderer: null,
        template:
          '<ul class="uk-nav uk-nav-autocomplete uk-autocomplete-results">{{~items}}<li data-value="{{$item.value}}"><a>{{$item.value}}</a></li>{{/items}}</ul>',
      },
      visible: !1,
      value: null,
      selected: null,
      boot: function () {
        t.$html.on(
          "focus.autocomplete.uikit",
          "[data-uk-autocomplete]",
          function (e) {
            var i = t.$(this);
            i.data("autocomplete") ||
              t.autocomplete(
                i,
                t.Utils.options(i.attr("data-uk-autocomplete"))
              );
          }
        ),
          t.$html.on("click.autocomplete.uikit", function (t) {
            e && t.target != e.input[0] && e.hide();
          });
      },
      init: function () {
        var e = this,
          i = !1,
          s = t.Utils.debounce(function (t) {
            return i ? (i = !1) : void e.handle();
          }, this.options.delay);
        (this.dropdown = this.find(".uk-dropdown")),
          (this.template = this.find(
            'script[type="text/autocomplete"]'
          ).html()),
          (this.template = t.Utils.template(
            this.template || this.options.template
          )),
          (this.input = this.find("input:first").attr("autocomplete", "off")),
          this.dropdown.length ||
            (this.dropdown = t
              .$('<div class="uk-dropdown"></div>')
              .appendTo(this.element)),
          this.options.flipDropdown &&
            this.dropdown.addClass("uk-dropdown-flip"),
          this.dropdown.attr("aria-expanded", "false"),
          this.input.on({
            keydown: function (t) {
              if (t && t.which && !t.shiftKey)
                switch (t.which) {
                  case 13:
                    (i = !0), e.selected && (t.preventDefault(), e.select());
                    break;
                  case 38:
                    t.preventDefault(), e.pick("prev", !0);
                    break;
                  case 40:
                    t.preventDefault(), e.pick("next", !0);
                    break;
                  case 27:
                  case 9:
                    e.hide();
                }
            },
            keyup: s,
          }),
          this.dropdown.on(
            "click",
            ".uk-autocomplete-results > *",
            function () {
              e.select();
            }
          ),
          this.dropdown.on(
            "mouseover",
            ".uk-autocomplete-results > *",
            function () {
              e.pick(t.$(this));
            }
          ),
          (this.triggercomplete = s);
      },
      handle: function () {
        var t = this,
          e = this.value;
        return (
          (this.value = this.input.val()),
          this.value.length < this.options.minLength
            ? this.hide()
            : (this.value != e && t.request(), this)
        );
      },
      pick: function (e, i) {
        var s = this,
          o = t.$(
            this.dropdown
              .find(".uk-autocomplete-results")
              .children(":not(." + this.options.skipClass + ")")
          ),
          n = !1;
        if ("string" == typeof e || e.hasClass(this.options.skipClass)) {
          if ("next" == e || "prev" == e) {
            if (this.selected) {
              var a = o.index(this.selected);
              n =
                "next" == e
                  ? o.eq(a + 1 < o.length ? a + 1 : 0)
                  : o.eq(0 > a - 1 ? o.length - 1 : a - 1);
            } else n = o["next" == e ? "first" : "last"]();
            n = t.$(n);
          }
        } else n = e;
        if (
          n &&
          n.length &&
          ((this.selected = n),
          o.removeClass(this.options.hoverClass),
          this.selected.addClass(this.options.hoverClass),
          i)
        ) {
          var l = n.position().top,
            h = s.dropdown.scrollTop(),
            r = s.dropdown.height();
          (l > r || 0 > l) && s.dropdown.scrollTop(h + l);
        }
      },
      select: function () {
        if (this.selected) {
          var t = this.selected.data();
          this.trigger("selectitem.uk.autocomplete", [t, this]),
            t.value && this.input.val(t.value).trigger("change"),
            this.hide();
        }
      },
      show: function () {
        return this.visible
          ? void 0
          : ((this.visible = !0),
            this.element.addClass("uk-open"),
            e && e !== this && e.hide(),
            (e = this),
            this.dropdown.attr("aria-expanded", "true"),
            this);
      },
      hide: function () {
        return this.visible
          ? ((this.visible = !1),
            this.element.removeClass("uk-open"),
            e === this && (e = !1),
            this.dropdown.attr("aria-expanded", "false"),
            this)
          : void 0;
      },
      request: function () {
        var e = this,
          i = function (t) {
            t && e.render(t), e.element.removeClass(e.options.loadingClass);
          };
        if (
          (this.element.addClass(this.options.loadingClass),
          this.options.source)
        ) {
          var s = this.options.source;
          switch (typeof this.options.source) {
            case "function":
              this.options.source.apply(this, [i]);
              break;
            case "object":
              if (s.length) {
                var o = [];
                s.forEach(function (t) {
                  t.value &&
                    -1 !=
                      t.value.toLowerCase().indexOf(e.value.toLowerCase()) &&
                    o.push(t);
                }),
                  i(o);
              }
              break;
            case "string":
              var n = {};
              (n[this.options.param] = this.value),
                t.$.ajax({
                  url: this.options.source,
                  data: n,
                  type: this.options.method,
                  dataType: "json",
                }).done(function (t) {
                  i(t || []);
                });
              break;
            default:
              i(null);
          }
        } else this.element.removeClass(e.options.loadingClass);
      },
      render: function (t) {
        return (
          this.dropdown.empty(),
          (this.selected = !1),
          this.options.renderer
            ? this.options.renderer.apply(this, [t])
            : t &&
              t.length &&
              (this.dropdown.append(this.template({ items: t })),
              this.show(),
              this.trigger("show.uk.autocomplete")),
          this
        );
      },
    }),
    t.autocomplete
  );
});
