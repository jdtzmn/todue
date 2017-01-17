'use strict'

const spawn = require('child_process').spawn
const gulp = require('gulp')
const notify = require('gulp-notify')
const gls = require('gulp-live-server')
const uglify = require('gulp-uglify')
const uglifycss = require('gulp-uglifycss')
const sourcemaps = require('gulp-sourcemaps')
const standard = require('gulp-standard')
const concat = require('gulp-concat')
const babel = require('gulp-babel')
const libraries = {
  js: [
    'www/lib/bower_components/jquery/dist/jquery.js',
    'www/lib/bower_components/tether/dist/js/tether.js',
    'www/lib/bower_components/bootstrap/dist/js/bootstrap.js',
    'www/lib/bower_components/react/react.js',
    'www/lib/bower_components/react/react-dom.js',
    'www/lib/bower_components/babel/browser.js',
    'www/lib/bower_components/node-uuid/uuid.js',
    'www/lib/bower_components/moment/min/moment.min.js',
    'www/lib/bower_components/pikaday/pikaday.js',
    'www/lib/bower_components/sugar/dist/sugar.min.js'
  ],
  css: [
    'www/lib/bower_components/bootstrap/dist/css/bootstrap.css',
    'www/lib/bower_components/font-awesome/css/font-awesome.css',
    'www/lib/bower_components/animate.css/animate.css',
    'www/lib/bower_components/pikaday/css/pikaday.css',
    'www/lib/bower_components/awesome-bootstrap-checkbox/awesome-bootstrap-checkbox.css'
  ]
}

gulp.task('js', () => {
  return gulp.src(['www/lib/js/**/*.js'])
    .pipe(standard())
    .pipe(sourcemaps.init())
      .pipe(babel({
        presets: ['es2015', 'react']
      }))
      .pipe(uglify())
      .pipe(concat('scripts.min.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./www/dist/js'))
    .pipe(notify({message: 'JS has been compiled.', onLast: true}))
})

gulp.task('js-lib', () => {
  return gulp.src(libraries.js)
  .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(concat('libraries.min.js'))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('./www/dist/js'))
  .pipe(notify({message: 'JS libraries have been compiled.', onLast: true}))
})

gulp.task('css', () => {
  return gulp.src(libraries.css.concat(['www/lib/css/**/*.css']))
    .pipe(sourcemaps.init())
      .pipe(uglifycss())
      .pipe(concat('styles.min.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./www/dist/css'))
    .pipe(notify({message: 'CSS has been compiled.', onLast: true}))
})

gulp.task('serve', () => {
  var server = gls.new(['index.js'].concat(process.argv.splice(2)))
  server.start()

  gulp.watch(['www/lib/css/**/*.css', 'www/lib/js/**/*.js', 'views/**.pug'], (file) => {
    setTimeout(() => {
      server.notify.apply(server, [file])
    }, 1000)
  })

  gulp.watch('index.js', () => {
    server.start.bind(server)()
  })
})

gulp.task('watch', () => {
  gulp.start(['js'])
  gulp.start(['css'])
  gulp.watch('www/lib/js/**/*.js', ['js'])
  gulp.watch('www/lib/bootstrap_components/**/*.js', ['js-lib'])
  gulp.watch('www/lib/css/**/*.css', ['css'])
})

gulp.task('auto-reload', () => {
  var p, argv

  gulp.watch('gulpfile.js', spawnChildren)
  spawnChildren()

  function spawnChildren (e) {
    if (p) {
      p.kill()
      console.log('Restarting gulp: \n\n')
    }

    p = spawn('gulp', argv && argv.task ? [argv.task] : [], {stdio: 'inherit'})
  }
})

gulp.task('default', () => {
  gulp.start(['watch'])
  gulp.start(['serve'])
})
