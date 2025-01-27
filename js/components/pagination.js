!(function (t) {
  var e;
  window.UIkit && (e = t(UIkit)),
    "function" == typeof define &&
      define.amd &&
      define("uikit-pagination", ["uikit"], function () {
        return e || t(UIkit);
      });
})(function (t) {
  "use strict";
  return (
    t.component("pagination", {
      defaults: {
        items: 1,
        itemsOnPage: 1,
        pages: 0,
        displayedPages: 7,
        edges: 1,
        currentPage: 0,
        lblPrev: !1,
        lblNext: !1,
        onSelectPage: function () {},
      },
      boot: function () {
        t.ready(function (e) {
          t.$("[data-uk-pagination]", e).each(function () {
            var e = t.$(this);
            e.data("pagination") ||
              t.pagination(e, t.Utils.options(e.attr("data-uk-pagination")));
          });
        });
      },
      init: function () {
        var e = this;
        (this.pages = this.options.pages
          ? this.options.pages
          : Math.ceil(this.options.items / this.options.itemsOnPage)
          ? Math.ceil(this.options.items / this.options.itemsOnPage)
          : 1),
          (this.currentPage = this.options.currentPage),
          (this.halfDisplayed = this.options.displayedPages / 2),
          this.on("click", "a[data-page]", function (i) {
            i.preventDefault(), e.selectPage(t.$(this).data("page"));
          }),
          this._render();
      },
      _getInterval: function () {
        return {
          start: Math.ceil(
            this.currentPage > this.halfDisplayed
              ? Math.max(
                  Math.min(
                    this.currentPage - this.halfDisplayed,
                    this.pages - this.options.displayedPages
                  ),
                  0
                )
              : 0
          ),
          end: Math.ceil(
            this.currentPage > this.halfDisplayed
              ? Math.min(this.currentPage + this.halfDisplayed, this.pages)
              : Math.min(this.options.displayedPages, this.pages)
          ),
        };
      },
      render: function (t) {
        (this.pages = t ? t : this.pages), this._render();
      },
      selectPage: function (t, e) {
        (this.currentPage = t),
          this.render(e),
          this.options.onSelectPage.apply(this, [t]),
          this.trigger("select.uk.pagination", [t, this]);
      },
      _render: function () {
        var t,
          e = this.options,
          i = this._getInterval();
        if (
          (this.element.empty(),
          e.lblPrev && this._append(this.currentPage - 1, { text: e.lblPrev }),
          i.start > 0 && e.edges > 0)
        ) {
          var s = Math.min(e.edges, i.start);
          for (t = 0; s > t; t++) this._append(t);
          e.edges < i.start && i.start - e.edges != 1
            ? this.element.append("<li><span>...</span></li>")
            : i.start - e.edges == 1 && this._append(e.edges);
        }
        for (t = i.start; t < i.end; t++) this._append(t);
        if (i.end < this.pages && e.edges > 0) {
          this.pages - e.edges > i.end && this.pages - e.edges - i.end != 1
            ? this.element.append("<li><span>...</span></li>")
            : this.pages - e.edges - i.end == 1 && this._append(i.end++);
          var a = Math.max(this.pages - e.edges, i.end);
          for (t = a; t < this.pages; t++) this._append(t);
        }
        e.lblNext && this._append(this.currentPage + 1, { text: e.lblNext });
      },
      _append: function (e, i) {
        var s, a;
        (e = 0 > e ? 0 : e < this.pages ? e : this.pages - 1),
          (a = t.$.extend({ text: e + 1 }, i)),
          (s =
            e == this.currentPage
              ? '<li class="uk-active"><span>' + a.text + "</span></li>"
              : '<li><a href="#page-' +
                (e + 1) +
                '" data-page="' +
                e +
                '">' +
                a.text +
                "</a></li>"),
          this.element.append(s);
      },
    }),
    t.pagination
  );
});
