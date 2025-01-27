!(function (t) {
  var e;
  window.UIkit && (e = t(UIkit)),
    "function" == typeof define &&
      define.amd &&
      define("uikit-htmleditor", ["uikit"], function () {
        return e || t(UIkit);
      });
})(function (t) {
  "use strict";
  var e = [];
  return (
    t.component("htmleditor", {
      defaults: {
        iframe: !1,
        mode: "split",
        markdown: !1,
        autocomplete: !0,
        height: 500,
        maxsplitsize: 1e3,
        codemirror: {
          mode: "htmlmixed",
          lineWrapping: !0,
          dragDrop: !1,
          autoCloseTags: !0,
          matchTags: !0,
          autoCloseBrackets: !0,
          matchBrackets: !0,
          indentUnit: 4,
          indentWithTabs: !1,
          tabSize: 4,
          hintOptions: { completionSingle: !1 },
        },
        toolbar: [
          "bold",
          "italic",
          "strike",
          "link",
          "image",
          "blockquote",
          "listUl",
          "listOl",
        ],
        lblPreview: "Preview",
        lblCodeview: "HTML",
        lblMarkedview: "Markdown",
      },
      boot: function () {
        t.ready(function (e) {
          t.$("textarea[data-uk-htmleditor]", e).each(function () {
            var e = t.$(this);
            e.data("htmleditor") ||
              t.htmleditor(e, t.Utils.options(e.attr("data-uk-htmleditor")));
          });
        });
      },
      init: function () {
        var i = this,
          o = t.components.htmleditor.template;
        (this.CodeMirror = this.options.CodeMirror || CodeMirror),
          (this.buttons = {}),
          (o = o.replace(/\{:lblPreview}/g, this.options.lblPreview)),
          (o = o.replace(/\{:lblCodeview}/g, this.options.lblCodeview)),
          (this.htmleditor = t.$(o)),
          (this.content = this.htmleditor.find(".uk-htmleditor-content")),
          (this.toolbar = this.htmleditor.find(".uk-htmleditor-toolbar")),
          (this.preview = this.htmleditor
            .find(".uk-htmleditor-preview")
            .children()
            .eq(0)),
          (this.code = this.htmleditor.find(".uk-htmleditor-code")),
          this.element.before(this.htmleditor).appendTo(this.code),
          (this.editor = this.CodeMirror.fromTextArea(
            this.element[0],
            this.options.codemirror
          )),
          (this.editor.htmleditor = this),
          this.editor.on(
            "change",
            t.Utils.debounce(function () {
              i.render();
            }, 150)
          ),
          this.editor.on("change", function () {
            i.editor.save(), i.element.trigger("input");
          }),
          this.code.find(".CodeMirror").css("height", this.options.height),
          this.options.iframe
            ? ((this.iframe = t.$(
                '<iframe class="uk-htmleditor-iframe" frameborder="0" scrolling="auto" height="100" width="100%"></iframe>'
              )),
              this.preview.append(this.iframe),
              this.iframe[0].contentWindow.document.open(),
              this.iframe[0].contentWindow.document.close(),
              (this.preview.container = t
                .$(this.iframe[0].contentWindow.document)
                .find("body")),
              "string" == typeof this.options.iframe &&
                this.preview.container
                  .parent()
                  .append(
                    '<link rel="stylesheet" href="' + this.options.iframe + '">'
                  ))
            : (this.preview.container = this.preview),
          t.$win.on(
            "resize load",
            t.Utils.debounce(function () {
              i.fit();
            }, 200)
          );
        var r = this.iframe ? this.preview.container : i.preview.parent(),
          n = this.code.find(".CodeMirror-sizer"),
          l = this.code.find(".CodeMirror-scroll").on(
            "scroll",
            t.Utils.debounce(function () {
              if ("tab" != i.htmleditor.attr("data-mode")) {
                var t = n.height() - l.height(),
                  e =
                    r[0].scrollHeight -
                    (i.iframe ? i.iframe.height() : r.height()),
                  o = e / t,
                  s = l.scrollTop() * o;
                r.scrollTop(s);
              }
            }, 10)
          );
        this.htmleditor.on(
          "click",
          ".uk-htmleditor-button-code, .uk-htmleditor-button-preview",
          function (e) {
            e.preventDefault(),
              "tab" == i.htmleditor.attr("data-mode") &&
                (i.htmleditor
                  .find(
                    ".uk-htmleditor-button-code, .uk-htmleditor-button-preview"
                  )
                  .removeClass("uk-active")
                  .filter(this)
                  .addClass("uk-active"),
                (i.activetab = t.$(this).hasClass("uk-htmleditor-button-code")
                  ? "code"
                  : "preview"),
                i.htmleditor.attr("data-active-tab", i.activetab),
                i.editor.refresh());
          }
        ),
          this.htmleditor.on("click", "a[data-htmleditor-button]", function () {
            i.code.is(":visible") &&
              i.trigger("action." + t.$(this).data("htmleditor-button"), [
                i.editor,
              ]);
          }),
          this.preview.parent().css("height", this.code.height()),
          this.options.autocomplete &&
            this.CodeMirror.showHint &&
            this.CodeMirror.hint &&
            this.CodeMirror.hint.html &&
            this.editor.on(
              "inputRead",
              t.Utils.debounce(function () {
                var t = i.editor.getDoc(),
                  e = t.getCursor(),
                  o = i.CodeMirror.innerMode(
                    i.editor.getMode(),
                    i.editor.getTokenAt(e).state
                  ).mode.name;
                if ("xml" == o) {
                  var r = i.editor.getCursor(),
                    n = i.editor.getTokenAt(r);
                  ("<" == n.string.charAt(0) || "attribute" == n.type) &&
                    i.CodeMirror.showHint(i.editor, i.CodeMirror.hint.html, {
                      completeSingle: !1,
                    });
                }
              }, 100)
            ),
          (this.debouncedRedraw = t.Utils.debounce(function () {
            i.redraw();
          }, 5)),
          this.on("init.uk.component", function () {
            i.debouncedRedraw();
          }),
          this.element.attr("data-uk-check-display", 1).on(
            "display.uk.check",
            function (t) {
              this.htmleditor.is(":visible") && this.fit();
            }.bind(this)
          ),
          e.push(this);
      },
      addButton: function (t, e) {
        this.buttons[t] = e;
      },
      addButtons: function (e) {
        t.$.extend(this.buttons, e);
      },
      replaceInPreview: function (t, e) {
        function i(t) {
          var e = o.getValue().substring(0, t).split("\n");
          return { line: e.length - 1, ch: e[e.length - 1].length };
        }
        var o = this.editor,
          r = [],
          n = o.getValue(),
          l = -1,
          s = 0;
        return (
          (this.currentvalue = this.currentvalue.replace(t, function () {
            l = n.indexOf(arguments[0], ++l);
            var t = {
                matches: arguments,
                from: i(l),
                to: i(l + arguments[0].length),
                replace: function (e) {
                  o.replaceRange(e, t.from, t.to);
                },
                inRange: function (e) {
                  return e.line === t.from.line && e.line === t.to.line
                    ? e.ch >= t.from.ch && e.ch < t.to.ch
                    : (e.line === t.from.line && e.ch >= t.from.ch) ||
                        (e.line > t.from.line && e.line < t.to.line) ||
                        (e.line === t.to.line && e.ch < t.to.ch);
                },
              },
              a = "string" == typeof e ? e : e(t, s);
            return a || "" === a ? (s++, r.push(t), a) : arguments[0];
          })),
          r
        );
      },
      _buildtoolbar: function () {
        if (this.options.toolbar && this.options.toolbar.length) {
          var t = this,
            e = [];
          this.toolbar.empty(),
            this.options.toolbar.forEach(function (i) {
              if (t.buttons[i]) {
                var o = t.buttons[i].title ? t.buttons[i].title : i;
                e.push(
                  '<li><a data-htmleditor-button="' +
                    i +
                    '" title="' +
                    o +
                    '" data-uk-tooltip>' +
                    t.buttons[i].label +
                    "</a></li>"
                );
              }
            }),
            this.toolbar.html(e.join("\n"));
        }
      },
      fit: function () {
        var t = this.options.mode;
        "split" == t &&
          this.htmleditor.width() < this.options.maxsplitsize &&
          (t = "tab"),
          "tab" == t &&
            (this.activetab ||
              ((this.activetab = "code"),
              this.htmleditor.attr("data-active-tab", this.activetab)),
            this.htmleditor
              .find(".uk-htmleditor-button-code, .uk-htmleditor-button-preview")
              .removeClass("uk-active")
              .filter(
                "code" == this.activetab
                  ? ".uk-htmleditor-button-code"
                  : ".uk-htmleditor-button-preview"
              )
              .addClass("uk-active")),
          this.editor.refresh(),
          this.preview.parent().css("height", this.code.height()),
          this.htmleditor.attr("data-mode", t);
      },
      redraw: function () {
        this._buildtoolbar(), this.render(), this.fit();
      },
      getMode: function () {
        return this.editor.getOption("mode");
      },
      getCursorMode: function () {
        var t = { mode: "html" };
        return this.trigger("cursorMode", [t]), t.mode;
      },
      render: function () {
        return (
          (this.currentvalue = this.editor.getValue()),
          this.currentvalue
            ? (this.trigger("render", [this]),
              this.trigger("renderLate", [this]),
              void this.preview.container.html(this.currentvalue))
            : (this.element.val(""), void this.preview.container.html(""))
        );
      },
      addShortcut: function (e, i) {
        var o = {};
        return (
          t.$.isArray(e) || (e = [e]),
          e.forEach(function (t) {
            o[t] = i;
          }),
          this.editor.addKeyMap(o),
          o
        );
      },
      addShortcutAction: function (t, e) {
        var i = this;
        this.addShortcut(e, function () {
          i.element.trigger("action." + t, [i.editor]);
        });
      },
      replaceSelection: function (t) {
        var e = this.editor.getSelection();
        if (!e.length) {
          for (
            var i = this.editor.getCursor(),
              o = this.editor.getLine(i.line),
              r = i.ch,
              n = r;
            n < o.length && /[\w$]+/.test(o.charAt(n));

          )
            ++n;
          for (; r && /[\w$]+/.test(o.charAt(r - 1)); ) --r;
          var l = r != n && o.slice(r, n);
          l &&
            (this.editor.setSelection(
              { line: i.line, ch: r },
              { line: i.line, ch: n }
            ),
            (e = l));
        }
        var s = t.replace("$1", e);
        this.editor.replaceSelection(s, "end"), this.editor.focus();
      },
      replaceLine: function (t) {
        var e = this.editor.getDoc().getCursor(),
          i = this.editor.getLine(e.line),
          o = t.replace("$1", i);
        this.editor.replaceRange(
          o,
          { line: e.line, ch: 0 },
          { line: e.line, ch: i.length }
        ),
          this.editor.setCursor({ line: e.line, ch: o.length }),
          this.editor.focus();
      },
      save: function () {
        this.editor.save();
      },
    }),
    (t.components.htmleditor.template = [
      '<div class="uk-htmleditor uk-clearfix" data-mode="split">',
      '<div class="uk-htmleditor-navbar">',
      '<ul class="uk-htmleditor-navbar-nav uk-htmleditor-toolbar"></ul>',
      '<div class="uk-htmleditor-navbar-flip">',
      '<ul class="uk-htmleditor-navbar-nav">',
      '<li class="uk-htmleditor-button-code"><a>{:lblCodeview}</a></li>',
      '<li class="uk-htmleditor-button-preview"><a>{:lblPreview}</a></li>',
      '<li><a data-htmleditor-button="fullscreen"><i class="uk-icon-expand"></i></a></li>',
      "</ul>",
      "</div>",
      "</div>",
      '<div class="uk-htmleditor-content">',
      '<div class="uk-htmleditor-code"></div>',
      '<div class="uk-htmleditor-preview"><div></div></div>',
      "</div>",
      "</div>",
    ].join("")),
    t.plugin("htmleditor", "base", {
      init: function (e) {
        function i(t, i, o) {
          e.on("action." + t, function () {
            "html" == e.getCursorMode() &&
              e["replaceLine" == o ? "replaceLine" : "replaceSelection"](i);
          });
        }
        e.addButtons({
          fullscreen: {
            title: "Fullscreen",
            label: '<i class="uk-icon-expand"></i>',
          },
          bold: { title: "Bold", label: '<i class="uk-icon-bold"></i>' },
          italic: { title: "Italic", label: '<i class="uk-icon-italic"></i>' },
          strike: {
            title: "Strikethrough",
            label: '<i class="uk-icon-strikethrough"></i>',
          },
          blockquote: {
            title: "Blockquote",
            label: '<i class="uk-icon-quote-right"></i>',
          },
          link: { title: "Link", label: '<i class="uk-icon-link"></i>' },
          image: { title: "Image", label: '<i class="uk-icon-picture-o"></i>' },
          listUl: {
            title: "Unordered List",
            label: '<i class="uk-icon-list-ul"></i>',
          },
          listOl: {
            title: "Ordered List",
            label: '<i class="uk-icon-list-ol"></i>',
          },
        }),
          i("bold", "<strong>$1</strong>"),
          i("italic", "<em>$1</em>"),
          i("strike", "<del>$1</del>"),
          i("blockquote", "<blockquote><p>$1</p></blockquote>", "replaceLine"),
          i("link", '<a href="http://">$1</a>'),
          i("image", '<img src="http://" alt="$1">');
        var o = function () {
          if ("html" == e.getCursorMode()) {
            for (
              var t = e.editor,
                i = t.getDoc().getCursor(!0),
                o = t.getDoc().getCursor(!1),
                r = i.line;
              r < o.line + 1;
              r++
            )
              t.replaceRange(
                "<li>" + t.getLine(r) + "</li>",
                { line: r, ch: 0 },
                { line: r, ch: t.getLine(r).length }
              );
            t.setCursor({ line: o.line, ch: t.getLine(o.line).length }),
              t.focus();
          }
        };
        e.on("action.listUl", function () {
          o();
        }),
          e.on("action.listOl", function () {
            o();
          }),
          e.htmleditor.on(
            "click",
            'a[data-htmleditor-button="fullscreen"]',
            function () {
              e.htmleditor.toggleClass("uk-htmleditor-fullscreen");
              var i = e.editor.getWrapperElement();
              if (e.htmleditor.hasClass("uk-htmleditor-fullscreen"))
                (e.editor.state.fullScreenRestore = {
                  scrollTop: window.pageYOffset,
                  scrollLeft: window.pageXOffset,
                  width: i.style.width,
                  height: i.style.height,
                }),
                  (i.style.width = ""),
                  (i.style.height = e.content.height() + "px"),
                  (document.documentElement.style.overflow = "hidden");
              else {
                document.documentElement.style.overflow = "";
                var o = e.editor.state.fullScreenRestore;
                (i.style.width = o.width),
                  (i.style.height = o.height),
                  window.scrollTo(o.scrollLeft, o.scrollTop);
              }
              setTimeout(function () {
                e.fit(), t.$win.trigger("resize");
              }, 50);
            }
          ),
          e.addShortcut(["Ctrl-S", "Cmd-S"], function () {
            e.element.trigger("htmleditor-save", [e]);
          }),
          e.addShortcutAction("bold", ["Ctrl-B", "Cmd-B"]);
      },
    }),
    t.plugin("htmleditor", "markdown", {
      init: function (e) {
        function i() {
          e.editor.setOption("mode", "gfm"),
            e.htmleditor
              .find(".uk-htmleditor-button-code a")
              .html(e.options.lblMarkedview);
        }
        function o(t, i, o) {
          e.on("action." + t, function () {
            "markdown" == e.getCursorMode() &&
              e["replaceLine" == o ? "replaceLine" : "replaceSelection"](i);
          });
        }
        var r = e.options.mdparser || marked || null;
        r &&
          (e.options.markdown && i(),
          o("bold", "**$1**"),
          o("italic", "*$1*"),
          o("strike", "~~$1~~"),
          o("blockquote", "> $1", "replaceLine"),
          o("link", "[$1](http://)"),
          o("image", "![$1](http://)"),
          e.on("action.listUl", function () {
            if ("markdown" == e.getCursorMode()) {
              for (
                var t = e.editor,
                  i = t.getDoc().getCursor(!0),
                  o = t.getDoc().getCursor(!1),
                  r = i.line;
                r < o.line + 1;
                r++
              )
                t.replaceRange(
                  "* " + t.getLine(r),
                  { line: r, ch: 0 },
                  { line: r, ch: t.getLine(r).length }
                );
              t.setCursor({ line: o.line, ch: t.getLine(o.line).length }),
                t.focus();
            }
          }),
          e.on("action.listOl", function () {
            if ("markdown" == e.getCursorMode()) {
              var t = e.editor,
                i = t.getDoc().getCursor(!0),
                o = t.getDoc().getCursor(!1),
                r = 1;
              if (i.line > 0) {
                var n,
                  l = t.getLine(i.line - 1);
                (n = l.match(/^(\d+)\./)) && (r = Number(n[1]) + 1);
              }
              for (var s = i.line; s < o.line + 1; s++)
                t.replaceRange(
                  r + ". " + t.getLine(s),
                  { line: s, ch: 0 },
                  { line: s, ch: t.getLine(s).length }
                ),
                  r++;
              t.setCursor({ line: o.line, ch: t.getLine(o.line).length }),
                t.focus();
            }
          }),
          e.on("renderLate", function () {
            "gfm" == e.editor.options.mode &&
              (e.currentvalue = r(e.currentvalue));
          }),
          e.on("cursorMode", function (t, i) {
            if ("gfm" == e.editor.options.mode) {
              var o = e.editor.getDoc().getCursor();
              e.editor.getTokenAt(o).state.base.htmlState ||
                (i.mode = "markdown");
            }
          }),
          t.$.extend(e, {
            enableMarkdown: function () {
              i(), this.render();
            },
            disableMarkdown: function () {
              this.editor.setOption("mode", "htmlmixed"),
                this.htmleditor
                  .find(".uk-htmleditor-button-code a")
                  .html(this.options.lblCodeview),
                this.render();
            },
          }),
          e.on({
            enableMarkdown: function () {
              e.enableMarkdown();
            },
            disableMarkdown: function () {
              e.disableMarkdown();
            },
          }));
      },
    }),
    t.htmleditor
  );
});
