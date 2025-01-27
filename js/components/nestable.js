!(function (t) {
  var s;
  window.UIkit && (s = t(UIkit)),
    "function" == typeof define &&
      define.amd &&
      define("uikit-nestable", ["uikit"], function () {
        return s || t(UIkit);
      });
})(function (t) {
  "use strict";
  var s,
    e = "ontouchstart" in window,
    i = t.$html,
    l = [],
    a = t.$win,
    n = e ? "touchstart" : "mousedown",
    o = e ? "touchmove" : "mousemove",
    h = e ? "touchend" : "mouseup",
    r = e ? "touchcancel" : "mouseup";
  return (
    t.component("nestable", {
      defaults: {
        listBaseClass: "uk-nestable",
        listClass: "uk-nestable-list",
        listItemClass: "uk-nestable-item",
        dragClass: "uk-nestable-dragged",
        movingClass: "uk-nestable-moving",
        noChildrenClass: "uk-nestable-nochildren",
        emptyClass: "uk-nestable-empty",
        handleClass: "",
        collapsedClass: "uk-collapsed",
        placeholderClass: "uk-nestable-placeholder",
        noDragClass: "uk-nestable-nodrag",
        group: !1,
        maxDepth: 10,
        threshold: 20,
        idlethreshold: 10,
      },
      boot: function () {
        t.$html.on("mousemove touchmove", function (e) {
          if (s) {
            var i = s.offset().top;
            i < t.$win.scrollTop()
              ? t.$win.scrollTop(t.$win.scrollTop() - Math.ceil(s.height() / 2))
              : i + s.height() > window.innerHeight + t.$win.scrollTop() &&
                t.$win.scrollTop(
                  t.$win.scrollTop() + Math.ceil(s.height() / 2)
                );
          }
        }),
          t.ready(function (s) {
            t.$("[data-uk-nestable]", s).each(function () {
              var s = t.$(this);
              s.data("nestable") ||
                t.nestable(s, t.Utils.options(s.attr("data-uk-nestable")));
            });
          });
      },
      init: function () {
        var i = this;
        Object.keys(this.options).forEach(function (t) {
          -1 != String(t).indexOf("Class") &&
            (i.options["_" + t] = "." + i.options[t]);
        }),
          this.find(this.options._listItemClass)
            .find(">ul")
            .addClass(this.options.listClass),
          this.checkEmptyList(),
          this.reset(),
          this.element.data(
            "nestable-group",
            this.options.group || t.Utils.uid("nestable-group")
          ),
          this.find(this.options._listItemClass).each(function () {
            i.setParent(t.$(this));
          }),
          this.on("click", "[data-nestable-action]", function (s) {
            if (!i.dragEl && (e || 0 === s.button)) {
              s.preventDefault();
              var l = t.$(s.currentTarget),
                a = l.data("nestableAction"),
                n = l.closest(i.options._listItemClass);
              "collapse" === a && i.collapseItem(n),
                "expand" === a && i.expandItem(n),
                "toggle" === a && i.toggleItem(n);
            }
          });
        var l = function (s) {
            var l = t.$(s.target);
            s.target !== i.element[0] &&
              (l.is(i.options._noDragClass) ||
                l.closest(i.options._noDragClass).length ||
                l.is("[data-nestable-action]") ||
                l.closest("[data-nestable-action]").length ||
                (i.options.handleClass &&
                  !l.hasClass(i.options.handleClass) &&
                  i.options.handleClass &&
                  (l = l.closest(i.options._handleClass)),
                !l.length ||
                  i.dragEl ||
                  (!e && 0 !== s.button) ||
                  (e && 1 !== s.touches.length) ||
                  (s.originalEvent &&
                    s.originalEvent.touches &&
                    (s = evt.originalEvent.touches[0]),
                  (i.delayMove = function (t) {
                    t.preventDefault(),
                      i.dragStart(s),
                      i.trigger("start.uk.nestable", [i]),
                      (i.delayMove = !1);
                  }),
                  (i.delayMove.x = parseInt(s.pageX, 10)),
                  (i.delayMove.y = parseInt(s.pageY, 10)),
                  (i.delayMove.threshold = i.options.idlethreshold),
                  s.preventDefault())));
          },
          d = function (t) {
            t.originalEvent &&
              t.originalEvent.touches &&
              (t = t.originalEvent.touches[0]),
              i.delayMove &&
                (Math.abs(t.pageX - i.delayMove.x) > i.delayMove.threshold ||
                  Math.abs(t.pageY - i.delayMove.y) > i.delayMove.threshold) &&
                (window.getSelection().toString()
                  ? (i.delayMove = !1)
                  : i.delayMove(t)),
              i.dragEl &&
                (t.preventDefault(),
                i.dragMove(t),
                i.trigger("move.uk.nestable", [i]));
          },
          p = function (t) {
            i.dragEl && (t.preventDefault(), i.dragStop(e ? t.touches[0] : t)),
              (s = !1),
              (i.delayMove = !1);
          };
        e
          ? (this.element[0].addEventListener(n, l, !1),
            window.addEventListener(o, d, !1),
            window.addEventListener(h, p, !1),
            window.addEventListener(r, p, !1))
          : (this.on(n, l), a.on(o, d), a.on(h, p));
      },
      serialize: function () {
        var s,
          e = 0,
          i = this,
          l = function (s, e) {
            var a = [],
              n = s.children(i.options._listItemClass);
            return (
              n.each(function () {
                for (
                  var s,
                    n,
                    o,
                    h = t.$(this),
                    r = {},
                    d = h.children(i.options._listClass),
                    p = 0;
                  p < h[0].attributes.length;
                  p++
                )
                  (s = h[0].attributes[p]),
                    0 === s.name.indexOf("data-") &&
                      ((n = s.name.substr(5)),
                      (o = t.Utils.str2json(s.value)),
                      (r[n] =
                        o || "false" == s.value || "0" == s.value
                          ? o
                          : s.value));
                d.length && (r.children = l(d, e + 1)), a.push(r);
              }),
              a
            );
          };
        return (s = l(i.element, e));
      },
      list: function (s) {
        var e = [],
          i = this,
          l = 0,
          a = function (i, l, n) {
            var o = i.children(s._listItemClass);
            o.each(function (i) {
              var o = t.$(this),
                h = t.$.extend(
                  { parent_id: n ? n : null, depth: l, order: i },
                  o.data()
                ),
                r = o.children(s._listClass);
              e.push(h), r.length && a(r, l + 1, o.data(s.idProperty || "id"));
            });
          };
        return (s = t.$.extend({}, i.options, s)), a(i.element, l), e;
      },
      reset: function () {
        (this.mouse = {
          offsetX: 0,
          offsetY: 0,
          startX: 0,
          startY: 0,
          lastX: 0,
          lastY: 0,
          nowX: 0,
          nowY: 0,
          distX: 0,
          distY: 0,
          dirAx: 0,
          dirX: 0,
          dirY: 0,
          lastDirX: 0,
          lastDirY: 0,
          distAxX: 0,
          distAxY: 0,
        }),
          (this.moving = !1),
          (this.dragEl = null),
          (this.dragRootEl = null),
          (this.dragDepth = 0),
          (this.hasNewRoot = !1),
          (this.pointEl = null);
        for (var t = 0; t < l.length; t++) this.checkEmptyList(l[t]);
        l = [];
      },
      toggleItem: function (t) {
        this[
          t.hasClass(this.options.collapsedClass)
            ? "expandItem"
            : "collapseItem"
        ](t);
      },
      expandItem: function (t) {
        t.removeClass(this.options.collapsedClass);
      },
      collapseItem: function (t) {
        var s = t.children(this.options._listClass);
        s.length && t.addClass(this.options.collapsedClass);
      },
      expandAll: function () {
        var s = this;
        this.find(s.options._listItemClass).each(function () {
          s.expandItem(t.$(this));
        });
      },
      collapseAll: function () {
        var s = this;
        this.find(s.options._listItemClass).each(function () {
          s.collapseItem(t.$(this));
        });
      },
      setParent: function (t) {
        t.children(this.options._listClass).length && t.addClass("uk-parent");
      },
      unsetParent: function (t) {
        t.removeClass("uk-parent " + this.options.collapsedClass),
          t.children(this.options._listClass).remove();
      },
      dragStart: function (e) {
        var l = this.mouse,
          a = t.$(e.target),
          n = a.closest(this.options._listItemClass),
          o = n.offset();
        (this.placeEl = n),
          (l.offsetX = e.pageX - o.left),
          (l.offsetY = e.pageY - o.top),
          (l.startX = l.lastX = o.left),
          (l.startY = l.lastY = o.top),
          (this.dragRootEl = this.element),
          (this.dragEl = t
            .$("<ul></ul>")
            .addClass(this.options.listClass + " " + this.options.dragClass)
            .append(n.clone())),
          this.dragEl.css("width", n.width()),
          this.placeEl.addClass(this.options.placeholderClass),
          (s = this.dragEl),
          (this.tmpDragOnSiblings = [n[0].previousSibling, n[0].nextSibling]),
          t.$body.append(this.dragEl),
          this.dragEl.css({ left: o.left, top: o.top });
        var h,
          r,
          d = this.dragEl.find(this.options._listItemClass);
        for (h = 0; h < d.length; h++)
          (r = t
            .$(d[h])
            .parents(
              this.options._listClass + "," + this.options._listBaseClass
            ).length),
            r > this.dragDepth && (this.dragDepth = r);
        i.addClass(this.options.movingClass);
      },
      dragStop: function (s) {
        var e = t.$(this.placeEl),
          l = this.placeEl.parents(this.options._listBaseClass + ":first");
        this.placeEl.removeClass(this.options.placeholderClass),
          this.dragEl.remove(),
          this.element[0] !== l[0]
            ? (l.trigger("change.uk.nestable", [
                l.data("nestable"),
                e,
                "added",
              ]),
              this.element.trigger("change.uk.nestable", [this, e, "removed"]))
            : this.element.trigger("change.uk.nestable", [this, e, "moved"]),
          this.trigger("stop.uk.nestable", [this, e]),
          this.reset(),
          i.removeClass(this.options.movingClass);
      },
      dragMove: function (s) {
        var e,
          i,
          a,
          n,
          o,
          h = this.options,
          r = this.mouse,
          d = this.dragRootEl
            ? this.dragRootEl.data("nestable").options.maxDepth
            : h.maxDepth;
        this.dragEl.css({
          left: s.pageX - r.offsetX,
          top: s.pageY - r.offsetY,
        }),
          (r.lastX = r.nowX),
          (r.lastY = r.nowY),
          (r.nowX = s.pageX),
          (r.nowY = s.pageY),
          (r.distX = r.nowX - r.lastX),
          (r.distY = r.nowY - r.lastY),
          (r.lastDirX = r.dirX),
          (r.lastDirY = r.dirY),
          (r.dirX = 0 === r.distX ? 0 : r.distX > 0 ? 1 : -1),
          (r.dirY = 0 === r.distY ? 0 : r.distY > 0 ? 1 : -1);
        var p = Math.abs(r.distX) > Math.abs(r.distY) ? 1 : 0;
        if (!r.moving) return (r.dirAx = p), void (r.moving = !0);
        if (
          (r.dirAx !== p
            ? ((r.distAxX = 0), (r.distAxY = 0))
            : ((r.distAxX += Math.abs(r.distX)),
              0 !== r.dirX && r.dirX !== r.lastDirX && (r.distAxX = 0),
              (r.distAxY += Math.abs(r.distY)),
              0 !== r.dirY && r.dirY !== r.lastDirY && (r.distAxY = 0)),
          (r.dirAx = p),
          r.dirAx &&
            r.distAxX >= h.threshold &&
            ((r.distAxX = 0),
            (a = this.placeEl.prev("li")),
            r.distX > 0 &&
              a.length &&
              !a.hasClass(h.collapsedClass) &&
              !a.hasClass(h.noChildrenClass) &&
              ((e = a.find(h._listClass).last()),
              (o = this.placeEl.parents(
                h._listClass + "," + h._listBaseClass
              ).length),
              o + this.dragDepth <= d &&
                (e.length
                  ? ((e = a.children(h._listClass).last()),
                    e.append(this.placeEl))
                  : ((e = t.$("<ul/>").addClass(h.listClass)),
                    e.append(this.placeEl),
                    a.append(e),
                    this.setParent(a)))),
            r.distX < 0 &&
              ((n = this.placeEl.next(h._listItemClass)), !n.length)))
        ) {
          var c = this.placeEl.closest(
              [h._listBaseClass, h._listClass].join(",")
            ),
            g = c.closest(h._listItemClass);
          g.length &&
            (g.after(this.placeEl), c.children().length || this.unsetParent(g));
        }
        var u = !1,
          f = s.pageX - (window.pageXOffset || document.scrollLeft || 0),
          m =
            s.pageY -
            (window.pageYOffset || document.documentElement.scrollTop);
        if (
          ((this.pointEl = t.$(document.elementFromPoint(f, m))),
          h.handleClass && this.pointEl.hasClass(h.handleClass))
        )
          this.pointEl = this.pointEl.closest(h._listItemClass);
        else {
          var C = this.pointEl.closest(h._listItemClass);
          C.length && (this.pointEl = C);
        }
        if (!this.placeEl.find(this.pointEl).length) {
          if (this.pointEl.data("nestable") && !this.pointEl.children().length)
            (u = !0), this.checkEmptyList(this.pointEl);
          else if (
            !this.pointEl.length ||
            !this.pointEl.hasClass(h.listItemClass)
          )
            return;
          var v = this.element,
            E = this.pointEl.closest(this.options._listBaseClass),
            b = v[0] != E[0];
          if (!r.dirAx || b || u) {
            if (b && h.group !== E.data("nestable-group")) return;
            if (
              (l.push(v),
              (o =
                this.dragDepth -
                1 +
                this.pointEl.parents(h._listClass + "," + h._listBaseClass)
                  .length),
              o > d)
            )
              return;
            var X =
              s.pageY < this.pointEl.offset().top + this.pointEl.height() / 2;
            (i = this.placeEl.parent()),
              u
                ? this.pointEl.append(this.placeEl)
                : X
                ? this.pointEl.before(this.placeEl)
                : this.pointEl.after(this.placeEl),
              i.children().length ||
                i.data("nestable") ||
                this.unsetParent(i.parent()),
              this.checkEmptyList(this.dragRootEl),
              this.checkEmptyList(v),
              b &&
                ((this.dragRootEl = E),
                (this.hasNewRoot = this.element[0] !== this.dragRootEl[0]));
          }
        }
      },
      checkEmptyList: function (s) {
        (s = s ? t.$(s) : this.element),
          this.options.emptyClass &&
            s[s.children().length ? "removeClass" : "addClass"](
              this.options.emptyClass
            );
      },
    }),
    t.nestable
  );
});
