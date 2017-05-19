'use strict'

module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-contrib-watch')

  grunt.initConfig({
    copy: {
      assets: {
        files: [
          {
            expand: true,
            cwd: 'src',
            src: '**',
            dest: 'lib/',
            filter: function (filepath) {
              return (filepath.substr(filepath.length - 3) === 'css' || filepath.substr(filepath.length - 4) === 'scss' || filepath.substr(filepath.length - 4) === 'less')
            }
          }
        ]
      }
    },
    watch : {
      assets: {
        files: 'src/**/**',
        filter: function (filepath) {
          return (filepath.substr(filepath.length - 3) === 'css' || filepath.substr(filepath.length - 4) === 'scss' || filepath.substr(filepath.length - 4) === 'less')
        },
        tasks: ['copy'],
        options: {
          spawn: true,
          events: 'all'
        }
      },
    }
  })

  grunt.registerTask('default', [
    'copy'
  ])

  grunt.registerTask('dev', [
    'watch'
  ])
}
