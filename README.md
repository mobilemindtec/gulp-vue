# gulp-vue
Gulp vue compiller




## Compile CoffeeScript

	  gulp.src(path).pipe(vue(
	    removeBlankLines: true
	    coffee: {
	      compile: true
	      options: {
	        bare: true
	        sourcemap: true
	      }
	    }
	    pug: {
	      compile: false
	      options: {}
	    }
	    pug: {
	      compile: false
	      options: {}
	    }    
	  ).on('error', errorHandler)).pipe(gulp.dest(dest))