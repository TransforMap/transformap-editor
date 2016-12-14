# TransforMap Editor

Editor talking to [data.transformap.co](https://github.com/TransforMap/data.transformap.co) API.

A live instance is running on github.io: see http://transformap.co/transformap-editor/

## Installation

* clone this repository.
* npm install

## Development

start the watching daemon: ```brunch watch --server -n```

# deployment to gh-pages

* save the contents of the 'public' - folder
* git checkout gh-pages
* cp -ra public/\* .
* in the index.html, change the absolute links ("/app.css", …) to relative ones, remove the slash.
* git add
* git push
