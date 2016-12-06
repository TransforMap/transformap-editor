module.exports = {
  npm: {
    styles: {
      leaflet: ['dist/leaflet.css'],
      'leaflet-draw': ['src/leaflet.draw.css']
    }
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
