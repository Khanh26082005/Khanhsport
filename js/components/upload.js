!(function (e) {
  var t;
  window.UIkit && (t = e(UIkit)),
    "function" == typeof define &&
      define.amd &&
      define("uikit-upload", ["uikit"], function () {
        return t || e(UIkit);
      });
})(function (e) {
  "use strict";
  function t(o, a) {
    function r(t, n) {
      var o = new FormData(),
        a = new XMLHttpRequest();
      if (n.before(n, t) !== !1) {
        for (var r, i = 0; (r = t[i]); i++) o.append(n.param, r);
        for (var l in n.params) o.append(l, n.params[l]);
        a.upload.addEventListener(
          "progress",
          function (e) {
            var t = (e.loaded / e.total) * 100;
            n.progress(t, e);
          },
          !1
        ),
          a.addEventListener(
            "loadstart",
            function (e) {
              n.loadstart(e);
            },
            !1
          ),
          a.addEventListener(
            "load",
            function (e) {
              n.load(e);
            },
            !1
          ),
          a.addEventListener(
            "loadend",
            function (e) {
              n.loadend(e);
            },
            !1
          ),
          a.addEventListener(
            "error",
            function (e) {
              n.error(e);
            },
            !1
          ),
          a.addEventListener(
            "abort",
            function (e) {
              n.abort(e);
            },
            !1
          ),
          a.open(n.method, n.action, !0),
          "json" == n.type && a.setRequestHeader("Accept", "application/json"),
          (a.onreadystatechange = function () {
            if ((n.readystatechange(a), 4 == a.readyState)) {
              var t = a.responseText;
              if ("json" == n.type)
                try {
                  t = e.$.parseJSON(t);
                } catch (o) {
                  t = !1;
                }
              n.complete(t, a);
            }
          }),
          n.beforeSend(a),
          a.send(o);
      }
    }
    if (!e.support.ajaxupload) return this;
    if (((a = e.$.extend({}, t.defaults, a)), o.length)) {
      if ("*.*" !== a.allow)
        for (var i, l = 0; (i = o[l]); l++)
          if (!n(a.allow, i.name))
            return void ("string" == typeof a.notallowed
              ? alert(a.notallowed)
              : a.notallowed(i, a));
      var s = a.complete;
      if (a.single) {
        var d = o.length,
          f = 0,
          p = !0;
        a.beforeAll(o),
          (a.complete = function (e, t) {
            (f += 1),
              s(e, t),
              a.filelimit && f >= a.filelimit && (p = !1),
              p && d > f ? r([o[f]], a) : a.allcomplete(e, t);
          }),
          r([o[0]], a);
      } else
        (a.complete = function (e, t) {
          s(e, t), a.allcomplete(e, t);
        }),
          r(o, a);
    }
  }
  function n(e, t) {
    var n =
      "^" +
      e
        .replace(/\//g, "\\/")
        .replace(/\*\*/g, "(\\/[^\\/]+)*")
        .replace(/\*/g, "[^\\/]+")
        .replace(/((?!\\))\?/g, "$1.") +
      "$";
    return (n = "^" + n + "$"), null !== t.match(new RegExp(n, "i"));
  }
  return (
    e.component("uploadSelect", {
      init: function () {
        var e = this;
        this.on("change", function () {
          t(e.element[0].files, e.options);
          var n = e.element.clone(!0).data("uploadSelect", e);
          e.element.replaceWith(n), (e.element = n);
        });
      },
    }),
    e.component("uploadDrop", {
      defaults: { dragoverClass: "uk-dragover" },
      init: function () {
        var e = this,
          n = !1;
        this.on("drop", function (n) {
          n.dataTransfer &&
            n.dataTransfer.files &&
            (n.stopPropagation(),
            n.preventDefault(),
            e.element.removeClass(e.options.dragoverClass),
            e.element.trigger("dropped.uk.upload", [n.dataTransfer.files]),
            t(n.dataTransfer.files, e.options));
        })
          .on("dragenter", function (e) {
            e.stopPropagation(), e.preventDefault();
          })
          .on("dragover", function (t) {
            t.stopPropagation(),
              t.preventDefault(),
              n || (e.element.addClass(e.options.dragoverClass), (n = !0));
          })
          .on("dragleave", function (t) {
            t.stopPropagation(),
              t.preventDefault(),
              e.element.removeClass(e.options.dragoverClass),
              (n = !1);
          });
      },
    }),
    (e.support.ajaxupload = (function () {
      function e() {
        var e = document.createElement("INPUT");
        return (e.type = "file"), "files" in e;
      }
      function t() {
        var e = new XMLHttpRequest();
        return !!(e && "upload" in e && "onprogress" in e.upload);
      }
      function n() {
        return !!window.FormData;
      }
      return e() && t() && n();
    })()),
    e.support.ajaxupload && e.$.event.props.push("dataTransfer"),
    (t.defaults = {
      action: "",
      single: !0,
      method: "POST",
      param: "files[]",
      params: {},
      allow: "*.*",
      type: "text",
      filelimit: !1,
      before: function (e) {},
      beforeSend: function (e) {},
      beforeAll: function () {},
      loadstart: function () {},
      load: function () {},
      loadend: function () {},
      error: function () {},
      abort: function () {},
      progress: function () {},
      complete: function () {},
      allcomplete: function () {},
      readystatechange: function () {},
      notallowed: function (e, t) {
        alert("Only the following file types are allowed: " + t.allow);
      },
    }),
    (e.Utils.xhrupload = t),
    t
  );
});
