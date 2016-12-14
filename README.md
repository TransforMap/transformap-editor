# TransforMap Editor

Editor talking to [data.transformap.co](https://github.com/TransforMap/data.transformap.co) API.

A live instance is running on github.io: see http://transformap.co/transformap-editor/

## Usage

You can do the following things:

* Edit an existing place: call it with the ?place=UUID parameter, see example: http://transformap.co/transformap-editor/?place=e98fb9126657fd09e8c7e43217000e20
* Add a new place: leave the UUID out, it will generate one on upload.

To move the coordinates on the map, click “Edit Layers” in the bottom left corner, and drag the pin.

To initially set coordinates, click “Draw a marker” in the bottom left corner.

### SUSY Fork

A fork tailored for the SUSY project has its repository [here](https://github.com/susy-partners/transformap-editor)

Its live instance is here: https://susy-partners.github.io/transformap-editor/

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
