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

  console.log(language);
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

var supported_languages = [],
    langnames = [],
    abbr_langnames = {},
    langnames_abbr = {};
function initializeLanguageSwitcher(returned_data){
  var lang;
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
    
    langnames.forEach(function (item) {
      var langcode = langnames_abbr[item];
      var is_default = (langcode == current_lang) ? " class=default" : "";
      console.log("adding lang '" + langcode + "' (" + item + ")"); 
      $("#languageSelector ul").append("<li targetlang=" + langcode + is_default + " onClick='window.translations.switchToLang(\""+langcode+"\");'>"+item+"</li>");
    });
  });
}

function switchToLang(lang) {
  $("#languageSelector li.default").removeClass("default");
  $("#languageSelector li[targetlang="+lang+"]").addClass("default");
  current_lang = lang;
  window.translations.current_lang = lang;
  window.translations.fetchAndSetNewTranslation(lang);
  setFallbackLangs();
/*
  //updateTranslatedTexts();

  if(! dictionary[lang]) {
    var dict_uri = "https://raw.githubusercontent.com/TransforMap/transformap-viewer-translations/master/json/"+lang+".json";

    $.ajax({
      url: dict_uri,
      context: { lang: current_lang },
      success: function(returned_data) {
        var trans_jsonobj = JSON.parse(returned_data);

        if(! dictionary[this.lang])
          dictionary[this.lang] = {};
        for (item in trans_jsonobj) {
          var index = reverse_dic[item];
          dictionary[this.lang][index] = trans_jsonobj[item];
        }

        console.log("successfully fetched " + this.lang);
        //updateTranslatedTexts();

      }
    });

  }

  // As rebuilding the filters does not yet support advanced mode by default,
  // we switch to simple mode, as language switching is a very rare case.
  if(getFilterMode() == "advanced")
    toggleAdvancedFilterMode();

  resetFilter();
  setFilterLang(lang);
*/
  console.log("new lang:" +lang);
}

// if wishedLang is in supported, OK
// shorten wishedLang and see if in supported
// take fallback
function selectAllowedLang(wishedLang) {
  console.log("selectAllowedLang(" + wishedLang + ") called")
  if(wishedLang) {
    if(supported_languages.indexOf(wishedLang) != -1) {
      current_lang = wishedLang
      return current_lang
    }
    console.log("not in supported, try shorten")
    var short_lang = wishedLang.match(/^([a-zA-Z]*)-/)[1];
    console.log("short: " + short_lang)
    if(short_lang) {
      if(supported_languages.indexOf(short_lang) != -1) {
        current_lang = short_lang
        console.log("current_lang set to " + short_lang)
        return current_lang
      }
    }
  }
  setFallbackLangs()
  if(fallback_langs[0]) {
    if(supported_languages.indexOf(fallback_langs[0]) != -1) {
      current_lang = fallback_langs[0]
      return current_lang
    }
  }
  current_lang = 'en'
  return current_lang
}

var browser_languages = getLangs(),
    current_lang = browser_languages[0],
    fallback_langs = [];

module.exports = {
  getLangs: getLangs,
  initializeLanguageSwitcher: initializeLanguageSwitcher,
  supported_languages: supported_languages,
  browser_languages: browser_languages,
  current_lang: current_lang,
  switchToLang: switchToLang,
  selectAllowedLang: selectAllowedLang
}
