// mostly taken from https://github.com/TransforMap/transformap-viewer/blob/gh-pages/scripts/map.js

function getLangs () {
  var language = window.navigator.languages ? window.navigator.languages[0] : (window.navigator.language || window.navigator.userLanguage);

  if(typeof language === 'string')
      language = [ language ];

  // we need to have the following languages:
  // browserlang
  // a short one (de instead of de-AT) if not present
  // en as fallback if not present

  for(var i = 0; i < language.length; i++) {
      if(language[i].match(/-/)) {
          var short_lang = language[i].match(/^([a-zA-Z]*)-/)[1];
          if(language.indexOf(short_lang) == -1) {
              language.push(short_lang);
              continue;
          }
      }
  }

  if(language.indexOf("en") == -1)
      language.push("en");

  //console.log(language);
  return language;
}

function setFallbackLangs() {
  fallback_langs = [];
  if(current_lang != "en") {
    for(var i=0; i < browser_languages.length; i++) {
      var abbr = browser_languages[i];
      if(current_lang != abbr)
        fallback_langs.push(abbr);
    }
  }
  console.log("new fallback langs: " + fallback_langs.join(",") + ".");
}

function resetLang() {
  current_lang = "en";
  for(var i=0; i < browser_languages.length; i++) {
    var abbr = browser_languages[i];
    if(abbr_langnames[abbr]) {
      current_lang = abbr;
      break;
    }
  }
  switchToLang(current_lang);
}

/* get languages for UI from our Wikibase, and pick languages that are translated there */

function initializeLanguageSwitcher(returned_data){
  for(lang in returned_data.entities.Q5.labels) { //Q5 is arbitrary. Choose one that gets translated for sure.
    supported_languages.push(lang);
  }
  var langstr = supported_languages.join("|");
  
  var langstr_query =
    'SELECT ?lang ?langLabel ?abbr ' +
    'WHERE' +
    '{' +
      '?lang wdt:P218 ?abbr;' +
      'FILTER regex (?abbr, "^('+langstr+')$").' +
      'SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }' +
    '}';
  
  langstr_query = 'https://query.wikidata.org/bigdata/namespace/wdq/sparql?query=' +encodeURIComponent(langstr_query) + "&format=json";
  $.getJSON(langstr_query, function (langstrings){
    
    langstrings.results.bindings.forEach(function (item) {
      abbr_langnames[item.abbr.value] = item.langLabel.value;
      langnames_abbr[item.langLabel.value] = item.abbr.value;
      langnames.push(item.langLabel.value);
    });
    langnames.sort();
    
    resetLang();
    setFallbackLangs();
    
    //no JQUERY! 
    // #menu .append
    $("#map-menu-container .top").append(
        "<div id=languageSelector onClick=\"$('#languageSelector ul').toggleClass('open');\">" +
          "<span lang=en>Choose Language:</span>" +
          "<ul></ul>" +
        "</div>");
    
    langnames.forEach(function (item) {
      var langcode = langnames_abbr[item];
      var is_default = (langcode == current_lang) ? " class=default" : "";
      console.log("adding lang '" + langcode + "' (" + item + ")"); 
      $("#languageSelector ul").append("<li targetlang=" + langcode + is_default + " onClick='switchToLang(\""+langcode+"\");'>"+item+"</li>");
    });
  });
}
redundantFetch( [ "https://base.transformap.co/wiki/Special:EntityData/Q5.json", "https://raw.githubusercontent.com/TransforMap/transformap-viewer/Q5-fallback.json", "Q5-fallback.json" ],
  initializeLanguageSwitcher,
  function(error) { console.error("none of the lang init data urls available") } );

