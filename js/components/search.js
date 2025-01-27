!(function (e) {
  var s;
  window.UIkit && (s = e(UIkit)),
    "function" == typeof define &&
      define.amd &&
      define("uikit-search", ["uikit"], function () {
        return s || e(UIkit);
      });
})(function (e) {
  "use strict";
  e.component("search", {
    defaults: {
      msgResultsHeader: "Search Results",
      msgMoreResults: "More Results",
      msgNoResults: "No results found",
      template:
        '<ul class="uk-nav uk-nav-search uk-autocomplete-results"> {{#msgResultsHeader}}<li class="uk-nav-header uk-skip">{{msgResultsHeader}}</li>{{/msgResultsHeader}}                                      {{#items && items.length}}                                          {{~items}}                                          <li data-url="{{!$item.url}}">                                              <a href="{{!$item.url}}">                                                  {{{$item.title}}}                                                  {{#$item.text}}<div>{{{$item.text}}}</div>{{/$item.text}}                                              </a>                                          </li>                                          {{/items}}                                          {{#msgMoreResults}}                                              <li class="uk-nav-divider uk-skip"></li>                                              <li class="uk-search-moreresults" data-moreresults="true"><a href="#" onclick="jQuery(this).closest(\'form\').submit();">{{msgMoreResults}}</a></li>                                          {{/msgMoreResults}}                                      {{/end}}                                      {{^items.length}}                                        {{#msgNoResults}}<li class="uk-skip"><a>{{msgNoResults}}</a></li>{{/msgNoResults}}                                      {{/end}}                                  </ul>',
      renderer: function (e) {
        var s = this.options;
        this.dropdown.append(
          this.template({
            items: e.results || [],
            msgResultsHeader: s.msgResultsHeader,
            msgMoreResults: s.msgMoreResults,
            msgNoResults: s.msgNoResults,
          })
        ),
          this.show();
      },
    },
    boot: function () {
      e.$html.on("focus.search.uikit", "[data-uk-search]", function (s) {
        var t = e.$(this);
        t.data("search") ||
          e.search(t, e.Utils.options(t.attr("data-uk-search")));
      });
    },
    init: function () {
      var s = this;
      (this.autocomplete = e.autocomplete(this.element, this.options)),
        this.autocomplete.dropdown.addClass("uk-dropdown-search"),
        this.autocomplete.input
          .on("keyup", function () {
            s.element[s.autocomplete.input.val() ? "addClass" : "removeClass"](
              "uk-active"
            );
          })
          .closest("form")
          .on("reset", function () {
            (s.value = ""), s.element.removeClass("uk-active");
          }),
        this.on("selectitem.uk.autocomplete", function (e, t) {
          t.url
            ? (location.href = t.url)
            : t.moreresults && s.autocomplete.input.closest("form").submit();
        }),
        this.element.data("search", this);
    },
  });
});
