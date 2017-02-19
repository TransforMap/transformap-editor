module.exports = {
  npm: {
    styles: {
      leaflet: ['dist/leaflet.css'],
      'leaflet-draw': ['dist/leaflet.draw.css'],
      'bootstrap-css': [
    	  'lib/buttons.css',
    	  'lib/forms.css',
   	  ],
    },
  },

  files: {
    javascripts: {
      joinTo: {
        'vendor.js': /^node_modules/,
        'app.js': /^app/
      }
    },
    stylesheets: {
      joinTo: {
        'vendor.css': /^node_modules/,
        'app.css': /^app/
      }
    }
  },

  plugins: {
    babel: {presets: ['es2015']}
  }
}
