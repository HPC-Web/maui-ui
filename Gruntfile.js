var path = require('path');

module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		jshint: {
			main: [
				'Gruntfile.js',
				'server.js',
				'server/**/*.js'
			]
		},

		nodemon: {
			options: {
				callback: function () {}
			},
			server: {
				script: 'server.js',
				options: {
					ignore: ['node_modules/**'],
					watch: [
						'server.js',
						'server/**/*.js'
					]
				}
			},
			client: {
				script: 'server.js',
				options: {
					env: {
						PORT: '8080'
					}
				}
			}
		},

		clean: [
			'static/css',
			'static/js/templates.js'
		],

		jade: {
			templates: {
				files: {
					'static/js/templates.js': 'src/jade/**/*.jade'
				},
				options: {
					amd: true,
					client: true,
					processName: function (name) {
						return path.basename(name, '.jade');
					}
				}
			}
		},

		less: {
			main: {
				expand: true,
				cwd: 'src/less',
				src: ['**/*.less'],
				dest: 'static/css',
				ext: '.css'
			}
		},

		watch: {
			templates: {
				files: ['src/jade/**/*.jade'],
				tasks: ['jade:templates'],
				options: {
					atBegin: true
				}
			},
			less: {
				files: ['src/less/**/*.less'],
				tasks: ['less:main'],
				options: {
					atBegin: true
				}
			},
			livereload: {
				files: ['src/**', 'server/views/**'],
				options: {
					livereload: true
				}
			}
		},

		concurrent: {
			options: {
				logConcurrentOutput: true,
				limit: 4
			},
			client: {
				tasks: ['watch:templates', 'watch:less', 'watch:livereload', 'nodemon:client']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-nodemon');

	grunt.registerTask('test', ['jshint']);
	grunt.registerTask('assets', ['jade:templates', 'less:main']);
	grunt.registerTask('server', ['assets', 'nodemon:server']);
	grunt.registerTask('default', ['concurrent:client']);
};
