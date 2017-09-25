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
    babel: {
      presets: ['es2015']
    },
    envstatic: {
      variables: {
        MOCK_AJAX: "false",
        BASE_URL: process.env.BASE_URL
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
