/*
 * This library handles taxonomy related stuff for the transformap editor
 *
 * Mon  3 Oct 15:07:12 CEST 2016
 * Michael Maier (species@github), WTFPL

 * This program is free software. It comes without any warranty, to
 * the extent permitted by applicable law. You can redistribute it
 * and/or modify it under the terms of the Do What The Fuck You Want
 * To Public License, Version 2, as published by Sam Hocevar. See
 * http://www.wtfpl.net/ for more details. */

function getLangTaxURL (lang) {
  if (!lang) {
    console.error('setFilterLang: no lang given')
    return false
  }

  var tax_query =
    'prefix bd: <http://www.bigdata.com/rdf#> ' +
    'prefix wikibase: <http://wikiba.se/ontology#> ' +
    'prefix wdt: <http://base.transformap.co/prop/direct/>' +
    'prefix wd: <http://base.transformap.co/entity/>' +
    'SELECT ?item ?itemLabel ?instance_of ?subclass_of ?type_of_initiative_tag ?wikipedia ?description ' +
    'WHERE {' +
      '?item wdt:P8* wd:Q8 .' +
      '?item wdt:P8 ?subclass_of .' +
      'OPTIONAL { ?item wdt:P4 ?instance_of . }' +
      'OPTIONAL { ?item wdt:P15 ?type_of_initiative_tag }' +
      'OPTIONAL { ?item schema:description ?description FILTER(LANG(?description) = "' + lang + '") }' +
      'OPTIONAL { ?wikipedia schema:about ?item . ?wikipedia schema:inLanguage "en"}' +
      'SERVICE wikibase:label {bd:serviceParam wikibase:language "' + lang + '" }' +
    '}'

  return 'https://query.base.transformap.co/bigdata/namespace/transformap/sparql?query=' + encodeURIComponent(tax_query) + '&format=json'
}

module.exports = {
  getLangTaxURL: getLangTaxURL
}
