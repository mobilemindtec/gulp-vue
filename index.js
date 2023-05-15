const vueParser = require('vue-parser')
const CoffeeScript = require('coffeescript')
const through = require('through2')
const replaceExt = require('replace-ext')
const PluginError = require('plugin-error')

module.exports = function(options){

	function clearContent(contents) {
		if(options.removeBlankLines)
			return contents.split('\n').filter(function(x){ return x.trim() != "" }).join("\n")
		return contents
	}

  function replaceExtension(path) {
    var path = path.replace(/\.coffee\.md$/, '.litcoffee')
    return replaceExt(path, '.js')
  }

  function transform (file, encoding, callback){
    
    if (file.isNull())
      return callback(null, file)
    

    if (file.isStream())
      return callback(PluginError('myPlugin', 'Streaming not supported'))
    
 
    contents = file.contents.toString('utf8')

    output = compile(file, contents, options)

    file.contents = new Buffer(output)

    callback(null, file)
	}

	function compile(file, contents, options){

	  var scriptContents = vueParser.parse(contents, 'script', {lang: 'coffee'})
	  var templateContents = vueParser.parse(contents, 'template', {lang: 'pug'})
	  var styleContents = vueParser.parse(contents, 'style', {lang: 'sass'})

	  var scriptContents = clearContent(scriptContents)
	  var templateContents = clearContent(templateContents)
	  var styleContents = clearContent(styleContents)

	  var outScript = scriptContents
	  var outTemplate = templateContents
	  var outStyle = styleContents

	  if(options.coffee && options.coffee.compile){

	    var coffeeCompileOptions = Object.assign({
	      bare: false,
	      header: false,
	      sourceRoot: false,
	      literate: /\.(litcoffee|coffee\.md)$/.test(file.path),
	      filename: file.path,
	      sourceFiles: [file.relative],
	      generatedFile: replaceExtension(file.relative)
	    }, options.coffee.options)  

	  	outScript = CoffeeScript.compile(scriptContents, coffeeCompileOptions)
		}

	  var output = ""
	  output += "<template lang='pug'>" + "\n"
	  output += outTemplate + "\n"
	  output += "</template>" + "\n"
	  output += "\n"

	  output += "<script>" + "\n"
	  output += outScript + "\n"
	  output += "</script>" + "\n"
	  output += "\n"
	  output += "<style lang='sass' scoped>" + "\n"
	  output += outStyle + "\n"
	  output += "</style lang='sass' scoped>" + "\n"
	  return output
	}	

  return through.obj(transform)

}