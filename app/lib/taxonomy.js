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

/* takes the language (string:"iso"), and the wished taxonomy (string: "Qnn") */
function getLangTaxURL (lang, taxonomy) {
  if (!lang) {
    console.error('setFilterLang: no lang given');
    return false;
  }

  if (!taxonomy) {
     taxonomy = 'Q8';
  }

  var tax_query =
    'prefix bd: <http://www.bigdata.com/rdf#> ' +
    'prefix wikibase: <http://wikiba.se/ontology#> ' +
    'prefix wdt: <https://base.transformap.co/prop/direct/>' +
    'prefix wd: <https://base.transformap.co/entity/>' +
    'SELECT ?item ?itemLabel ?instance_of ?subclass_of ?type_of_initiative_tag ?interaction_tag ?needs_tag ?identity_tag ?wikipedia ?description ' +
    'WHERE {' +
      '?item wdt:P8* wd:' + taxonomy + ' .' +
      '?item wdt:P8 ?subclass_of .' +
      'OPTIONAL { ?item wdt:P4 ?instance_of . }' +
      'OPTIONAL { ?item wdt:P15 ?type_of_initiative_tag }' +
      'OPTIONAL { ?item wdt:P16 ?interaction_tag }' +
      'OPTIONAL { ?item wdt:P17 ?needs_tag }' +
      'OPTIONAL { ?item wdt:P18 ?identity_tag }' +
      'OPTIONAL { ?item schema:description ?description FILTER(LANG(?description) = "' + lang + '") }' +
      'OPTIONAL { ?wikipedia schema:about ?item . ?wikipedia schema:inLanguage "en"}' +
      'SERVICE wikibase:label {bd:serviceParam wikibase:language "' + lang + '" }' +
    '}';

  return 'https://query.base.transformap.co/bigdata/namespace/transformap/sparql?query=' + encodeURIComponent(tax_query) + '&format=json';
}

module.exports = {
  getLangTaxURL: getLangTaxURL
};
