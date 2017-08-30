module.exports = {
  npm: {
    styles: {
      leaflet: ['dist/leaflet.css'],
      'leaflet-draw': ['dist/leaflet.draw.css'],
    },
  },

  files: {
    javascripts: {
      joinTo: {
        'vendor.js': /^(node_modules|bower_components)/,
        'app.js': /^app/
      }
    },
    stylesheets: {
      joinTo: {
        'vendor.css': /^(node_modules|bower_components)/,
        'app.css': /^app/
      }
    }
  },

  plugins: {
    babel: {
      presets: ['es2015']
    },
    envstatic: {
      variables: {
        MOCK_AJAX: "false"
      }
    }
  },

  overrides: {
    local:{
      plugins: {
        envstatic: {
          variables: {
            MOCK_AJAX: "true"
          }
        }
      }
    }
  }

}
