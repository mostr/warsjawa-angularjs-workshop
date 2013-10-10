module.exports = function(grunt) {

  var proxyRequests = require('grunt-connect-proxy/lib/utils').proxyRequest;
  var liveReload = require('connect-livereload')({port: 9988});

  grunt.initConfig({

    watch: {
      livereload: {
        options: {
          livereload: {
            port: 9988
          }
        },
        files: [
          'public/scripts/**/*.js',
          'public/styles/**/*.css',
          'public/index.html',
          'public/templates/**/*.html'
        ]
      }
    },

    connect: {
      proxies: [{context: '/api/', host: 'localhost', port: 3000}],
      options: {
          port: 9090,
          hostname: 'localhost'
      },

      livereload: {
        options: {
          middleware: function (connect) {
            return [
              proxyRequests,
              liveReload,
              connect.static('public')
            ];
          }
        }
      }
    },

    nodemon: {
      dev: {
        options: {
          file: 'server/app.js',
          watchedExtensions: ['js'],
          watchedFolders: ['server'],
          delayTime: 1,
          cwd: __dirname
        }
      }
    },

    concurrent: {
      dev: {
        tasks: ['nodemon', 'server'],
        options: {
          logConcurrentOutput: true
        }
      }
    }

  });

  require('matchdep').filterDev('grunt-*').forEach(function (dep) {
      grunt.loadNpmTasks(dep);
  });

  grunt.registerTask('server', [
    'configureProxies',
    'connect:livereload',
    'watch']
  );

  grunt.registerTask('default', ['concurrent']);

};