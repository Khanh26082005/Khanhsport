!(function (t) {
  var e;
  window.UIkit && (e = t(UIkit)),
    "function" == typeof define &&
      define.amd &&
      define("uikit-sortable", ["uikit"], function () {
        return e || t(UIkit);
      });
})(function (t) {
  "use strict";
  function e(e) {
    e = t.$(e);
    do {
      if (e.data("sortable")) return e;
      e = t.$(e).parent();
    } while (e.length);
    return e;
  }
  function o(t, e) {
    var o = t.parentNode;
    if (e.parentNode != o) return !1;
    for (var a = t.previousSibling; a && 9 !== a.nodeType; ) {
      if (a === e) return !0;
      a = a.previousSibling;
    }
    return !1;
  }
  function a(t, e) {
    var o = e;
    if (o == t) return null;
    for (; o; ) {
      if (o.parentNode === t) return o;
      if (((o = o.parentNode), !o || !o.ownerDocument || 11 === o.nodeType))
        break;
    }
    return null;
  }
  function s(t) {
    t.stopPropagation && t.stopPropagation(),
      t.preventDefault && t.preventDefault(),
      (t.returnValue = !1);
  }
  var n,
    r,
    i,
    l,
    d,
    h,
    u,
    p,
    c,
    g,
    f =
      "ontouchstart" in window ||
      (window.DocumentTouch && document instanceof DocumentTouch);
  return (
    t.component("sortable", {
      defaults: {
        animation: 150,
        threshold: 10,
        childClass: "uk-sortable-item",
        placeholderClass: "uk-sortable-placeholder",
        overClass: "uk-sortable-over",
        draggingClass: "uk-sortable-dragged",
        dragMovingClass: "uk-sortable-moving",
        baseClass: "uk-sortable",
        noDragClass: "uk-sortable-nodrag",
        emptyClass: "uk-sortable-empty",
        dragCustomClass: "",
        handleClass: !1,
        group: !1,
        stop: function () {},
        start: function () {},
        change: function () {},
      },
      boot: function () {
        t.ready(function (e) {
          t.$("[data-uk-sortable]", e).each(function () {
            var e = t.$(this);
            e.data("sortable") ||
              t.sortable(e, t.Utils.options(e.attr("data-uk-sortable")));
          });
        }),
          t.$html.on("mousemove touchmove", function (e) {
            if (u) {
              var o = e.originalEvent.targetTouches
                ? e.originalEvent.targetTouches[0]
                : e;
              (Math.abs(o.pageX - u.pos.x) > u.threshold ||
                Math.abs(o.pageY - u.pos.y) > u.threshold) &&
                u.apply(o);
            }
            if (n) {
              d ||
                ((d = !0),
                n.show(),
                n.$current.addClass(n.$sortable.options.placeholderClass),
                n.$sortable.element
                  .children()
                  .addClass(n.$sortable.options.childClass),
                t.$html.addClass(n.$sortable.options.dragMovingClass));
              var a = n.data("mouse-offset"),
                s = parseInt(e.originalEvent.pageX, 10) + a.left,
                r = parseInt(e.originalEvent.pageY, 10) + a.top;
              if (
                (n.css({ left: s, top: r }),
                r + n.height() / 3 > document.body.offsetHeight)
              )
                return;
              r < t.$win.scrollTop()
                ? t.$win.scrollTop(
                    t.$win.scrollTop() - Math.ceil(n.height() / 3)
                  )
                : r + n.height() / 3 >
                    window.innerHeight + t.$win.scrollTop() &&
                  t.$win.scrollTop(
                    t.$win.scrollTop() + Math.ceil(n.height() / 3)
                  );
            }
          }),
          t.$html.on("mouseup touchend", function (t) {
            if (((u = h = !1), !r || !n)) return void (r = n = null);
            var o = e(r),
              a = n.$sortable,
              s = { type: t.type };
            o[0] && a.dragDrop(s, a.element), a.dragEnd(s, a.element);
          });
      },
      init: function () {
        function e() {
          f
            ? h.addEventListener("touchmove", b, !1)
            : (h.addEventListener("mouseover", m, !1),
              h.addEventListener("mouseout", v, !1));
        }
        function o() {
          f
            ? h.removeEventListener("touchmove", b, !1)
            : (h.removeEventListener("mouseover", m, !1),
              h.removeEventListener("mouseout", v, !1));
        }
        function n(t) {
          r && d.dragMove(t, d);
        }
        function l(e) {
          return function (o) {
            var s, n, r;
            o &&
              ((s = (f && o.touches && o.touches[0]) || {}),
              (n = s.target || o.target),
              f &&
                document.elementFromPoint &&
                (n = document.elementFromPoint(
                  o.pageX - document.body.scrollLeft,
                  o.pageY - document.body.scrollTop
                )),
              (g = t.$(n))),
              t.$(n).hasClass(d.options.childClass)
                ? e.apply(n, [o])
                : n !== h && ((r = a(h, n)), r && e.apply(r, [o]));
          };
        }
        var d = this,
          h = this.element[0];
        (p = []),
          this.checkEmptyList(),
          this.element.data(
            "sortable-group",
            this.options.group
              ? this.options.group
              : t.Utils.uid("sortable-group")
          );
        var u = l(function (e) {
            if (!e.data || !e.data.sortable) {
              var o = t.$(e.target),
                a = o.is("a[href]") ? o : o.parents("a[href]");
              if (!o.is(":input")) {
                if (d.options.handleClass) {
                  var s = o.hasClass(d.options.handleClass)
                    ? o
                    : o.closest("." + d.options.handleClass, d.element);
                  if (!s.length) return;
                }
                return (
                  e.preventDefault(),
                  !f &&
                    a.length &&
                    a
                      .one("click", function (t) {
                        t.preventDefault();
                      })
                      .one("mouseup", function () {
                        c || a.trigger("click");
                      }),
                  (e.data = e.data || {}),
                  (e.data.sortable = h),
                  d.dragStart(e, this)
                );
              }
            }
          }),
          m = l(
            t.Utils.debounce(function (t) {
              return d.dragEnter(t, this);
            }),
            40
          ),
          v = l(function (e) {
            var o = d.dragenterData(this);
            d.dragenterData(this, o - 1),
              d.dragenterData(this) ||
                (t.$(this).removeClass(d.options.overClass),
                d.dragenterData(this, !1));
          }),
          b = l(function (t) {
            return r && r !== this && i !== this
              ? (d.element.children().removeClass(d.options.overClass),
                (i = this),
                d.moveElementNextTo(r, this),
                s(t))
              : !0;
          });
        (this.addDragHandlers = e),
          (this.removeDragHandlers = o),
          window.addEventListener(f ? "touchmove" : "mousemove", n, !1),
          h.addEventListener(f ? "touchstart" : "mousedown", u, !1);
      },
      dragStart: function (e, o) {
        (c = !1), (d = !1), (l = !1);
        var a = this,
          s = t.$(e.target);
        if (
          (f || 2 != e.button) &&
          !s.is("." + a.options.noDragClass) &&
          !s.closest("." + a.options.noDragClass).length &&
          !s.is(":input")
        ) {
          (r = o), n && n.remove();
          var i = t.$(r),
            h = i.offset();
          u = {
            pos: { x: e.pageX, y: e.pageY },
            threshold: a.options.handleClass ? 0 : a.options.threshold,
            apply: function (e) {
              (n = t
                .$(
                  '<div class="' +
                    [a.options.draggingClass, a.options.dragCustomClass].join(
                      " "
                    ) +
                    '"></div>'
                )
                .css({
                  display: "none",
                  top: h.top,
                  left: h.left,
                  width: i.width(),
                  height: i.height(),
                  padding: i.css("padding"),
                })
                .data({
                  "mouse-offset": {
                    left: h.left - parseInt(e.pageX, 10),
                    top: h.top - parseInt(e.pageY, 10),
                  },
                  origin: a.element,
                  index: i.index(),
                })
                .append(i.html())
                .appendTo("body")),
                (n.$current = i),
                (n.$sortable = a),
                i.data({
                  "start-list": i.parent(),
                  "start-index": i.index(),
                  "sortable-group": a.options.group,
                }),
                a.addDragHandlers(),
                a.options.start(this, r),
                a.trigger("start.uk.sortable", [a, r]),
                (c = !0),
                (u = !1);
            },
          };
        }
      },
      dragMove: function (e, o) {
        g = t.$(
          document.elementFromPoint(
            e.pageX - (document.body.scrollLeft || document.scrollLeft || 0),
            e.pageY -
              (document.body.scrollTop ||
                document.documentElement.scrollTop ||
                0)
          )
        );
        var a,
          s = g.closest("." + this.options.baseClass),
          n = s.data("sortable-group"),
          i = t.$(r),
          l = i.parent(),
          d = i.data("sortable-group");
        s[0] !== l[0] &&
          void 0 !== d &&
          n === d &&
          (s.data("sortable").addDragHandlers(),
          p.push(s),
          s.children().addClass(this.options.childClass),
          s.children().length > 0
            ? ((a = g.closest("." + this.options.childClass)),
              a.length ? a.before(i) : s.append(i))
            : g.append(i),
          UIkit.$doc.trigger("mouseover")),
          this.checkEmptyList(),
          this.checkEmptyList(l);
      },
      dragEnter: function (e, o) {
        if (!r || r === o) return !0;
        var a = this.dragenterData(o);
        if ((this.dragenterData(o, a + 1), 0 === a)) {
          var s = t.$(o).parent(),
            n = t.$(r).data("start-list");
          if (s[0] !== n[0]) {
            var i = s.data("sortable-group"),
              l = t.$(r).data("sortable-group");
            if ((i || l) && i != l) return !1;
          }
          t.$(o).addClass(this.options.overClass), this.moveElementNextTo(r, o);
        }
        return !1;
      },
      dragEnd: function (e, o) {
        var a = this;
        r && (this.options.stop(o), this.trigger("stop.uk.sortable", [this])),
          (r = null),
          (i = null),
          p.push(this.element),
          p.forEach(function (e, o) {
            t.$(e)
              .children()
              .each(function () {
                1 === this.nodeType &&
                  (t
                    .$(this)
                    .removeClass(a.options.overClass)
                    .removeClass(a.options.placeholderClass)
                    .removeClass(a.options.childClass),
                  a.dragenterData(this, !1));
              });
          }),
          (p = []),
          t.$html.removeClass(this.options.dragMovingClass),
          this.removeDragHandlers(),
          n && (n.remove(), (n = null));
      },
      dragDrop: function (t, e) {
        "drop" === t.type &&
          (t.stopPropagation && t.stopPropagation(),
          t.preventDefault && t.preventDefault()),
          this.triggerChangeEvents();
      },
      triggerChangeEvents: function () {
        if (r) {
          var e = t.$(r),
            o = n.data("origin"),
            a = e.closest("." + this.options.baseClass),
            s = [],
            i = t.$(r);
          o[0] === a[0] && n.data("index") != e.index()
            ? s.push({ sortable: this, mode: "moved" })
            : o[0] != a[0] &&
              s.push(
                { sortable: t.$(a).data("sortable"), mode: "added" },
                { sortable: t.$(o).data("sortable"), mode: "removed" }
              ),
            s.forEach(function (t, e) {
              t.sortable &&
                t.sortable.element.trigger("change.uk.sortable", [
                  t.sortable,
                  i,
                  t.mode,
                ]);
            });
        }
      },
      dragenterData: function (e, o) {
        return (
          (e = t.$(e)),
          1 == arguments.length
            ? parseInt(e.data("child-dragenter"), 10) || 0
            : void (o
                ? e.data("child-dragenter", Math.max(0, o))
                : e.removeData("child-dragenter"))
        );
      },
      moveElementNextTo: function (e, a) {
        l = !0;
        var s = this,
          n = t.$(e).parent().css("min-height", ""),
          r = o(e, a) ? a : a.nextSibling,
          i = n.children(),
          d = i.length;
        return s.options.animation
          ? (n.css("min-height", n.height()),
            i.stop().each(function () {
              var e = t.$(this),
                o = e.position();
              (o.width = e.width()), e.data("offset-before", o);
            }),
            a.parentNode.insertBefore(e, r),
            t.Utils.checkDisplay(s.element.parent()),
            (i = n
              .children()
              .each(function () {
                var e = t.$(this);
                e.data("offset-after", e.position());
              })
              .each(function () {
                var e = t.$(this),
                  o = e.data("offset-before");
                e.css({
                  position: "absolute",
                  top: o.top,
                  left: o.left,
                  "min-width": o.width,
                });
              })),
            void i.each(function () {
              var e = t.$(this),
                o = (e.data("offset-before"), e.data("offset-after"));
              e.css("pointer-events", "none").width(),
                setTimeout(function () {
                  e.animate(
                    { top: o.top, left: o.left },
                    s.options.animation,
                    function () {
                      e
                        .css({
                          position: "",
                          top: "",
                          left: "",
                          "min-width": "",
                          "pointer-events": "",
                        })
                        .removeClass(s.options.overClass)
                        .removeData("child-dragenter"),
                        d--,
                        d ||
                          (n.css("min-height", ""),
                          t.Utils.checkDisplay(s.element.parent()));
                    }
                  );
                }, 0);
            }))
          : (a.parentNode.insertBefore(e, r),
            void t.Utils.checkDisplay(s.element.parent()));
      },
      serialize: function () {
        var e,
          o,
          a = [];
        return (
          this.element.children().each(function (s, n) {
            e = {};
            for (var r, i, l = 0; l < n.attributes.length; l++)
              (o = n.attributes[l]),
                0 === o.name.indexOf("data-") &&
                  ((r = o.name.substr(5)),
                  (i = t.Utils.str2json(o.value)),
                  (e[r] =
                    i || "false" == o.value || "0" == o.value ? i : o.value));
            a.push(e);
          }),
          a
        );
      },
      checkEmptyList: function (e) {
        (e = e ? t.$(e) : this.element),
          this.options.emptyClass &&
            e[e.children().length ? "removeClass" : "addClass"](
              this.options.emptyClass
            );
      },
    }),
    t.sortable
  );
});
